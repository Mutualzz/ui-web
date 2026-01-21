import type {
    ColorLike,
    ColorResult,
    HsvaColor,
    Responsive,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import {
    constructLinearGradient,
    createColor,
    extractColors,
    formatColor,
    handleColor,
    isValidGradient,
    randomColor,
    resolveResponsiveMerge,
    resolveSize,
    styled,
    useColorInput,
} from "@mutualzz/ui-core";
import { forwardRef, useMemo, useState, type ChangeEvent } from "react";
import { Button } from "../Button/Button";
import { ColorPicker } from "../ColorPicker/ColorPicker";
import { IconButton } from "../IconButton/IconButton";
import { InputBase } from "../InputBase/InputBase";
import { InputDecoratorWrapper } from "../InputDecoratorWrapper/InputDecoratorWrapper";
import { InputRoot } from "../InputRoot/InputRoot";
import { Popover } from "../Popover/Popover";
import { useTheme } from "../useTheme";
import {
    resolveColorPickerButtonSize,
    resolveColorPickerButtonStyles,
    toGradientStops,
} from "./InputColor.helpers";
import type { InputColorProps } from "./InputColor.types";

const baseIconSize = {
    sm: 8,
    md: 12,
    lg: 16,
};

interface RandomIconProps {
    color: ColorLike;
    size: Responsive<Size | SizeValue | number>;
    variant?: Responsive<Variant>;
}

const RandomIcon = ({ color, size, variant }: RandomIconProps) => {
    const { theme } = useTheme();

    const { size: resolvedSize, variant: resolvedVariant } =
        resolveResponsiveMerge(
            theme,
            { size, variant },
            ({ size: s, variant: v }) => ({
                size: resolveSize(theme, s, baseIconSize),
                variant: v,
            }),
        );

    const resolvedColor = formatColor(theme.typography.colors.primary, {
        format: "hexa",
    });

    return (
        <svg
            fill={resolvedColor}
            height={resolvedSize}
            width={resolvedSize}
            viewBox={`0 0 512 512`}
            css={{ display: "block" }}
        >
            <g strokeWidth="0"></g>
            <g strokeLinecap="round" strokeLinejoin="round"></g>
            <g>
                <path d="M341.3,28.3v85.3H128c-70.7,0-128,57.3-128,128c0,21.5,5.8,41.4,15.2,59.2L68,263.2c-2.4-6.8-4-13.9-4-21.5 c0-35.4,28.7-64,64-64h213.3V263L512,156.3V135L341.3,28.3z M444,262.8c2.4,6.8,4,13.9,4,21.5c0,35.4-28.6,64-64,64H170.7V263 L0,369.7V391l170.7,106.7v-85.3H384c70.7,0,128-57.3,128-128c0-21.5-5.8-41.4-15.2-59.2L444,262.8z"></path>
            </g>
        </svg>
    );
};

const ColorPickerButton = styled(Button)(
    ({ theme, color = "neutral", variant = "solid", size = "md" }) => ({
        ...resolveResponsiveMerge(
            theme,
            { color, variant, size },
            ({ color: c, variant: v, size: s }) => ({
                ...resolveColorPickerButtonStyles(theme, c)[v],
                ...resolveColorPickerButtonSize(theme, s),
            }),
        ),

        padding: 0,
    }),
);

const InputColor = forwardRef<HTMLInputElement, InputColorProps>(
    (
        {
            variant = "outlined",
            size = "md",
            startDecorator,
            endDecorator,
            fullWidth = false,
            disabled = false,
            showColorPicker = true,
            showRandom = false,
            value: colorProp,
            allowGradient = false,
            allowAlpha = false,
            onChange,
            onChangeResult,
            defaultValue,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();

        const isControlled = colorProp !== undefined;

        const [internalValue, setInternalValue] = useState<ColorLike>(
            defaultValue ?? randomColor("hex"),
        );

        const [gradientRotation, setGradientRotation] = useState(90);
        const [focusedStop, setFocusedStop] = useState(0);

        const currentValue = isControlled
            ? isValidGradient(colorProp)
                ? toGradientStops(colorProp)
                : colorProp
            : internalValue;
        const [pickerColor, setPickerColor] = useState<HsvaColor | HsvaColor[]>(
            () => {
                try {
                    return Array.isArray(currentValue)
                        ? currentValue
                        : (handleColor(currentValue).hsva ??
                              handleColor(randomColor("hsv")).hsva);
                } catch {
                    // If the color is invalid, fallback to a random color
                    return handleColor(randomColor("hsv")).hsva;
                }
            },
        );

        const {
            inputValue,
            color: validatedColor,
            isInvalid,
            handleChange,
            validate,
            setColorDirectly,
        } = useColorInput(
            Array.isArray(currentValue)
                ? handleColor(currentValue[0]).hex
                : currentValue,
            100,
            "hex",
            allowGradient,
        );

        const handleNewColor = (
            newColor: ColorResult | ColorResult[],
            stop?: number,
        ) => {
            if (Array.isArray(newColor)) {
                const finalStop = stop ?? 0;
                setColorDirectly(newColor[finalStop].hex);

                setPickerColor(newColor.map((c) => c.hsva));

                if (!isControlled) setInternalValue(newColor[finalStop].hex);

                onChangeResult?.(newColor[finalStop]);
                if (newColor.length > 1) {
                    onChange?.(
                        constructLinearGradient(
                            gradientRotation,
                            newColor.map((c, i, arr) => ({
                                color: c.hex,
                                position: (i / (arr.length - 1)) * 100,
                            })),
                        ),
                    );
                } else {
                    onChange?.(newColor[0].hex);
                }
                return;
            }

            setColorDirectly(newColor.hex);
            setPickerColor(newColor.hsva);

            if (!isControlled) setInternalValue(newColor.hex);

            onChangeResult?.(newColor);
            onChange?.(newColor.hex);
        };

        const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value as ColorLike;

            if (typeof newValue !== "string") return;

            const color = handleColor(newValue);

            handleChange(color.hex);

            try {
                setPickerColor(color.hsva);
            } catch {
                // Ignore invalid color input
            }
            if (!isControlled) setInternalValue(color.hex);

            onChangeResult?.(color);
            onChange?.(newValue);
        };

        const handleRandomColor = () => {
            let newColor = randomColor("hex");
            if (typeof pickerColor === "string" && isValidGradient(pickerColor))
                newColor = randomColor("linear-gradient");
            setColorDirectly(newColor);

            const colorResult = handleColor(newColor);

            setPickerColor(colorResult.hsva);
            if (!isControlled) setInternalValue(newColor);
            onChangeResult?.(colorResult);
            onChange?.(newColor);
        };

        const colorToShow = useMemo(() => {
            let color = validatedColor;
            try {
                if (isValidGradient(color)) {
                    const extracted = extractColors(color);
                    if (extracted && extracted.length > 0) {
                        color = extracted[0];
                    }
                }
            } catch {
                color = validatedColor;
            }
            return color;
        }, [validatedColor]);

        const formattedTextColor = useMemo(() => {
            if (isInvalid) return theme.colors.danger;
            try {
                const negate = createColor(colorToShow).isDark();
                return formatColor(colorToShow, {
                    format: "hex",
                    negate,
                });
            } catch {
                return formatColor(theme.typography.colors.primary, {
                    format: "hex",
                });
            }
        }, [
            colorToShow,
            isInvalid,
            theme.typography.colors.primary,
            theme.colors.danger,
        ]);

        return (
            <InputRoot
                color={isInvalid ? "danger" : (colorToShow as any)}
                textColor={isInvalid ? theme.colors.danger : formattedTextColor}
                variant={variant}
                size={size}
                fullWidth={fullWidth}
                error={isInvalid}
                disabled={disabled}
                {...props}
            >
                <InputDecoratorWrapper position="start">
                    {startDecorator ??
                        (showColorPicker && !isInvalid && (
                            <Popover
                                trigger={
                                    <ColorPickerButton
                                        size={size}
                                        color={colorToShow}
                                        variant={variant}
                                    />
                                }
                                color={colorToShow}
                                size={size}
                                elevation={5}
                                css={{
                                    padding: 8,
                                }}
                            >
                                <ColorPicker
                                    color={pickerColor}
                                    onChange={handleNewColor}
                                    allowGradient={allowGradient}
                                    rotation={gradientRotation}
                                    onRotationChange={setGradientRotation}
                                    currentStop={focusedStop}
                                    onStopChange={setFocusedStop}
                                />
                            </Popover>
                        ))}
                </InputDecoratorWrapper>

                <InputBase
                    {...(props as any)}
                    type="text"
                    value={inputValue}
                    onChange={handleOnChange}
                    onBlur={validate}
                    size={size as any}
                    fullWidth={fullWidth}
                    disabled={disabled}
                    ref={ref}
                />

                <InputDecoratorWrapper position="end">
                    {endDecorator ??
                        (showRandom && (
                            <IconButton
                                color={isInvalid ? "danger" : colorToShow}
                                variant={variant}
                                onClick={handleRandomColor}
                                css={{
                                    padding: 4,
                                }}
                            >
                                <RandomIcon
                                    color={
                                        isInvalid
                                            ? theme.colors.danger
                                            : colorToShow
                                    }
                                    size={size}
                                    variant={variant}
                                />
                            </IconButton>
                        ))}
                </InputDecoratorWrapper>
            </InputRoot>
        );
    },
);

export { InputColor };

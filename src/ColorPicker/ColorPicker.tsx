import {
    Alpha,
    hexToHsva,
    hsvaToHex,
    hsvaToRgbaString,
    Hue,
    Saturation,
} from "@mutualzz/color-picker";
import {
    constructLinearGradient,
    handleColor,
    randomColor,
    type ColorLike,
    type HsvaColor,
} from "@mutualzz/ui-core";
import { Box } from "Box/Box";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { Stack } from "Stack/Stack";
import { Button } from "../Button/Button";
import { useTheme } from "../useTheme";
import { toStops } from "./ColorPicker.helpers";
import type { ColorPickerProps } from "./ColorPicker.types";
import { Pointer } from "./Pointer";

// TODO: make sure that the color picker reflects the InputColor for controlled beahvior with gradients
const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
    (
        {
            onChange,
            onChangeGradient,
            color,
            allowGradient,
            allowAlpha,
            css,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();

        const [stops, setStops] = useState<HsvaColor[]>(() => toStops(color));
        const [currentStop, setCurrentStop] = useState(0);

        const lastSyncedColor = useRef<typeof color>(color);

        useEffect(() => {
            if (allowGradient && stops.length > 1) return;

            if (lastSyncedColor.current === color) return;

            const next = toStops(color);
            setStops(next);
            setCurrentStop((i) => Math.min(i, next.length - 1));
            lastSyncedColor.current = color;
        }, [color, allowGradient, stops.length]);

        const hsva = useMemo(() => {
            const c =
                stops[currentStop] ??
                stops[stops.length - 1] ??
                handleColor(randomColor("hsv")).hsv;
            return c;
        }, [stops, currentStop]);

        const emitSingleOrGradient = (nextStops: HsvaColor[]) => {
            if (nextStops.length > 1) {
                onChangeGradient?.(nextStops.map((s) => handleColor(s)));
            } else {
                onChange?.(handleColor(nextStops[0]));
            }
        };

        const handleChange = (value: HsvaColor) => {
            setStops((prev) => {
                const next = [...prev];
                next[currentStop] = value;
                emitSingleOrGradient(next);
                return next;
            });
        };

        const addStop = () => {
            if (stops.length === 5) return;
            const base = hsva ?? hexToHsva(theme.colors.background);
            const newStop: HsvaColor = {
                ...base,
                h: ((base.h ?? 0) + 40) % 360,
            };

            setStops((prev) => {
                const next = [...prev, newStop];
                // After add, we’re definitely a gradient—emit gradient only
                onChangeGradient?.(next.map((s) => handleColor(s)));
                return next;
            });
            setCurrentStop(() => stops.length); // focus the new stop
        };

        const previewColor =
            stops.length > 1
                ? constructLinearGradient(
                      90,
                      stops.map((stop) => handleColor(stop).hex),
                  )
                : hsvaToHex(hsva);

        return (
            <Stack
                direction="column"
                ref={ref}
                css={css}
                width={200}
                position="relative"
                spacing={5}
                {...props}
            >
                {allowGradient && (
                    <Stack
                        width="100%"
                        height="2rem"
                        borderRadius={10}
                        p="1rem"
                        justifyContent="space-between"
                        alignItems="center"
                        css={{
                            background: previewColor,
                        }}
                        mb={5}
                    >
                        {stops.length > 1 &&
                            stops.map((stop, i) => (
                                <Box
                                    key={`gradient-box-${i}`}
                                    width={24}
                                    css={{
                                        position: "relative",
                                        background: hsvaToHex(stop),
                                        cursor:
                                            currentStop === i
                                                ? "default"
                                                : "pointer",

                                        ...(currentStop === i && {
                                            "&::after": {
                                                content: '""',
                                                position: "absolute",
                                                display: "block",
                                                bottom: -5,
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                width: 0,
                                                height: 0,
                                                borderLeft:
                                                    "4px solid transparent",
                                                borderRight:
                                                    "4px solid transparent",
                                                borderTop: `4px solid ${theme.colors.common.white}`,
                                                pointerEvents: "none",
                                                zIndex: 1,
                                            },
                                        }),
                                    }}
                                    borderRadius={5}
                                    border={`1px solid ${theme.colors.common.white}`}
                                    height={24}
                                    onClick={() =>
                                        currentStop !== i && setCurrentStop(i)
                                    }
                                />
                            ))}
                    </Stack>
                )}
                <Saturation
                    hsva={hsva}
                    radius="8px 8px 0 0"
                    css={{
                        width: "auto",
                        height: 150,
                        minWidth: 120,
                        borderBottom: "12px solid #000",
                    }}
                    pointer={({ left, top }) => (
                        <Pointer css={{ left, top }} color={hsvaToHex(hsva)} />
                    )}
                    onChange={(newColor) =>
                        handleChange({ ...hsva, ...newColor })
                    }
                />
                <Hue
                    hue={hsva.h}
                    height={24}
                    radius={!allowAlpha ? "0 0 8px 8px" : 0}
                    onChange={(newHue) => handleChange({ ...hsva, ...newHue })}
                    pointer={({ left }) => (
                        <Pointer
                            css={{
                                left,
                                transform: "translate(-16px, -3px)",
                            }}
                            color={
                                `hsl(${hsva.h || 0}deg 100% 50%)` as ColorLike
                            }
                        />
                    )}
                />
                {allowGradient && (
                    <Button
                        color="primary"
                        disabled={stops.length === 5}
                        onClick={() => addStop()}
                    >
                        Add Color
                    </Button>
                )}
                {allowAlpha && (
                    <Alpha
                        hsva={hsva}
                        height={24}
                        radius="0 0 8px 8px"
                        pointer={({ left }) => (
                            <Pointer
                                css={{
                                    left,
                                    transform: "translate(-16px, -5px)",
                                }}
                                color={hsvaToRgbaString(hsva)}
                            />
                        )}
                        onChange={(newAlpha) =>
                            handleChange({ ...hsva, ...newAlpha })
                        }
                    />
                )}
            </Stack>
        );
    },
);

ColorPicker.displayName = "ColorPicker";

export { ColorPicker };

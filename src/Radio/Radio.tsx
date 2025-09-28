import type { Responsive, Size, SizeValue } from "@mutualzz/ui-core";
import { resolveResponsiveMerge, styled } from "@mutualzz/ui-core";
import {
    type ChangeEvent,
    forwardRef,
    useContext,
    useRef,
    useState,
} from "react";
import { RadioGroupContext } from "../RadioGroup/RadioGroup.context";
import {
    resolveIconScaling,
    resolveRadioSize,
    resolveRadioStyles,
} from "./Radio.helpers";
import type { RadioProps } from "./Radio.types";

const RadioWrapper = styled("div")<RadioProps>(
    ({ theme, disabled, size = "md" }) => ({
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        cursor: "pointer",
        userSelect: "none",
        transition: "all 0.3s ease",
        ...(disabled && {
            opacity: 0.5,
            pointerEvents: "none",
            cursor: "not-allowed",
        }),
        ...resolveResponsiveMerge(theme, { size }, ({ size: s }) => ({
            ...resolveRadioSize(theme, s),
        })),
    }),
);

RadioWrapper.displayName = "RadioWrapper";

const HiddenRadio = styled("input")({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    cursor: "pointer",
    margin: 0,
    padding: 0,
    opacity: 0,
});

HiddenRadio.displayName = "HiddenRadio";

const RadioControl = styled("span")<RadioProps>(({
    theme,
    color = "primary",
    variant = "plain",
    checked,
}) => {
    const baseStyles = {
        position: "relative" as const,
        width: "1em",
        height: "1em",
        border: "1px solid currentColor",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease",
        borderRadius: "50%",
        padding: 0,
    };

    const { variantStyle, checkedStyle } = resolveResponsiveMerge(
        theme,
        {
            color,
            variant,
        },
        ({ color: c, variant: v }) => ({
            variantStyle: resolveRadioStyles(theme, c, checked)[v],
            checkedStyle: resolveRadioStyles(theme, c, true)[v],
        }),
    );

    return {
        ...baseStyles,
        ...variantStyle,

        'input[type="radio"]:hover + &': checkedStyle,

        'input[type="radio"]:active + &': checkedStyle,

        'input[type="radio"]:focus-visible + &': {
            boxShadow: `0 0 0 3px ${checkedStyle.backgroundColor}`,
            outline: "none",
        },
    };
});

RadioControl.displayName = "RadioControl";

const RadioLabel = styled("span")<{ rtl?: boolean; disabled?: boolean }>(
    ({ rtl, disabled }) => ({
        ...(disabled && {
            cursor: "not-allowed",
        }),
        ...(rtl ? { marginRight: "0.5em" } : { marginLeft: "0.5em" }),
    }),
);

RadioLabel.displayName = "RadioLabel";

const IconWrapper = styled("span")<{
    size?: Responsive<Size | SizeValue | number>;
}>(({ theme, size = "md" }) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",

    "& > *": {
        width: "100%",
        height: "100%",
    },

    ...resolveResponsiveMerge(theme, { size }, ({ size: s }) => ({
        ...resolveIconScaling(theme, s),
    })),
}));

IconWrapper.displayName = "IconWrapper";

/**
 *  Radio component for selecting options.
 *  It supports different sizes, colors, and variants.
 *  The component can be controlled or uncontrolled.
 *  It can display custom icons for checked and unchecked states.
 *  The component can be used with a label and supports RTL layout.
 *  The `onChange` event handler is called when the radio state changes.
 *  The `disabled` prop can be used to disable the radio input.
 *  The `name` and `value` props are used to group radio inputs and set the value.
 *  The `checkedIcon` and `uncheckedIcon` props allow for custom icons
 *  to be displayed in the checked and unchecked states, respectively.
 *  The `rtl` prop can be used to control the layout direction.
 */
const Radio = forwardRef<HTMLInputElement, RadioProps>(
    (
        {
            checked: controlledChecked,
            onChange: propOnChange,
            label,
            disabled: propDisabled,
            defaultChecked,
            color: colorProp,
            variant: variantProp,
            size: sizeProp,
            name: propName,
            value,
            checkedIcon,
            uncheckedIcon,
            rtl,
            ...props
        },
        ref,
    ) => {
        const group = useContext(RadioGroupContext);
        const [internalChecked, setInternalChecked] =
            useState(!!defaultChecked);
        const inputRef = useRef<HTMLInputElement>(null);

        let isChecked: boolean;
        if (group && value !== undefined) isChecked = group.value === value;
        else if (controlledChecked !== undefined) isChecked = controlledChecked;
        else isChecked = internalChecked;

        const color = colorProp ?? group?.color ?? "primary";
        const variant = variantProp ?? group?.variant ?? "solid";
        const size = sizeProp ?? group?.size ?? "md";
        const name = group?.name ?? propName;
        const disabled = group?.disabled ?? propDisabled;

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            if (group && value !== undefined) group.onChange?.(e, value);
            else if (controlledChecked === undefined)
                setInternalChecked(e.target.checked);

            propOnChange?.(e);
        };

        const handleWrapperClick = () => {
            if (!disabled && inputRef.current) {
                inputRef.current.click();
            }
        };

        return (
            <RadioWrapper
                aria-checked={isChecked}
                role="radio"
                disabled={disabled}
                tabIndex={disabled ? -1 : 0}
                size={size}
                onClick={handleWrapperClick}
            >
                <HiddenRadio
                    type="radio"
                    name={name}
                    value={value}
                    checked={isChecked}
                    onChange={handleChange}
                    disabled={disabled}
                    ref={(node) => {
                        inputRef.current = node;
                        if (typeof ref === "function") ref(node);
                        else if (ref) ref.current = node;
                    }}
                    {...props}
                    css={{
                        pointerEvents: "none",
                    }}
                />
                {rtl && label && (
                    <RadioLabel rtl={rtl} disabled={disabled}>
                        {label}
                    </RadioLabel>
                )}
                <RadioControl
                    name={name}
                    role="radio"
                    aria-checked={isChecked}
                    color={color as string}
                    variant={variant}
                    checked={isChecked}
                    disabled={disabled}
                    size={size}
                >
                    {isChecked ? (
                        checkedIcon ? (
                            <IconWrapper size={size}>{checkedIcon}</IconWrapper>
                        ) : (
                            <IconWrapper size={size}>
                                <svg
                                    viewBox="0 0 24 24"
                                    css={{
                                        fill: "currentColor",
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <circle cx="12" cy="12" r={8} />
                                </svg>
                            </IconWrapper>
                        )
                    ) : uncheckedIcon ? (
                        <IconWrapper size={size}>{uncheckedIcon}</IconWrapper>
                    ) : null}
                </RadioControl>
                {!rtl && label && (
                    <RadioLabel rtl={rtl} disabled={disabled}>
                        {label}
                    </RadioLabel>
                )}
            </RadioWrapper>
        );
    },
);

Radio.displayName = "Radio";

export { Radio };

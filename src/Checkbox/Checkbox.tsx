import type { Responsive, Size, SizeValue } from "@mutualzz/ui-core";
import { resolveResponsiveMerge, styled } from "@mutualzz/ui-core";
import {
    forwardRef,
    useContext,
    useRef,
    useState,
    type ChangeEvent,
} from "react";
import { CheckboxGroupContext } from "../CheckboxGroup/CheckboxGroup.context";
import {
    resolveCheckboxSize,
    resolveCheckboxStyles,
    resolveIconScaling,
} from "./Checkbox.helpers";
import { type CheckboxProps } from "./Checkbox.types";

const CheckboxWrapper = styled("div")<CheckboxProps>(
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
        ...resolveResponsiveMerge(theme, { size }, ({ size: s }) =>
            resolveCheckboxSize(theme, s),
        ),
    }),
);

CheckboxWrapper.displayName = "CheckboxWrapper";

const HiddenCheckbox = styled("input")({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    cursor: "pointer",
    margin: 0,
    padding: 0,
    opacity: 0,
});

HiddenCheckbox.displayName = "HiddenCheckbox";

const CheckboxBox = styled("span")<Omit<CheckboxProps, "value">>(({
    theme,
    color = "neutral",
    variant = "solid",
    checked,
}) => {
    const base = {
        position: "relative" as const,
        width: "1em",
        height: "1em",
        border: "1px solid currentColor",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease",
        borderRadius: "4px",
        padding: 0,
    };

    // const variantStyles = resolveCheckboxStyles(theme, color, checked)[variant];

    const variantStyles = resolveResponsiveMerge(
        theme,
        {
            color,
            variant,
        },
        ({ color: c, variant: v }) =>
            resolveCheckboxStyles(theme, c, checked)[v],
    );

    const checkedStyles = resolveResponsiveMerge(
        theme,
        {
            color,
            variant,
        },
        ({ color: c, variant: v }) => resolveCheckboxStyles(theme, c, true)[v],
    );

    return {
        ...base,
        ...variantStyles,

        'input[type="checkbox"]:hover + &': checkedStyles,
        'input[type="checkbox"]:active + &': checkedStyles,
        'input[type="checkbox"]:focus-visible + &': {
            boxShadow: `0 0 0 3px ${checkedStyles.backgroundColor}`,
            outline: "none",
        },
        "&::before": {
            content: '""',
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "0.5em",
            height: "0.5em",
            transform: "translate(-50%, -50%)",
            opacity: checked ? 1 : 0,
        },
    };
});

const CheckboxLabel = styled("span")<{ rtl?: boolean; disabled?: boolean }>(
    ({ rtl, disabled }) => ({
        ...(disabled && {
            cursor: "not-allowed",
        }),
        ...(rtl ? { marginRight: "0.5em" } : { marginLeft: "0.5em" }),
    }),
);

CheckboxLabel.displayName = "CheckboxLabel";

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
    ...resolveResponsiveMerge(theme, { size }, ({ size: s }) =>
        resolveIconScaling(theme, s),
    ),
}));

IconWrapper.displayName = "IconWrapper";

/**
 * Checkbox component that renders a styled checkbox input with label support.
 * It supports various properties such as checked state, disabled state, color, variant, size,
 * and custom icons for checked, unchecked, and indeterminate states.
 * The component can be controlled via props or managed internally.
 * It also supports RTL label alignment.
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    (
        {
            checked: controlledChecked,
            onChange: propOnChange,
            defaultChecked,
            label,
            disabled: propDisabled,
            color: colorProp,
            variant: variantProp,
            size: sizeProp,
            name: propName,
            value,
            uncheckedIcon,
            checkedIcon,
            indeterminate,
            indeterminateIcon,
            rtl,
            ...props
        }: CheckboxProps,
        ref,
    ) => {
        const group = useContext(CheckboxGroupContext);
        const [uncontrolledChecked, setUncontrolledChecked] = useState(
            defaultChecked ?? false,
        );
        const inputRef = useRef<HTMLInputElement>(null);

        const isChecked =
            group && value
                ? Array.isArray(group.value) && group.value.includes(value)
                : controlledChecked !== undefined
                  ? controlledChecked
                  : uncontrolledChecked;

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            if (!group && controlledChecked === undefined) {
                setUncontrolledChecked(e.target.checked);
            }

            if (group?.onChange && value) {
                const currentValues = group.value || [];
                const newValues = e.target.checked
                    ? [...currentValues, value]
                    : currentValues.filter((v) => v !== value);

                group.onChange(e, newValues);
            }

            propOnChange?.(e);
        };

        const handleWrapperClick = () => {
            if (!disabled && inputRef.current) {
                inputRef.current.click();
            }
        };

        const color = colorProp ?? group?.color ?? "neutral";
        const variant = variantProp ?? group?.variant ?? "solid";
        const size = sizeProp ?? group?.size ?? "md";
        const name = group?.name ?? propName;
        const disabled = group?.disabled ?? propDisabled;

        return (
            <CheckboxWrapper
                role="checkbox"
                aria-checked={isChecked}
                tabIndex={disabled ? -1 : 0}
                disabled={disabled}
                size={size}
                onClick={handleWrapperClick}
            >
                <HiddenCheckbox
                    type="checkbox"
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
                    <CheckboxLabel disabled={disabled} rtl={rtl}>
                        {label}
                    </CheckboxLabel>
                )}
                <CheckboxBox
                    name={name}
                    role="checkbox"
                    aria-checked={isChecked}
                    color={color as string}
                    variant={variant}
                    checked={isChecked}
                    disabled={disabled}
                    size={size}
                >
                    {indeterminate ? (
                        indeterminateIcon ? (
                            <IconWrapper size={size}>
                                {indeterminateIcon}
                            </IconWrapper>
                        ) : (
                            <IconWrapper size={size}>
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="6" y1="12" x2="18" y2="12" />
                                </svg>
                            </IconWrapper>
                        )
                    ) : isChecked ? (
                        checkedIcon ? (
                            <IconWrapper size={size}>{checkedIcon}</IconWrapper>
                        ) : (
                            <IconWrapper size={size}>
                                <svg
                                    viewBox="2 2 20 20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="4 12 10 18 20 6" />
                                </svg>
                            </IconWrapper>
                        )
                    ) : uncheckedIcon ? (
                        <IconWrapper size={size}>{uncheckedIcon}</IconWrapper>
                    ) : null}
                </CheckboxBox>
                {!rtl && label && (
                    <CheckboxLabel disabled={disabled} rtl={rtl}>
                        {label}
                    </CheckboxLabel>
                )}
            </CheckboxWrapper>
        );
    },
);

Checkbox.displayName = "Checkbox";

export { Checkbox };

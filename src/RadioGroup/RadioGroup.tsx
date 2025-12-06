import type {
    Orientation,
    Responsive,
    Size,
    SizeValue,
} from "@mutualzz/ui-core";
import { resolveResponsiveMerge, resolveSize, styled } from "@mutualzz/ui-core";
import { type ChangeEvent, forwardRef, useState } from "react";
import { RadioGroupContext } from "./RadioGroup.context";
import type { RadioGroupProps } from "./RadioGroup.types";

const baseSpacingMap: Record<Size, number> = {
    sm: 4,
    md: 8,
    lg: 12,
};

const RadioGroupWrapper = styled("div")<{
    orientation?: Responsive<Orientation>;
    spacing?: Responsive<Size | SizeValue | number>;
    disabled?: boolean;
}>(({ theme, orientation, spacing = "0.5rem", disabled }) => ({
    display: "inline-flex",
    flexWrap: "wrap",
    alignItems: "stretch",
    ...(disabled && {
        pointerEvents: "none",
        opacity: 0.5,
        cursor: "not-allowed",
    }),
    ...resolveResponsiveMerge(
        theme,
        { orientation, spacing },
        ({ orientation: ori, spacing: sp }) => {
            const resolvedSpacing = resolveSize(theme, sp, baseSpacingMap);

            return {
                flexDirection: ori === "horizontal" ? "row" : "column",
                ...(resolvedSpacing > 0 && { gap: resolvedSpacing }),
            };
        },
    ),
}));

RadioGroupWrapper.displayName = "RadioGroupButtonWrapper";

/**
 * RadioGroup component for grouping radio buttons.
 * It allows for selecting one option from a set of radio buttons.
 * The component can be controlled or uncontrolled.
 * It supports different layouts (row or column) and can handle disabled states.
 * The `onChange` event handler is called when the selected radio button changes.
 * The `name` prop is used to group radio inputs, and the `value` prop
 * is used to set the selected value.
 * The `defaultValue` prop can be used to set the initial selected value.
 * The `children` prop allows for passing in radio button components.
 */
const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
    (
        {
            name,
            color,
            size,
            variant,
            value: controlledValue,
            orientation,
            defaultValue,
            onChange,
            disabled,
            spacing,
            children,
        },
        ref,
    ) => {
        const [internalValue, setInternalValue] = useState(defaultValue ?? "");
        const isControlled = controlledValue !== undefined;
        const currentValue = isControlled ? controlledValue : internalValue;

        const handleChange = (
            e: ChangeEvent<HTMLInputElement>,
            newValue: string,
        ) => {
            if (!isControlled) setInternalValue(newValue);
            onChange?.(e, newValue);
        };

        return (
            <RadioGroupContext.Provider
                value={{
                    color,
                    size,
                    variant,
                    name,
                    orientation,
                    value: currentValue,
                    onChange: handleChange,
                    disabled,
                }}
            >
                <RadioGroupWrapper
                    ref={ref}
                    spacing={spacing}
                    orientation={orientation}
                    disabled={disabled}
                >
                    {children}
                </RadioGroupWrapper>
            </RadioGroupContext.Provider>
        );
    },
);

RadioGroup.displayName = "RadioGroup";

export { RadioGroup };

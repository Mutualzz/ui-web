import type {
    Orientation,
    Responsive,
    Size,
    SizeValue,
} from "@mutualzz/ui-core";
import { resolveResponsiveMerge, resolveSize, styled } from "@mutualzz/ui-core";
import { type ChangeEvent, forwardRef, useState } from "react";
import { CheckboxGroupContext } from "./CheckboxGroup.context";
import type { CheckboxGroupProps } from "./CheckboxGroup.types";

const baseSpacingMap: Record<Size, number> = {
    sm: 4,
    md: 8,
    lg: 12,
};

const CheckboxGroupWrapper = styled("div")<{
    orientation?: Responsive<Orientation>;
    spacing?: Responsive<Size | SizeValue | number>;
    disabled?: boolean;
}>(({ theme, orientation, spacing = "md", disabled }) => ({
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

CheckboxGroupWrapper.displayName = "CheckboxGroupWrapper";

/**
 * CheckboxGroup component that renders a group of checkboxes.
 * It allows for controlled or uncontrolled state management of the checkboxes.
 * The component supports a `name` prop for grouping checkboxes, a `value` prop for controlled state,
 * a `defaultValue` for uncontrolled state, and an `onChange` callback for handling changes.
 * It also supports disabling all checkboxes in the group and arranging them in a row or column layout.
 * The `children` prop should contain Checkbox components or valid React elements
 */
const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
    (
        {
            name,
            color,
            variant,
            size,
            orientation,
            value: controlledValue,
            defaultValue,
            onChange,
            disabled,
            spacing = 0,
            children,
        },
        ref,
    ) => {
        const [internalValue, setInternalValue] = useState(defaultValue ?? []);
        const isControlled = controlledValue !== undefined;
        const currentValue = isControlled ? controlledValue : internalValue;

        const handleChange = (
            e: ChangeEvent<HTMLInputElement>,
            checked: boolean,
        ) => {
            const val = e.target.value;
            const newValue = checked
                ? Array.from(new Set([...currentValue, val])) // Deduplication
                : currentValue.filter((v) => v !== val);

            if (!isControlled) setInternalValue(newValue);
            onChange?.(e, newValue);
        };

        return (
            <CheckboxGroupContext.Provider
                value={{
                    color,
                    variant,
                    size,
                    orientation,
                    disabled,
                    name,
                    value: currentValue,
                    onChange: (e, _) => handleChange(e, e.target.checked),
                }}
            >
                <CheckboxGroupWrapper
                    ref={ref}
                    orientation={orientation}
                    spacing={spacing}
                >
                    {children}
                </CheckboxGroupWrapper>
            </CheckboxGroupContext.Provider>
        );
    },
);

CheckboxGroup.displayName = "CheckboxGroup";

export { CheckboxGroup };

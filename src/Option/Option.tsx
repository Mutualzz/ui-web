import type { Responsive, Size, SizeValue } from "@mutualzz/ui-core";
import { resolveResponsiveMerge, styled } from "@mutualzz/ui-core";
import { useContext, type FC } from "react";
import { SelectContext } from "../Select/Select.context";
import { resolveOptionSize, resolveOptionStyles } from "./Option.helpers";
import type { OptionProps } from "./Option.types";

const OptionWrapper = styled("div")<
    Omit<OptionProps, "value"> & {
        isSelected: boolean;
        size: Responsive<Size | SizeValue | number>;
    }
>(
    ({
        theme,
        color = "neutral",
        variant = "outlined",
        disabled,
        isSelected,
        size,
    }) => ({
        ...resolveResponsiveMerge(
            theme,
            {
                color,
                variant,
                size,
            },
            ({ color: c, variant: v, size: s }) => ({
                ...resolveOptionStyles(theme, c, isSelected)[v],
                ...resolveOptionSize(theme, s),
            }),
        ),

        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        userSelect: "none",
        outline: "none",
        transition: "background 0.2s",
    }),
);

const Option: FC<OptionProps> = ({
    value,
    disabled: disabledProp,
    color: colorProp,
    variant: variantProp,
    size: sizeProp,
    label,
    children,
    ...props
}) => {
    const parent = useContext(SelectContext);

    const color = colorProp ?? parent?.color ?? "primary";
    const variant = variantProp ?? parent?.variant ?? "solid";
    const size = sizeProp ?? parent?.size ?? "md";
    const disabled = parent?.disabled ?? disabledProp;

    const isSelected = parent?.multiple
        ? Array.isArray(parent.value) && parent.value.includes(value)
        : parent?.value === value;

    return (
        <OptionWrapper
            role="option"
            aria-selected={isSelected}
            color={color as string}
            variant={variant}
            size={size}
            isSelected={isSelected}
            aria-disabled={disabled}
            tabIndex={-1}
            data-value={value}
            data-label={label}
            data-selected={isSelected}
            data-disabled={disabled}
            onMouseDown={() => {
                if (!disabled) parent?.onSelect(value);
            }}
            {...props}
        >
            {children ?? label ?? value}
        </OptionWrapper>
    );
};

Option.displayName = "Option";

export { Option };

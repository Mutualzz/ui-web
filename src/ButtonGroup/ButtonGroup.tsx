import type {
    Color,
    ColorLike,
    Orientation,
    Responsive,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import { resolveResponsiveMerge, resolveSize, styled } from "@mutualzz/ui-core";
import type { ButtonProps } from "Button/Button.types";
import { Children, forwardRef, isValidElement } from "react";
import { ButtonGroupContext } from "./ButtonGroup.context";
import {
    baseSpacingMap,
    resolveButtonGroupStyles,
} from "./ButtonGroup.helpers";
import type { ButtonGroupProps } from "./ButtonGroup.types";

const ButtonGroupRoot = styled("div")<{
    orientation: Responsive<Orientation>;
    spacing: Responsive<Size | SizeValue | number>;
    color?: Responsive<Color | ColorLike>;
    variant?: Responsive<Variant>;
    fullWidth?: boolean;
    separatorColor?: Responsive<Color | ColorLike>;
    disabled?: boolean;
}>(
    ({
        theme,
        color,
        variant,
        orientation,
        spacing,
        separatorColor,
        fullWidth,
        disabled,
    }) => ({
        display: "flex",
        flexWrap: "wrap",

        flexGrow: fullWidth ? 1 : 0,
        alignItems: "stretch",
        width: fullWidth ? "100%" : undefined,
        ...(disabled && {
            pointerEvents: "none",
            opacity: 0.5,
            cursor: "not-allowed",
        }),

        ...resolveResponsiveMerge(
            theme,
            { spacing, orientation, color, variant, separatorColor },
            ({
                spacing: sp,
                orientation: ori,
                color: c,
                variant: v,
                separatorColor: sc,
            }) => {
                const resolvedSpacing = resolveSize(theme, sp, baseSpacingMap);

                return {
                    flexDirection: ori === "vertical" ? "column" : "row",
                    ...(resolvedSpacing > 0 && { gap: resolvedSpacing }),
                    ...(resolvedSpacing === 0 && {
                        "& > button": resolveButtonGroupStyles(
                            theme,
                            ori,
                            c,
                            v,
                            sc,
                        ),
                    }),
                };
            },
        ),
    }),
);

ButtonGroupRoot.displayName = "ButtonGroupRoot";

/**
 * ButtonGroup component that renders a group of buttons with shared styles and properties.
 * It allows for customization of color, variant, size, orientation, and spacing.
 * The buttons can be disabled and can show a loading state.
 * The component automatically applies styles to its children based on the provided props.
 * It supports both horizontal and vertical orientations, with optional separator colors.
 * The buttons in the group can inherit properties from the Button component, such as size, color, variant, and loading state.
 * The `children` prop should contain Button components or valid React elements.
 */
const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
    (
        {
            orientation = "horizontal",
            spacing = 0,
            color,
            size,
            variant,
            verticalAlign,
            horizontalAlign,
            disabled,
            loading,
            fullWidth,
            separatorColor,
            toggleable,
            value,
            onChange,
            exclusive,
            children: childrenProp,
        },
        ref,
    ) => {
        const children = toggleable
            ? Children.map(childrenProp, (child) => {
                  if (!isValidElement<ButtonProps>(child)) return child;

                  const childValue = child.props.value;
                  const selected = exclusive
                      ? value === childValue
                      : Array.isArray(value) && value.includes(childValue);

                  return (
                      <child.type
                          {...child.props}
                          color={child.props.color ?? color}
                          size={child.props.size ?? size}
                          variant={child.props.variant ?? variant}
                          verticalAlign={
                              child.props.verticalAlign ?? verticalAlign
                          }
                          horizontalAlign={
                              child.props.horizontalAlign ?? horizontalAlign
                          }
                          disabled={child.props.disabled ?? disabled}
                          loading={child.props.loading ?? loading}
                          fullWidth={child.props.fullWidth ?? fullWidth}
                          selected={selected}
                      />
                  );
              })
            : childrenProp;

        return (
            <ButtonGroupContext.Provider
                value={{
                    color,
                    variant,
                    size,
                    verticalAlign,
                    horizontalAlign,
                    fullWidth,
                    disabled,
                    loading,
                    toggleable,
                    value,
                    onChange,
                    exclusive,
                }}
            >
                <ButtonGroupRoot
                    ref={ref}
                    spacing={spacing}
                    orientation={orientation}
                    color={color as string}
                    variant={variant}
                    separatorColor={separatorColor}
                    fullWidth={fullWidth}
                    disabled={disabled}
                >
                    {children}
                </ButtonGroupRoot>
            </ButtonGroupContext.Provider>
        );
    },
);

ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup };

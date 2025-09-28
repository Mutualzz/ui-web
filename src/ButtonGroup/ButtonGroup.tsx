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
import { forwardRef } from "react";
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
        disabled,
    }) => ({
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
            disabled,
            loading,
            separatorColor,
            children,
        },
        ref,
    ) => {
        return (
            <ButtonGroupContext.Provider
                value={{
                    color,
                    variant,
                    size,
                    disabled,
                    loading,
                }}
            >
                <ButtonGroupRoot
                    ref={ref}
                    spacing={spacing}
                    orientation={orientation}
                    color={color as string}
                    variant={variant}
                    separatorColor={separatorColor}
                >
                    {children}
                </ButtonGroupRoot>
            </ButtonGroupContext.Provider>
        );
    },
);

ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup };

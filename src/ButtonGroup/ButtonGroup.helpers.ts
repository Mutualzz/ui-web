import type { CSSObject, Theme } from "@emotion/react";
import type {
    Color,
    ColorLike,
    Orientation,
    Size,
    Variant,
} from "@mutualzz/ui-core";
import { darken, resolveColor } from "@mutualzz/ui-core";
import { formatHex8 } from "culori";

export const baseSpacingMap: Record<Size, number> = {
    sm: 4,
    md: 8,
    lg: 12,
};

export const resolveButtonGroupStyles = (
    theme: Theme,
    orientation: Orientation,
    color: Color | ColorLike = "primary",
    variant: Variant = "solid",
    separatorColor?: Color | ColorLike,
): CSSObject => {
    const resolvedColor = separatorColor
        ? resolveColor(separatorColor, theme)
        : resolveColor(color, theme);

    const horizontalBorders: Record<Variant, CSSObject> = {
        solid: {
            borderLeft: `1px solid ${formatHex8(separatorColor ? resolvedColor : darken(resolvedColor, 0.5))}`,
        },
        outlined: {},
        plain: {
            borderLeft: `1px solid ${formatHex8(separatorColor ? resolvedColor : darken(resolvedColor, 0.3))}`,
        },
        soft: {
            borderLeft: `1px solid ${formatHex8(separatorColor ? resolvedColor : darken(resolvedColor, 0.1))}`,
        },
    };

    const verticalBorders: Record<Variant, CSSObject> = {
        solid: {
            borderTop: `1px solid ${formatHex8(separatorColor ? resolvedColor : darken(resolvedColor, 0.5))}`,
        },
        outlined: {},
        plain: {
            borderTop: `1px solid ${formatHex8(separatorColor ? resolvedColor : darken(resolvedColor, 0.3))}`,
        },
        soft: {
            borderTop: `1px solid ${formatHex8(separatorColor ? resolvedColor : darken(resolvedColor, 0.1))}`,
        },
    };

    return orientation === "horizontal"
        ? {
              "&:first-of-type": {
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
              },
              "&:not(:first-of-type):not(:last-of-type)": {
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
              },
              "&:last-of-type": {
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
              },
              "&:not(:first-of-type)": horizontalBorders[variant],
          }
        : {
              "&:first-child": {
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
              },
              "&:not(:first-child):not(:last-child)": {
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
              },
              "&:last-child": {
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
              },
              "&:not(:first-child)": verticalBorders[variant],
          };
};

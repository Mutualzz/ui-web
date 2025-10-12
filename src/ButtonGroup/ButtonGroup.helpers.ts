import type { CSSObject, Theme } from "@emotion/react";
import type {
    Color,
    ColorLike,
    Orientation,
    Size,
    Variant,
} from "@mutualzz/ui-core";
import { formatColor, resolveColor } from "@mutualzz/ui-core";

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

    const solidBorder = separatorColor
        ? formatColor(resolvedColor, { format: "hexa" })
        : formatColor(resolvedColor, {
              format: "hexa",
              darken: 50,
          });

    const plainBorder = separatorColor
        ? formatColor(resolvedColor, { format: "hexa" })
        : formatColor(resolvedColor, {
              format: "hexa",
              darken: 30,
          });

    const softBorder = separatorColor
        ? formatColor(resolvedColor, { format: "hexa" })
        : formatColor(resolvedColor, {
              format: "hexa",
              darken: 10,
          });

    const horizontalBorders: Record<Variant, CSSObject> = {
        solid: {
            borderLeft: `1px solid ${solidBorder}`,
        },
        outlined: {},
        plain: {
            borderLeft: `1px solid ${plainBorder}`,
        },
        soft: {
            borderLeft: `1px solid ${softBorder}`,
        },
    };

    const verticalBorders: Record<Variant, CSSObject> = {
        solid: {
            borderTop: `1px solid ${solidBorder}`,
        },
        outlined: {},
        plain: {
            borderTop: `1px solid ${plainBorder}`,
        },
        soft: {
            borderTop: `1px solid ${softBorder}`,
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
              "&:first-of-type": {
                  borderBottomLeftRadius: 0,
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
                  borderTopRightRadius: 0,
              },
              "&:not(:first-of-type)": verticalBorders[variant],
          };
};

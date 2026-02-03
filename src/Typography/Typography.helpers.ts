import type { CSSObject, Theme } from "@emotion/react";
import {
    createColor,
    formatColor,
    isValidColorInput,
    resolveColor,
    resolveTypographyColor,
    type Color,
    type ColorLike,
    type TypographyColor,
} from "@mutualzz/ui-core";
import type { TypographyVariant } from "./Typography.types";

export const resolveTypographStyles = (
    theme: Theme,
    color: Color | ColorLike,
    textColor: TypographyColor | ColorLike | "inherit",
): Record<TypographyVariant, CSSObject> => {
    const resolvedColor = resolveColor(color, theme);

    const parsedTextColor = resolveTypographyColor(textColor, theme);

    const isColorLike = isValidColorInput(parsedTextColor);
    const isDark = createColor(resolvedColor).isDark();
    const solidTextColor = isDark
        ? theme.typography.colors.primary
        : formatColor(resolvedColor, {
              darken: 70,
          });

    const textColorFinal = isColorLike
        ? parsedTextColor
        : theme.typography.colors.primary;

    return {
        solid: {
            backgroundColor: resolvedColor,
            color: solidTextColor,
            border: "none",
        },
        outlined: {
            backgroundColor: "transparent",
            color: resolvedColor,
            border: `1px solid ${resolvedColor}`,
        },
        plain: {
            backgroundColor: "transparent",
            color: resolvedColor,
            border: "none",
        },
        soft: {
            backgroundColor: formatColor(resolvedColor, {
                format: "hexa",
                alpha: 40,
            }),
            color: resolvedColor,
            border: "none",
        },
        none: {
            backgroundColor: "transparent",
            border: "none",
            color: textColorFinal,
        },
    };
};

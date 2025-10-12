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
    const { colors } = theme;
    const resolvedColor = resolveColor(color, theme);

    const parsedTextColor =
        textColor === "inherit"
            ? theme.typography.colors.primary
            : resolveTypographyColor(textColor, theme);

    const isColorLike = isValidColorInput(parsedTextColor);
    const isDark = createColor(resolvedColor).isDark();
    const solidTextColor = isDark
        ? formatColor(colors.common.white, { format: "hexa" })
        : formatColor(resolvedColor, {
              format: "hexa",
              darken: 70,
          });

    const textColorFinal = formatColor(
        isColorLike ? parsedTextColor : theme.typography.colors.primary,
        {
            format: "hexa",
        },
    );

    return {
        solid: {
            backgroundColor: formatColor(resolvedColor, {
                format: "hexa",
            }),
            color: solidTextColor,
            border: "none",
        },
        outlined: {
            backgroundColor: "transparent",
            color: formatColor(resolvedColor, { format: "hexa" }),
            border: `1px solid ${formatColor(resolvedColor, { format: "hexa" })}`,
        },
        plain: {
            backgroundColor: "transparent",
            color: formatColor(resolvedColor, { format: "hexa" }),
            border: "none",
        },
        soft: {
            backgroundColor: formatColor(resolvedColor, {
                format: "hexa",
                alpha: 40,
            }),
            color: formatColor(resolvedColor, { format: "hexa" }),
            border: "none",
        },
        none: {
            backgroundColor: "transparent",
            border: "none",
            color: textColorFinal,
        },
    };
};

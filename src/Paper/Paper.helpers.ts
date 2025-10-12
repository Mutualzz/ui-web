import type { Theme } from "@emotion/react";
import {
    createColor,
    dynamicElevation,
    formatColor,
    isValidGradient,
    resolveColor,
    resolveTypographyColor,
    type Color,
    type ColorLike,
    type TypographyColor,
} from "@mutualzz/ui-core";

export const resolvePaperStyles = (
    theme: Theme,
    color: Color | ColorLike,
    textColor: TypographyColor | ColorLike | "inherit",
    elevation: number,
    nonTranslucent: boolean,
) => {
    const { colors } = theme;
    const resolvedColor = resolveColor(color, theme);

    const resolvedTextColor =
        textColor === "inherit"
            ? resolvedColor
            : resolveTypographyColor(textColor, theme);

    const textColorWithFallback =
        formatColor(resolvedTextColor, {
            format: "hexa",
        }) ?? theme.typography.colors.muted;

    const solidTextColor = formatColor(theme.typography.colors.primary, {
        format: "hexa",
        negate: createColor(resolvedColor).isLight(),
    });

    return {
        elevation: {
            background: isValidGradient(colors.surface)
                ? nonTranslucent
                    ? colors.surface
                    : formatColor(colors.surface, {
                          alpha: 10,
                          format: "hexa",
                      })
                : dynamicElevation(colors.surface, elevation),
            boxShadow: `0 ${2 + elevation}px ${8 + elevation * 2}px rgba(0,0,0,${0.1 + elevation * 0.05})`,
            backdropFilter: `blur(${6 + elevation * 2}px)`,
        },
        solid: {
            background:
                formatColor(resolvedColor, { format: "hexa" }) ??
                theme.colors.primary,
            color: solidTextColor,
            border: "none",
        },
        outlined: {
            border: `1px solid ${formatColor(resolvedColor, { alpha: 30, format: "hexa" })}`,
            color: textColorWithFallback,
        },
        plain: {
            background: "transparent",
            border: "none",
            color: textColorWithFallback,
        },
        soft: {
            background: formatColor(resolvedColor, {
                alpha: 10,
                format: "hexa",
            }),
            border: "none",
            color: textColorWithFallback,
        },
    };
};

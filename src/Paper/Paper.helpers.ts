import type { Theme } from "@emotion/react";
import {
    alpha,
    dynamicElevation,
    getLuminance,
    isValidGradient,
    resolveColor,
    resolveColorFromLuminance,
    resolveTypographyColor,
    type Color,
    type ColorLike,
    type TypographyColor,
} from "@mutualzz/ui-core";
import { formatHex8 } from "culori";

export const resolvePaperStyles = (
    theme: Theme,
    color: Color | ColorLike,
    textColor: TypographyColor | ColorLike | "inherit",
    elevation: number,
    nonTranslucent: boolean,
) => {
    const { colors } = theme;
    const resolvedColor = resolveColor(color, theme);
    const bgLuminance = getLuminance(resolvedColor);

    const resolvedTextColor =
        textColor === "inherit"
            ? resolvedColor
            : resolveTypographyColor(textColor, theme);

    const solidTextColor = resolveColorFromLuminance(bgLuminance, theme);
    const textColorWithFallback =
        formatHex8(resolvedTextColor) ?? theme.typography.colors.muted;

    return {
        elevation: {
            background: isValidGradient(colors.surface)
                ? nonTranslucent
                    ? colors.surface
                    : alpha(colors.surface, 0.2)
                : dynamicElevation(colors.surface, elevation),
            boxShadow: `0 ${2 + elevation}px ${8 + elevation * 2}px rgba(0,0,0,${0.1 + elevation * 0.05})`,
            backdropFilter: `blur(${6 + elevation * 2}px)`,
        },
        solid: {
            background: formatHex8(resolvedColor) ?? colors.primary,
            color: solidTextColor,
            border: "none",
        },
        outlined: {
            border: `1px solid ${formatHex8(alpha(resolvedColor, 0.3))}`,
            color: textColorWithFallback,
        },
        plain: {
            background: "transparent",
            border: "none",
            color: textColorWithFallback,
        },
        soft: {
            background: formatHex8(alpha(resolvedColor, 0.1)),
            border: "none",
            color: textColorWithFallback,
        },
    };
};

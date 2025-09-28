import type { CSSObject, Theme } from "@emotion/react";
import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    TypographyColor,
    Variant,
} from "@mutualzz/ui-core";
import {
    alpha,
    getLuminance,
    resolveColor,
    resolveColorFromLuminance,
    resolveSize,
    resolveTypographyColor,
} from "@mutualzz/ui-core";
import { formatHex8 } from "culori";

const baseSizeMap: Record<Size, number> = {
    sm: 12,
    md: 14,
    lg: 16,
};

export const resolveTextareaSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        fontSize: resolvedSize,
        minHeight: resolvedSize * 4,
    };
};

export const resolveTextareaInputSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);
    const padding = `${resolvedSize * 0.5}px ${resolvedSize * 0.75}px`;

    return {
        padding,
    };
};

export const resolveTextareaStyles = (
    theme: Theme,
    color: Color | ColorLike,
    textColor: TypographyColor | ColorLike | "inherit",
): Record<Variant, CSSObject> => {
    const { colors } = theme;
    const resolvedColor = resolveColor(color, theme);
    const bgLuminance = getLuminance(resolvedColor);

    const resolvedTextColor =
        textColor === "inherit"
            ? resolvedColor
            : resolveTypographyColor(textColor, theme);

    const solidTextColor = resolveColorFromLuminance(bgLuminance, theme);

    const textColorWithFallback =
        formatHex8(resolvedTextColor) ?? theme.typography.colors.primary;

    return {
        solid: {
            backgroundColor: formatHex8(resolvedColor),
            color: solidTextColor,
            border: "none",
            "&:focus-within": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.9)),
            },
        },
        outlined: {
            backgroundColor: colors.background,
            border: `1px solid ${formatHex8(alpha(resolvedColor, 0.3))}`,
            color: textColorWithFallback,
            "&:focus-within": {
                borderColor: formatHex8(resolvedColor),
                backgroundColor: formatHex8(alpha(resolvedColor, 0.05)),
            },
        },
        soft: {
            backgroundColor: formatHex8(alpha(resolvedColor, 0.1)),
            border: "none",
            color: textColorWithFallback,
            "&:focus-within": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.15)),
            },
        },
        plain: {
            backgroundColor: "transparent",
            border: "none",
            color: textColorWithFallback,
            "&:focus-within": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.05)),
            },
        },
    };
};

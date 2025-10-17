import type { CSSObject, Theme } from "@emotion/react";
import {
    createColor,
    formatColor,
    resolveColor,
    resolveSize,
    type Color,
    type ColorLike,
    type Size,
    type SizeValue,
    type Variant,
} from "@mutualzz/ui-core";

const baseSizeMap: Record<Size, number> = {
    sm: 10,
    md: 12,
    lg: 16,
};

export const resolveTooltipContainerSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);
    return {
        fontSize: resolvedSize,
        padding: `${Math.round(resolvedSize * 0.5)}px ${Math.round(resolvedSize * 0.66)}px`,
        borderRadius: Math.max(6, Math.round(resolvedSize * 0.66)),
        gap: Math.max(6, Math.round(resolvedSize * 0.66)),
        arrow: Math.max(6, Math.round(resolvedSize * 0.58)),
    };
};

export const resolveTooltipContainerStyles = (
    theme: Theme,
    color: Color | ColorLike,
): Record<Variant, CSSObject> => {
    const resolvedColor = resolveColor(color, theme);
    const hexColor = formatColor(resolvedColor, { format: "hexa" });

    const solidTextColor = formatColor(theme.typography.colors.primary, {
        format: "hexa",
        negate: createColor(resolvedColor).isLight(),
    });

    return {
        solid: {
            background: hexColor,
            color: solidTextColor,
            border: "none",
        },
        outlined: {
            background: formatColor(resolvedColor, {
                format: "hexa",
                alpha: 20,
            }),
            color: hexColor,
            border: `1px solid ${formatColor(resolvedColor, {
                format: "hexa",
                alpha: 70,
            })}`,
            backdropFilter: "saturate(120%) blur(6px)",
        },
        plain: {
            backgroundColor: formatColor(resolvedColor, {
                format: "hexa",
                alpha: 85,
            }),
            color: hexColor,
            border: `1px solid ${formatColor(resolvedColor, { format: "hexa", alpha: 10 })}`,
        },
        soft: {
            backgroundColor: formatColor(resolvedColor, {
                format: "hexa",
                alpha: 18,
            }),
            color: hexColor,
            border: `1px solid ${formatColor(resolvedColor, { format: "hexa", alpha: 10 })}`,
        },
    };
};

export const resolveTooltipTextStyles = (
    theme: Theme,
    color: Color | ColorLike,
): Record<Variant, CSSObject> => {
    const resolvedColor = resolveColor(color, theme);
    const hexColor = formatColor(resolvedColor, { format: "hexa" });

    const solidTextColor = formatColor(theme.typography.colors.primary, {
        format: "hexa",
        negate: createColor(resolvedColor).isLight(),
    });

    return {
        solid: {
            color: solidTextColor,
        },
        outlined: {
            color: hexColor,
        },
        plain: {
            color: hexColor,
        },
        soft: {
            color: hexColor,
        },
    };
};

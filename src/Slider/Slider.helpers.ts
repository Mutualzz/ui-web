import type { CSSObject, Theme } from "@emotion/react";
import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import {
    formatColor,
    resolveColor,
    resolveColorTokens,
    resolveSize,
} from "@mutualzz/ui-core";

const thumbSizeMap: Record<Size, number> = {
    sm: 16,
    md: 20,
    lg: 24,
};

export const resolveSliderThumbSize = (
    theme: Theme,
    size: Size | SizeValue | number,
): CSSObject => {
    const resolvedSize = resolveSize(theme, size, thumbSizeMap);

    return {
        width: resolvedSize,
        height: resolvedSize,
        borderRadius: resolvedSize / 2,
    };
};

export const resolveSliderTrackThickness = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const resolvedSize = resolveSize(theme, size, thumbSizeMap);

    return Math.round(resolvedSize / 3);
};

export const resolveSliderTickSize = (
    theme: Theme,
    size: Size | SizeValue | number,
): CSSObject => {
    const resolvedSize = resolveSize(theme, size, thumbSizeMap);

    const tickSize = Math.round(resolvedSize * 0.25);

    return {
        width: tickSize,
        height: tickSize,
    };
};

export const resolveSliderLabelSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const baseFontMap: Record<Size, number> = {
        sm: theme.typography.levels["body-xs"].fontSize,
        md: theme.typography.levels["body-sm"].fontSize,
        lg: theme.typography.levels["body-md"].fontSize,
    };

    return resolveSize(theme, size, baseFontMap);
};

export const resolveSliderTrackStyles = (
    theme: Theme,
    color: Color | ColorLike,
    hovered: boolean,
): Record<Variant, CSSObject> => {
    const colorTokens = resolveColorTokens(color, theme);

    return {
        solid: {
            backgroundColor: hovered ? colorTokens.alpha(90) : colorTokens.base,
        },
        outlined: {
            border: `1px solid ${hovered ? colorTokens.alpha(70) : colorTokens.base}`,
            backgroundColor: hovered ? colorTokens.alpha(10) : "transparent",
        },
        plain: {
            backgroundColor: hovered ? colorTokens.alpha(20) : "transparent",
        },
        soft: {
            backgroundColor: colorTokens.alpha(hovered ? 20 : 10),
        },
    };
};

export const resolveSliderThumbStyles = (
    theme: Theme,
    color: Color | ColorLike,
    hovered: boolean,
): Record<Variant, CSSObject> => {
    const { colors } = theme;

    const colorTokens = resolveColorTokens(color, theme);

    return {
        solid: {
            backgroundColor: colors.common.white,
            border: `2px solid ${hovered ? colorTokens.alpha(90) : colorTokens.base}`,
        },
        outlined: {
            backgroundColor: colors.common.white,
            border: `2px solid ${colorTokens.base}`,
        },
        plain: {
            backgroundColor: colorTokens.alpha(80),
        },
        soft: {
            backgroundColor: formatColor(resolveColor(color, theme), {
                lighten: hovered ? 50 : 70,
            }),
            border: `2px solid ${hovered ? colorTokens.alpha(85) : colorTokens.base}`,
        },
    };
};

import type { CSSObject, Theme } from "@emotion/react";
import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import { alpha, lighten, resolveColor, resolveSize } from "@mutualzz/ui-core";
import { formatHex8 } from "culori";

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
    const resolvedColor = resolveColor(color, theme);

    return {
        solid: {
            backgroundColor: hovered
                ? formatHex8(alpha(resolvedColor, 0.9))
                : formatHex8(resolvedColor),
        },
        outlined: {
            border: hovered
                ? `1px solid ${formatHex8(alpha(resolvedColor, 0.7))}`
                : `1px solid ${formatHex8(resolvedColor)}`,
            backgroundColor: hovered
                ? formatHex8(alpha(resolvedColor, 0.1))
                : "transparent",
        },
        plain: {
            backgroundColor: hovered
                ? formatHex8(alpha(resolvedColor, 0.2))
                : "transparent",
        },
        soft: {
            backgroundColor: hovered
                ? formatHex8(alpha(resolvedColor, 0.2))
                : formatHex8(alpha(resolvedColor, 0.1)),
        },
    };
};

export const resolveSliderThumbStyles = (
    theme: Theme,
    color: Color | ColorLike,
    hovered: boolean,
): Record<Variant, CSSObject> => {
    const { colors } = theme;

    const resolvedColor = resolveColor(color, theme);

    return {
        solid: {
            backgroundColor: colors.common.white,
            border: hovered
                ? `2px solid ${formatHex8(alpha(resolvedColor, 0.9))}`
                : `2px solid ${formatHex8(resolvedColor)}`,
        },
        outlined: {
            backgroundColor: colors.common.white,
            border: `2px solid ${formatHex8(resolvedColor)}`,
        },
        plain: {
            backgroundColor: formatHex8(alpha(resolvedColor, 0.8)),
        },
        soft: {
            backgroundColor: hovered
                ? formatHex8(lighten(resolvedColor, 0.5))
                : formatHex8(lighten(resolvedColor, 0.7)),
            border: hovered
                ? `2px solid ${formatHex8(alpha(resolvedColor, 0.85))}`
                : `2px solid ${formatHex8(resolvedColor)}`,
        },
    };
};

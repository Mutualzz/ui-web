import type { CSSObject, Theme } from "@emotion/react";
import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import {
    darken,
    getLuminance,
    lighten,
    resolveColor,
    resolveColorFromLuminance,
    resolveSize,
} from "@mutualzz/ui-core";
import { formatHex } from "culori";

export const baseSizeMap: Record<Size, number> = {
    sm: 32,
    md: 40,
    lg: 48,
};

export const resolveSelectSize = (
    theme: Theme,
    size: Size | SizeValue | number,
): CSSObject => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        minHeight: resolvedSize,
        fontSize: resolvedSize * 0.32,
        paddingInline: resolvedSize * 0.25,
        paddingBlock: resolvedSize * 0.12,
        minWidth: resolvedSize * 3,
        gap: resolvedSize * 0.15,
    };
};

export const resolveSelectStyles = (
    theme: Theme,
    color: Color | ColorLike,
): Record<Variant, CSSObject> => {
    const resolvedColor = resolveColor(color, theme);
    const bgLuminance = getLuminance(resolvedColor);
    const textColor = resolveColorFromLuminance(bgLuminance, theme);

    return {
        solid: {
            backgroundColor: formatHex(resolvedColor),
            color: formatHex(textColor),
            "&:hover": {
                backgroundColor: formatHex(darken(resolvedColor, 0.3)),
            },
        },
        outlined: {
            border: `1px solid ${formatHex(resolvedColor)}`,
            color: formatHex(lighten(resolvedColor, 0.75)),
            "&:hover": {
                backgroundColor: formatHex(darken(resolvedColor, 0.3)),
            },
        },
        soft: {
            backgroundColor: formatHex(darken(resolvedColor, 0.5)),
            color: formatHex(lighten(resolvedColor, 0.75)),
            "&:hover": {
                backgroundColor: formatHex(lighten(resolvedColor, 0.05)),
            },
        },
        plain: {
            backgroundColor: "transparent",
            color: formatHex(lighten(resolvedColor, 0.75)),
            "&:hover": {
                backgroundColor: formatHex(darken(resolvedColor, 0.3)),
            },
        },
    };
};

export const resolveSelectContentStyles = (
    theme: Theme,
    color: Color | ColorLike,
): Record<Variant, CSSObject> => {
    const { colors } = theme;
    const resolvedColor = resolveColor(color, theme);
    const bgLuminance = getLuminance(resolvedColor);
    const textColor = resolveColorFromLuminance(bgLuminance, theme);

    return {
        solid: {
            backgroundColor: formatHex(resolvedColor),
            color: formatHex(textColor),
        },
        outlined: {
            backgroundColor: colors.background,
            border: `1px solid ${formatHex(resolvedColor)}`,
            color: formatHex(lighten(resolvedColor, 0.2)),
        },
        soft: {
            backgroundColor: formatHex(darken(resolvedColor, 0.5)),
            color: formatHex(lighten(resolvedColor, 0.2)),
        },
        plain: {
            backgroundColor: colors.background,
            color: formatHex(resolvedColor),
        },
    };
};

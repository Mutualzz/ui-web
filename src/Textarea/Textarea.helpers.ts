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
    resolveColorTokens,
    resolveSize,
    resolveTextColorToken,
    themeBackgroundVar,
} from "@mutualzz/ui-core";

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
    const colorTokens = resolveColorTokens(color, theme);
    const textColorFinal = resolveTextColorToken(textColor, theme);

    return {
        solid: {
            backgroundColor: colorTokens.base,
            color: colorTokens.contrast,
            border: "none",
            "&:focus-within": {
                backgroundColor: colorTokens.alpha(90),
            },
        },
        outlined: {
            backgroundColor: themeBackgroundVar(),
            border: `1px solid ${colorTokens.alpha(30)}`,
            color: textColorFinal,
            "&:focus-within": {
                borderColor: colorTokens.base,
                backgroundColor: colorTokens.alpha(5),
            },
        },
        soft: {
            backgroundColor: colorTokens.alpha(10),
            border: "none",
            color: textColorFinal,
            "&:focus-within": {
                backgroundColor: colorTokens.alpha(15),
            },
        },
        plain: {
            backgroundColor: "transparent",
            border: "none",
            color: textColorFinal,
            "&:focus-within": {
                backgroundColor: colorTokens.alpha(5),
            },
        },
    };
};

import type { CSSObject, Theme } from "@emotion/react";
import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import { resolveColorTokens, resolveSize } from "@mutualzz/ui-core";

const baseSizeMap: Record<Size, number> = {
    sm: 12,
    md: 14,
    lg: 16,
};

export const resolveListItemSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        fontSize: resolvedSize,
        gap: resolvedSize * 0.3,
        minHeight: resolvedSize * 2.5,
    };
};

export const resolveListItemStyles = (
    theme: Theme,
    color: Color | ColorLike,
): Record<Variant, CSSObject> => {
    const colorTokens = resolveColorTokens(color, theme);

    return {
        solid: {
            backgroundColor: colorTokens.base,
            border: "none",
        },
        outlined: {
            backgroundColor: "transparent",
            border: `1px solid ${colorTokens.alpha(30)}`,
        },
        soft: {
            backgroundColor: colorTokens.alpha(10),
            border: "none",
        },
        plain: {
            backgroundColor: "transparent",
            border: "none",
        },
    };
};

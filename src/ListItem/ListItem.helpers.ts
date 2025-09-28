import type { CSSObject, Theme } from "@emotion/react";
import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import { alpha, resolveColor, resolveSize } from "@mutualzz/ui-core";
import { formatHex8 } from "culori";

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
    const resolvedColor = resolveColor(color, theme);

    return {
        solid: {
            backgroundColor: formatHex8(resolvedColor),
            border: "none",
        },
        outlined: {
            backgroundColor: "transparent",
            border: `1px solid ${formatHex8(alpha(resolvedColor, 0.3))}`,
        },
        soft: {
            backgroundColor: formatHex8(alpha(resolvedColor, 0.1)),
            border: "none",
        },
        plain: {
            backgroundColor: "transparent",
            border: "none",
        },
    };
};

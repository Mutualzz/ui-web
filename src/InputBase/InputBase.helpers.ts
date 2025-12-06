import type { CSSObject, Theme } from "@emotion/react";
import { resolveSize, type Size, type SizeValue } from "@mutualzz/ui-core";

export const baseSizeMap: Record<Size, number> = {
    sm: 12,
    md: 14,
    lg: 16,
};

export const resolveInputBaseSize = (
    theme: Theme,
    size: Size | SizeValue | number = "md",
    fullWidth?: boolean,
): CSSObject => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        width: fullWidth ? "100%" : resolvedSize * 16,
        fontSize: resolvedSize,
        minHeight: resolvedSize * 2.2,
        paddingInline: resolvedSize * 0.4,
    };
};

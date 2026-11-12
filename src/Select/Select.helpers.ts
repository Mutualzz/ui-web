import type { CSSObject, Theme } from "@emotion/react";
import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import {
    resolveColorTokens,
    resolveSize,
    themeBackgroundVar,
    typographyColorVar,
} from "@mutualzz/ui-core";

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
    const colorTokens = resolveColorTokens(color, theme);
    const textColor = typographyColorVar("primary");
    const focusRing = {
        "&:focus-visible": {
            outline: "none",
            boxShadow: `0 0 0 2px ${colorTokens.alpha(30)}`,
        },
    };

    return {
        solid: {
            backgroundColor: colorTokens.base,
            color: colorTokens.contrast,
            border: "none",
            "&:hover": {
                backgroundColor: colorTokens.alpha(90),
            },
            ...focusRing,
        },
        outlined: {
            backgroundColor: "transparent",
            color: textColor,
            border: `1px solid ${colorTokens.base}`,
            "&:hover": {
                borderColor: colorTokens.alpha(50),
                backgroundColor: colorTokens.alpha(5),
            },
            ...focusRing,
        },
        soft: {
            backgroundColor: colorTokens.alpha(10),
            color: textColor,
            border: "none",
            "&:hover": {
                backgroundColor: colorTokens.alpha(15),
            },
            ...focusRing,
        },
        plain: {
            backgroundColor: "transparent",
            color: textColor,
            border: "none",
            "&:hover": {
                backgroundColor: colorTokens.alpha(5),
            },
            ...focusRing,
        },
    };
};

export const resolveSelectContentStyles = (
    theme: Theme,
    color: Color | ColorLike,
): Record<Variant, CSSObject> => {
    const colorTokens = resolveColorTokens(color, theme);
    const listSurface = {
        backgroundColor: themeBackgroundVar(),
        color: typographyColorVar("primary"),
    };

    return {
        solid: {
            backgroundColor: colorTokens.base,
            color: colorTokens.contrast,
        },
        outlined: {
            ...listSurface,
            border: `1px solid ${colorTokens.base}`,
        },
        soft: {
            ...listSurface,
            border: `1px solid ${colorTokens.alpha(30)}`,
        },
        plain: listSurface,
    };
};

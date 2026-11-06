import { type CSSObject, type Theme } from "@emotion/react";
import {
    resolveColorTokens,
    resolveSize,
    type Color,
    type ColorLike,
    type Size,
    type SizeValue,
    type Variant,
} from "@mutualzz/ui-core";

export const baseSizeMap: Record<Size, number> = {
    sm: 12,
    md: 16,
    lg: 20,
};

export const resolveCheckboxSize = (
    theme: Theme,
    size: Size | SizeValue | number,
): CSSObject => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        fontSize: resolvedSize,
    };
};

export const resolveCheckboxStyles = (
    theme: Theme,
    color: Color | ColorLike,
    checked?: boolean,
): Record<Variant, CSSObject> => {
    const colorTokens = resolveColorTokens(color, theme);

    return {
        solid: {
            backgroundColor: colorTokens.base,
            color: colorTokens.on,
            border: `1px solid ${colorTokens.base}`,
            "&:hover": {
                backgroundColor: checked
                    ? colorTokens.alpha(80)
                    : colorTokens.alpha(10),
                borderColor: colorTokens.base,
            },
            "&:active": {
                backgroundColor: checked
                    ? colorTokens.alpha(70)
                    : colorTokens.alpha(20),
            },
        },
        outlined: {
            backgroundColor: checked ? colorTokens.alpha(10) : "transparent",
            color: colorTokens.base,
            border: `1px solid ${colorTokens.base}`,
            "&:hover": {
                backgroundColor: colorTokens.alpha(20),
                borderColor: colorTokens.base,
            },
            "&:active": {
                backgroundColor: colorTokens.alpha(30),
            },
        },
        soft: {
            backgroundColor: colorTokens.alpha(checked ? 30 : 10),
            color: colorTokens.base,
            border: "none",
            "&:hover": {
                backgroundColor: colorTokens.alpha(checked ? 40 : 20),
            },
            "&:active": {
                backgroundColor: colorTokens.alpha(checked ? 50 : 30),
            },
        },
        plain: {
            backgroundColor: "transparent",
            color: colorTokens.base,
            border: "none",
            "&:hover": {
                backgroundColor: colorTokens.alpha(checked ? 20 : 10),
            },
            "&:active": {
                backgroundColor: colorTokens.alpha(checked ? 30 : 20),
            },
        },
    };
};

export const resolveIconScaling = (
    theme: Theme,
    size: Size | SizeValue | number,
): CSSObject => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        width: resolvedSize * 0.5,
        height: resolvedSize * 0.5,
    };
};

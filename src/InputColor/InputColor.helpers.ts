import type { Theme } from "@emotion/react";
import { hexToHsva } from "@mutualzz/color-picker";
import {
    extractColors,
    formatColor,
    randomColor,
    resolveColorTokens,
    resolveSize,
    type Color,
    type ColorLike,
    type HsvaColor,
    type Size,
    type SizeValue,
} from "@mutualzz/ui-core";

const baseSizeMap: Record<Size, number> = {
    sm: 16,
    md: 20,
    lg: 24,
};

export const toGradientStops = (color?: ColorLike | HsvaColor): HsvaColor[] => {
    if (!color) return [hexToHsva(randomColor("hex"))];

    if (typeof color !== "string") return [color];

    const extracted = extractColors(color);
    if (extracted?.length) {
        return extracted.map((c) =>
            hexToHsva(formatColor(c, { format: "hex" })),
        );
    }

    return [
        hexToHsva(
            formatColor(color, {
                format: "hex",
            }),
        ),
    ];
};

export const resolveColorPickerButtonSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        width: resolvedSize,
        height: resolvedSize,
        minWidth: resolvedSize,
        minHeight: resolvedSize,
        borderRadius: resolvedSize * 0.25,
        padding: 0,
    };
};

export const resolveColorPickerButtonStyles = (
    theme: Theme,
    color: Color | ColorLike,
) => {
    const colorTokens = resolveColorTokens(color, theme);
    const textTokens = resolveColorTokens("text", theme);

    return {
        solid: {
            background: colorTokens.base,
            border: `2px solid ${textTokens.base}`,
            "&:hover": {
                backgroundColor: colorTokens.alpha(90),
                borderColor: textTokens.base,
            },
            "&:active": {
                backgroundColor: colorTokens.alpha(80),
            },
        },
        outlined: {
            background: colorTokens.base,
            border: `2px solid ${colorTokens.alpha(60)}`,
            "&:hover": {
                backgroundColor: colorTokens.alpha(90),
                borderColor: colorTokens.alpha(80),
            },
            "&:active": {
                backgroundColor: colorTokens.alpha(80),
            },
        },
        soft: {
            background: colorTokens.base,
            border: `2px solid ${textTokens.alpha(30)}`,
            "&:hover": {
                backgroundColor: colorTokens.alpha(90),
                borderColor: textTokens.alpha(50),
            },
            "&:active": {
                backgroundColor: colorTokens.alpha(80),
            },
        },
        plain: {
            background: colorTokens.base,
            border: "2px solid transparent",
            "&:hover": {
                backgroundColor: colorTokens.alpha(90),
                borderColor: textTokens.alpha(20),
            },
            "&:active": {
                backgroundColor: colorTokens.alpha(80),
            },
        },
    };
};

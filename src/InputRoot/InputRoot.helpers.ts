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
    alpha,
    darken,
    getLuminance,
    isValidColorInput,
    resolveColor,
    resolveSize,
    resolveTypographyColor,
} from "@mutualzz/ui-core";
import { formatHex8 } from "culori";

export const baseSizeMap: Record<Size, number> = {
    sm: 12,
    md: 14,
    lg: 16,
};

export const resolveInputRootSize = (
    theme: Theme,
    size: Size | SizeValue | number,
    fullWidth?: boolean,
) => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        width: fullWidth ? "100%" : resolvedSize * 16,
        maxWidth: "100%",
        fontSize: resolvedSize,
        lineHeight: 1.2,
        minHeight: resolvedSize * 2.2,
        padding: `${resolvedSize * 0.4}px ${resolvedSize * 0.6}px`,
    };
};

export const resolveInputRootStyles = (
    theme: Theme,
    color: Color | ColorLike,
    textColor: TypographyColor | ColorLike | "inherit",
    error: boolean,
): Record<Variant, CSSObject> => {
    const { colors } = theme;
    const resolvedColor = resolveColor(color, theme);

    const parsedTextColor =
        textColor === "inherit"
            ? theme.typography.colors.primary
            : resolveTypographyColor(textColor, theme);

    const errorColor = colors.danger;
    const activeColor = error ? errorColor : resolvedColor;
    const isColorLike = isValidColorInput(parsedTextColor);

    const luminance = getLuminance(activeColor) ?? 0;
    const solidTextColor =
        luminance < 0.5
            ? formatHex8(colors.common.white)
            : formatHex8(darken(activeColor, 0.7));

    const textColorFinal = formatHex8(
        isColorLike ? parsedTextColor : theme.typography.colors.primary,
    );

    return {
        outlined: {
            backgroundColor: "transparent",
            color: textColorFinal,
            border: `1px solid ${formatHex8(activeColor)}`,
            "&:hover": {
                borderColor: formatHex8(alpha(activeColor, 0.5)),
                backgroundColor: formatHex8(alpha(activeColor, 0.05)),
            },
            "&:focus-within": {
                borderColor: formatHex8(activeColor),
                backgroundColor: formatHex8(alpha(activeColor, 0.05)),
                boxShadow: `0 0 0 2px ${formatHex8(alpha(activeColor, 0.2))}`,
            },
        },
        solid: {
            backgroundColor: formatHex8(activeColor),
            color: solidTextColor, // Use the contrast-adjusted text color
            border: "none",
            "&:hover": {
                backgroundColor: formatHex8(alpha(activeColor, 0.9)),
            },
            "&:focus-within": {
                backgroundColor: formatHex8(alpha(activeColor, 0.8)),
                boxShadow: `0 0 0 2px ${formatHex8(alpha(activeColor, 0.3))}`,
            },
        },
        soft: {
            backgroundColor: formatHex8(alpha(activeColor, 0.1)),
            color: formatHex8(activeColor),
            border: "none",
            "&:hover": {
                backgroundColor: formatHex8(alpha(activeColor, 0.15)),
            },
            "&:focus-within": {
                backgroundColor: formatHex8(alpha(activeColor, 0.2)),
                boxShadow: `0 0 0 2px ${formatHex8(alpha(activeColor, 0.2))}`,
            },
        },
        plain: {
            backgroundColor: "transparent",
            color: textColorFinal,
            border: "none",
            "&:hover": {
                backgroundColor: formatHex8(alpha(activeColor, 0.05)),
            },
            "&:focus-within": {
                backgroundColor: formatHex8(alpha(activeColor, 0.1)),
                boxShadow: `0 0 0 2px ${formatHex8(alpha(activeColor, 0.2))}`,
            },
        },
    };
};

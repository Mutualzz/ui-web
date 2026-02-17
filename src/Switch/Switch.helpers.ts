import { type CSSObject, type Theme } from "@emotion/react";
import {
    type Color,
    type ColorLike,
    createColor,
    formatColor,
    resolveColor,
    resolveSize,
    type Size,
    type SizeValue,
    type Variant,
} from "@mutualzz/ui-core";

export const baseSizeMap: Record<Size, number> = {
    sm: 16,
    md: 20,
    lg: 24,
};

export const resolveSwitchDimensions = (
    theme: Theme,
    size: Size | SizeValue | number,
): { width: number; height: number; thumb: number; padding: number } => {
    const height = resolveSize(theme, size, baseSizeMap);
    const width = Math.round(height * 1.8);
    const padding = Math.max(2, Math.round(height * 0.15));
    const thumb = height - padding * 2;

    return { width, height, thumb, padding };
};

export const resolveSwitchTrackStyles = (
    theme: Theme,
    color: Color | ColorLike,
    checked: boolean,
): Record<Variant, CSSObject> => {
    const onColor = resolveColor(color, theme);
    const offColor = resolveColor("neutral", theme);

    const trackColor = checked ? onColor : offColor;
    const trackHex = formatColor(trackColor);

    const thumbColor = formatColor(theme.typography.colors.primary, {
        negate: createColor(trackColor).isLight(),
    });

    const hoverBg = formatColor(trackColor, {
        alpha: checked ? 70 : 35,
        format: "hexa",
    });

    const activeBg = formatColor(trackColor, {
        alpha: checked ? 80 : 45,
        format: "hexa",
    });

    return {
        solid: {
            backgroundColor: formatColor(trackColor, {
                alpha: checked ? 100 : 35,
                format: checked ? "hex" : "hexa",
            }),
            border: `1px solid ${trackHex}`,
            "&:hover": {
                backgroundColor: hoverBg,
            },
            "&:active": {
                backgroundColor: activeBg,
            },
            "--switch-thumb": thumbColor,
        },
        outlined: {
            backgroundColor: checked
                ? formatColor(onColor, { alpha: 12, format: "hexa" })
                : "transparent",
            border: `1px solid ${formatColor(trackColor)}`,
            "&:hover": {
                backgroundColor: formatColor(trackColor, {
                    alpha: 18,
                    format: "hexa",
                }),
            },
            "&:active": {
                backgroundColor: formatColor(trackColor, {
                    alpha: 26,
                    format: "hexa",
                }),
            },
            "--switch-thumb": thumbColor,
        },
        soft: {
            backgroundColor: formatColor(trackColor, {
                alpha: checked ? 45 : 22,
                format: "hexa",
            }),
            border: "none",
            "&:hover": {
                backgroundColor: formatColor(trackColor, {
                    alpha: checked ? 55 : 30,
                    format: "hexa",
                }),
            },
            "&:active": {
                backgroundColor: formatColor(trackColor, {
                    alpha: checked ? 65 : 38,
                    format: "hexa",
                }),
            },
            "--switch-thumb": thumbColor,
        },
        plain: {
            backgroundColor: "transparent",
            border: "none",
            "&:hover": {
                backgroundColor: formatColor(trackColor, {
                    alpha: checked ? 22 : 14,
                    format: "hexa",
                }),
            },
            "&:active": {
                backgroundColor: formatColor(trackColor, {
                    alpha: checked ? 30 : 20,
                    format: "hexa",
                }),
            },
            "--switch-thumb": thumbColor,
        },
    };
};

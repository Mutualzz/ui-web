import { type CSSObject, type Theme } from "@emotion/react";
import {
    type Color,
    type ColorLike,
    resolveColorTokens,
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
    const trackTokens = resolveColorTokens(checked ? color : "neutral", theme);

    return {
        solid: {
            backgroundColor: checked ? trackTokens.base : trackTokens.alpha(35),
            border: `1px solid ${trackTokens.base}`,
            "&:hover": {
                backgroundColor: trackTokens.alpha(checked ? 70 : 35),
            },
            "&:active": {
                backgroundColor: trackTokens.alpha(checked ? 80 : 45),
            },
            "--switch-thumb": trackTokens.on,
        },
        outlined: {
            backgroundColor: checked ? trackTokens.alpha(12) : "transparent",
            border: `1px solid ${trackTokens.base}`,
            "&:hover": {
                backgroundColor: trackTokens.alpha(18),
            },
            "&:active": {
                backgroundColor: trackTokens.alpha(26),
            },
            "--switch-thumb": trackTokens.on,
        },
        soft: {
            backgroundColor: trackTokens.alpha(checked ? 45 : 22),
            border: "none",
            "&:hover": {
                backgroundColor: trackTokens.alpha(checked ? 55 : 30),
            },
            "&:active": {
                backgroundColor: trackTokens.alpha(checked ? 65 : 38),
            },
            "--switch-thumb": trackTokens.on,
        },
        plain: {
            backgroundColor: "transparent",
            border: "none",
            "&:hover": {
                backgroundColor: trackTokens.alpha(checked ? 22 : 14),
            },
            "&:active": {
                backgroundColor: trackTokens.alpha(checked ? 30 : 20),
            },
            "--switch-thumb": trackTokens.on,
        },
    };
};

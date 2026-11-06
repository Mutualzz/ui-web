import type { Theme } from "@emotion/react";
import type { Color, ColorLike, Size, SizeValue } from "@mutualzz/ui-core";
import { resolveColorTokens, resolveSize } from "@mutualzz/ui-core";

export const resolveLinearProgressStyles = (
    theme: Theme,
    color: Color | ColorLike,
) => {
    const colorTokens = resolveColorTokens(color, theme);

    return {
        plain: "transparent",
        solid: colorTokens.alpha(20),
        soft: colorTokens.alpha(15),
        outlined: "transparent",
    };
};

export const thicknessMap: Record<Size, number> = {
    sm: 4,
    md: 6,
    lg: 8,
};

export const lengthMap: Record<Size, number> = {
    sm: 100,
    md: 140,
    lg: 180,
};

export const resolveLinearProgressThickness = (
    theme: Theme,
    thickness: Size | SizeValue | number,
) => resolveSize(theme, thickness, thicknessMap);

export const resolveLinearProgressLength = (
    theme: Theme,
    length: Size | SizeValue | number,
) => resolveSize(theme, length, lengthMap);

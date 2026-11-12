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
    typographyColorVar,
} from "@mutualzz/ui-core";

const baseSizeMap: Record<Size, number> = {
    sm: 32,
    md: 40,
    lg: 48,
};

export const resolveOptionSize = (
    theme: Theme,
    size: Size | SizeValue | number,
): CSSObject => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        fontSize: resolvedSize * 0.32,
        paddingInline: resolvedSize * 0.25,
        paddingBlock: resolvedSize * 0.15,
    };
};

export const resolveOptionStyles = (
    theme: Theme,
    color: Color | ColorLike,
    isSelected: boolean,
): Record<Variant, CSSObject> => {
    const colorTokens = resolveColorTokens(color, theme);
    const textColor = typographyColorVar("primary");

    const interactionStyles = (
        highlightBackground: string,
        focusRingColor: string,
    ): CSSObject => ({
        "&:hover": {
            backgroundColor: highlightBackground,
        },
        '&[data-focused="true"]': {
            backgroundColor: highlightBackground,
            boxShadow: `inset 0 0 0 2px ${focusRingColor}`,
        },
    });

    return {
        solid: {
            backgroundColor: isSelected
                ? colorTokens.alpha(75)
                : colorTokens.base,
            color: colorTokens.contrast,
            ...interactionStyles(colorTokens.alpha(88), colorTokens.contrast),
        },
        outlined: {
            "&:not(:first-of-type)": {
                borderTop: `1px solid ${colorTokens.alpha(30)}`,
            },
            backgroundColor: isSelected ? colorTokens.alpha(20) : "transparent",
            color: textColor,
            ...interactionStyles(
                colorTokens.alpha(isSelected ? 28 : 12),
                colorTokens.base,
            ),
        },
        soft: {
            backgroundColor: colorTokens.alpha(isSelected ? 25 : 10),
            color: textColor,
            ...interactionStyles(
                colorTokens.alpha(isSelected ? 32 : 18),
                colorTokens.base,
            ),
        },
        plain: {
            backgroundColor: isSelected ? colorTokens.alpha(20) : "transparent",
            color: textColor,
            ...interactionStyles(
                colorTokens.alpha(isSelected ? 28 : 12),
                colorTokens.base,
            ),
        },
    };
};

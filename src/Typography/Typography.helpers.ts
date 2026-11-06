import type { CSSObject, Theme } from "@emotion/react";
import {
    resolveColorTokens,
    resolveTextColorToken,
    type Color,
    type ColorLike,
    type TypographyColor,
} from "@mutualzz/ui-core";
import type { TypographyVariant } from "./Typography.types";

export const resolveTypographStyles = (
    theme: Theme,
    color: Color | ColorLike,
    textColor: TypographyColor | ColorLike | "inherit",
    colorOnNone = false,
): Record<TypographyVariant, CSSObject> => {
    const colorTokens = resolveColorTokens(color, theme);
    const textColorFinal = resolveTextColorToken(textColor, theme);

    return {
        solid: {
            backgroundColor: colorTokens.base,
            color: colorTokens.contrast,
            border: "none",
        },
        outlined: {
            backgroundColor: "transparent",
            color: colorTokens.base,
            border: `1px solid ${colorTokens.base}`,
        },
        plain: {
            backgroundColor: "transparent",
            color: colorTokens.base,
            border: "none",
        },
        soft: {
            backgroundColor: colorTokens.alpha(40),
            color: colorTokens.base,
            border: "none",
        },
        none: {
            backgroundColor: "transparent",
            border: "none",
            color: colorOnNone ? colorTokens.base : textColorFinal,
        },
    };
};

import type { CSSObject, Theme } from "@emotion/react";
import type {
    Color,
    ColorLike,
    TypographyColor,
    Variant,
} from "@mutualzz/ui-core";
import { resolveColorTokens, resolveTextColorToken } from "@mutualzz/ui-core";

export const resolveInputRootStyles = (
    theme: Theme,
    color: Color | ColorLike,
    textColor: TypographyColor | ColorLike | "inherit",
    error: boolean,
    readonly: boolean,
): Record<Variant, CSSObject> => {
    const colorTokens = resolveColorTokens(error ? "danger" : color, theme);
    const textColorFinal = resolveTextColorToken(textColor, theme);

    return {
        outlined: {
            backgroundColor: "transparent",
            color: textColorFinal,
            border: `1px solid ${colorTokens.base}`,
            ...(!readonly && {
                "&:hover": {
                    borderColor: colorTokens.alpha(50),
                    backgroundColor: colorTokens.alpha(5),
                },
                "&:focus-within": {
                    borderColor: colorTokens.base,
                    backgroundColor: colorTokens.alpha(5),
                    boxShadow: `0 0 0 2px ${colorTokens.alpha(20)}`,
                },
            }),
        },
        solid: {
            backgroundColor: colorTokens.base,
            color: colorTokens.contrast,
            border: "none",
            ...(!readonly && {
                "&:hover": {
                    backgroundColor: colorTokens.alpha(90),
                },
                "&:focus-within": {
                    backgroundColor: colorTokens.alpha(80),
                    boxShadow: `0 0 0 2px ${colorTokens.alpha(30)}`,
                },
            }),
        },
        soft: {
            backgroundColor: colorTokens.alpha(10),
            color: colorTokens.base,
            border: "none",
            ...(!readonly && {
                "&:hover": {
                    backgroundColor: colorTokens.alpha(15),
                },
                "&:focus-within": {
                    backgroundColor: colorTokens.alpha(20),
                    boxShadow: `0 0 0 2px ${colorTokens.alpha(20)}`,
                },
            }),
        },
        plain: {
            backgroundColor: "transparent",
            color: textColorFinal,
            border: "none",
            ...(!readonly && {
                "&:hover": {
                    backgroundColor: colorTokens.alpha(5),
                },
                "&:focus-within": {
                    backgroundColor: colorTokens.alpha(10),
                    boxShadow: `0 0 0 2px ${colorTokens.alpha(20)}`,
                },
            }),
        },
    };
};

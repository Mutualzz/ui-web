import type { CSSObject, Theme } from "@emotion/react";
import type { Color, ColorLike, Variant } from "@mutualzz/ui-core";
import { resolveColorTokens } from "@mutualzz/ui-core";

export const resolveListStyles = (
    theme: Theme,
    color: Color | ColorLike,
): Record<Variant, CSSObject> => {
    const colorTokens = resolveColorTokens(color, theme);

    return {
        solid: {
            backgroundColor: colorTokens.base,
            border: "none",
        },
        outlined: {
            backgroundColor: "transparent",
            border: `1px solid ${colorTokens.alpha(30)}`,
        },
        soft: {
            backgroundColor: colorTokens.alpha(10),
            border: "none",
        },
        plain: {
            backgroundColor: "transparent",
            border: "none",
        },
    };
};

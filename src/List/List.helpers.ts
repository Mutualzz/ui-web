import type { CSSObject, Theme } from "@emotion/react";
import type { Color, ColorLike, Variant } from "@mutualzz/ui-core";
import { formatColor, resolveColor } from "@mutualzz/ui-core";

export const resolveListStyles = (
    theme: Theme,
    color: Color | ColorLike,
): Record<Variant, CSSObject> => {
    const resolvedColor = resolveColor(color, theme);

    return {
        solid: {
            backgroundColor: formatColor(resolvedColor, {
                format: "hexa",
            }),
            border: "none",
        },
        outlined: {
            backgroundColor: "transparent",
            border: `1px solid ${formatColor(resolvedColor, { alpha: 30, format: "hexa" })}`,
        },
        soft: {
            backgroundColor: formatColor(resolvedColor, {
                alpha: 10,
                format: "hexa",
            }),
            border: "none",
        },
        plain: {
            backgroundColor: "transparent",
            border: "none",
        },
    };
};

import { type CSSObject, type Theme } from "@emotion/react";
import type { Color, ColorLike, Variant } from "@mutualzz/ui-core";
import { createColor, formatColor, resolveColor } from "@mutualzz/ui-core";

export const resolveButtonContainerStyles = (
    theme: Theme,
    color: Color | ColorLike,
): Record<Variant, CSSObject> => {
    const resolvedColor = resolveColor(color, theme);
    const hexColor = formatColor(resolvedColor, { format: "hexa" });

    const isLight = createColor(resolvedColor).isLight();

    return {
        solid: {
            backgroundColor: hexColor,
            color: formatColor(theme.typography.colors.primary, {
                format: "hexa",
                negate: isLight,
            }),
            border: "none",
            "&:hover": {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: 80,
                    format: "hexa",
                }),
            },
            "&:active": {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: 70,
                    format: "hexa",
                }),
            },
            "&:disabled": {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: 50,
                    format: "hexa",
                }),
                color: formatColor(theme.typography.colors.primary, {
                    alpha: 60,
                    format: "hexa",
                }),
            },
        },
        outlined: {
            backgroundColor: "transparent",
            border: `1px solid ${formatColor(resolvedColor, { format: "hexa" })}`,
            color: formatColor(resolvedColor, { format: "hexa" }),
            "&:hover": {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: 20,
                    format: "hexa",
                }),
                borderColor: formatColor(resolvedColor, {
                    format: "hexa",
                }),
            },
            "&:active": {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: 30,
                    format: "hexa",
                }),
            },
            "&:disabled": {
                color: formatColor(resolvedColor, {
                    format: "hexa",
                    alpha: 50,
                }),
                borderColor: formatColor(resolvedColor, {
                    alpha: 30,
                    format: "hexa",
                }),
            },
        },
        plain: {
            backgroundColor: "transparent",
            border: "none",
            color: formatColor(resolvedColor, { format: "hexa" }),
            "&:hover": {
                backgroundColor: formatColor(resolvedColor, {
                    format: "hexa",
                    alpha: 20,
                }),
            },
            "&:active": {
                backgroundColor: formatColor(resolvedColor, {
                    format: "hexa",
                    alpha: 30,
                }),
            },
            "&:disabled": {
                color: formatColor(resolvedColor, {
                    alpha: 50,
                    format: "hexa",
                }),
            },
        },
        soft: {
            backgroundColor: formatColor(resolvedColor, {
                alpha: 15,
                format: "hexa",
            }),
            color: formatColor(resolvedColor, {
                format: "hexa",
            }),
            border: "none",
            "&:hover": {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: 30,
                    format: "hexa",
                }),
            },
            "&:active": {
                backgroundColor: formatColor(resolvedColor, {
                    format: "hexa",
                    alpha: 40,
                }),
            },
            "&:disabled": {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: 5,
                    format: "hexa",
                }),
                color: formatColor(resolvedColor, {
                    alpha: 50,
                    format: "hexa",
                }),
            },
        },
    };
};

export const resolveButtonTextStyles = (
    theme: Theme,
    color: Color | ColorLike,
): Record<Variant, CSSObject> => {
    const resolvedColor = resolveColor(color, theme);
    const hexColor = formatColor(resolvedColor, { format: "hexa" });

    const isLight = createColor(resolvedColor).isLight();

    return {
        solid: {
            color: formatColor(theme.typography.colors.primary, {
                format: "hexa",
                negate: isLight,
            }),
        },
        outlined: {
            color: hexColor,
        },
        plain: {
            color: hexColor,
        },
        soft: {
            color: hexColor,
        },
    };
};

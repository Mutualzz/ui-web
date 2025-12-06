import type { CSSObject, Theme } from "@emotion/react";
import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import {
    createColor,
    formatColor,
    resolveColor,
    resolveSize,
} from "@mutualzz/ui-core";

export const baseSizeMap: Record<Size, number> = {
    sm: 32,
    md: 40,
    lg: 48,
};

export const resolveSelectSize = (
    theme: Theme,
    size: Size | SizeValue | number,
): CSSObject => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        minHeight: resolvedSize,
        fontSize: resolvedSize * 0.32,
        paddingInline: resolvedSize * 0.25,
        paddingBlock: resolvedSize * 0.12,
        minWidth: resolvedSize * 3,
        gap: resolvedSize * 0.15,
    };
};

export const resolveSelectStyles = (
    theme: Theme,
    color: Color | ColorLike,
): Record<Variant, CSSObject> => {
    const resolvedColor = resolveColor(color, theme);

    const solidTextColor = formatColor(theme.typography.colors.primary, {
        format: "hexa",
        negate: createColor(resolvedColor).isLight(),
    });

    return {
        solid: {
            backgroundColor: formatColor(resolvedColor, { format: "hexa" }),
            color: solidTextColor,
            "&:hover": {
                backgroundColor: formatColor(resolvedColor, {
                    darken: 30,
                    format: "hexa",
                }),
            },
        },
        outlined: {
            border: `1px solid ${formatColor(resolvedColor, { format: "hexa" })}`,
            color: formatColor(resolvedColor, {
                format: "hexa",
                lighten: 75,
            }),
            "&:hover": {
                backgroundColor: formatColor(resolvedColor, {
                    format: "hexa",
                    darken: 30,
                }),
            },
        },
        soft: {
            backgroundColor: formatColor(resolvedColor, {
                format: "hexa",
                darken: 50,
            }),
            color: formatColor(resolvedColor, {
                format: "hexa",
                lighten: 75,
            }),
            "&:hover": {
                backgroundColor: formatColor(resolvedColor, {
                    format: "hexa",
                    lighten: 5,
                }),
            },
        },
        plain: {
            backgroundColor: "transparent",
            color: formatColor(resolvedColor, {
                format: "hexa",
                lighten: 75,
            }),
            "&:hover": {
                backgroundColor: formatColor(resolvedColor, {
                    darken: 30,
                    format: "hexa",
                }),
            },
        },
    };
};

export const resolveSelectContentStyles = (
    theme: Theme,
    color: Color | ColorLike,
): Record<Variant, CSSObject> => {
    const { colors } = theme;
    const resolvedColor = resolveColor(color, theme);

    return {
        solid: {
            backgroundColor: formatColor(resolvedColor, { format: "hexa" }),
            color: formatColor(theme.typography.colors.primary, {
                format: "hexa",
                negate: createColor(resolvedColor).isLight(),
            }),
        },
        outlined: {
            backgroundColor: colors.background,
            border: `1px solid ${formatColor(resolvedColor, { format: "hexa" })}`,
            color: formatColor(resolvedColor, { format: "hexa", lighten: 20 }),
        },
        soft: {
            backgroundColor: formatColor(resolvedColor, {
                format: "hexa",
                darken: 50,
            }),
            color: formatColor(resolvedColor, { format: "hexa", lighten: 20 }),
        },
        plain: {
            backgroundColor: colors.background,
            color: formatColor(resolvedColor, { format: "hexa" }),
        },
    };
};

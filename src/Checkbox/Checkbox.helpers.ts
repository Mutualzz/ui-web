import { type CSSObject, type Theme } from "@emotion/react";
import {
    createColor,
    formatColor,
    resolveColor,
    resolveSize,
    type Color,
    type ColorLike,
    type Size,
    type SizeValue,
    type Variant,
} from "@mutualzz/ui-core";

export const baseSizeMap: Record<Size, number> = {
    sm: 12,
    md: 16,
    lg: 20,
};

export const resolveCheckboxSize = (
    theme: Theme,
    size: Size | SizeValue | number,
): CSSObject => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        fontSize: resolvedSize,
    };
};

export const resolveCheckboxStyles = (
    theme: Theme,
    color: Color | ColorLike,
    checked?: boolean,
): Record<Variant, CSSObject> => {
    const resolvedColor = resolveColor(color, theme);
    const hexColor = formatColor(resolvedColor);

    const solidTextColor = formatColor(theme.typography.colors.primary, {
        negate: createColor(resolvedColor).isLight(),
    });

    return {
        solid: {
            backgroundColor: hexColor,
            color: solidTextColor,
            border: `1px solid ${hexColor}`,
            "&:hover": {
                backgroundColor: checked
                    ? formatColor(resolvedColor, {
                          alpha: 80,
                          format: "hexa",
                      })
                    : formatColor(resolvedColor, {
                          alpha: 10,
                          format: "hexa",
                      }),
                borderColor: hexColor,
            },
            "&:active": {
                backgroundColor: checked
                    ? formatColor(resolvedColor, {
                          alpha: 70,
                          format: "hexa",
                      })
                    : formatColor(resolvedColor, {
                          alpha: 20,
                          format: "hexa",
                      }),
            },
        },
        outlined: {
            backgroundColor: checked
                ? formatColor(resolvedColor, {
                      alpha: 10,
                      format: "hexa",
                  })
                : "transparent",
            color: formatColor(resolvedColor),
            border: `1px solid ${formatColor(resolvedColor)}`,
            "&:hover": {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: 20,
                    format: "hexa",
                }),
                borderColor: formatColor(resolvedColor),
            },
            "&:active": {
                backgroundColor: formatColor(resolvedColor, {
                    format: "hexa",
                    alpha: 30,
                }),
            },
        },
        soft: {
            backgroundColor: formatColor(resolvedColor, {
                alpha: checked ? 30 : 10,
                format: "hexa",
            }),
            color: formatColor(resolvedColor),
            border: "none",
            "&:hover": {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: checked ? 40 : 20,
                    format: "hexa",
                }),
            },
            "&:active": {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: checked ? 50 : 30,
                    format: "hexa",
                }),
            },
        },
        plain: {
            backgroundColor: "transparent",
            color: formatColor(resolvedColor),
            border: "none",
            "&:hover": {
                backgroundColor: formatColor(resolvedColor, {
                    format: "hexa",
                    alpha: checked ? 20 : 10,
                }),
            },
            "&:active": {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: checked ? 30 : 20,
                    format: "hexa",
                }),
            },
        },
    };
};

export const resolveIconScaling = (
    theme: Theme,
    size: Size | SizeValue | number,
): CSSObject => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        width: resolvedSize * 0.5,
        height: resolvedSize * 0.5,
    };
};

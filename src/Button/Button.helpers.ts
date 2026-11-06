import { type CSSObject, type Theme } from "@emotion/react";
import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    ThemeVarColor,
    Variant,
} from "@mutualzz/ui-core";
import {
    createColor,
    formatColor,
    isThemeVarColor,
    mixTransparent,
    resolveColor,
    resolveSize,
    resolveTextColorAlias,
    themeColorVar,
    themeOnColorVar,
} from "@mutualzz/ui-core";

const baseSizeMap: Record<Size, number> = {
    sm: 12,
    md: 14,
    lg: 16,
};

const resolveButtonColor = (
    color: ThemeVarColor | ColorLike,
    theme: Theme,
): ColorLike => resolveColor(resolveTextColorAlias(color, theme), theme);

const themeVarContainerStyles = (
    color: ThemeVarColor,
    disabled?: boolean,
    selected?: boolean,
): Record<Variant, CSSObject> => {
    const colorVar = themeColorVar(color);

    return {
        solid: {
            backgroundColor: selected ? mixTransparent(colorVar, 70) : colorVar,
            color: themeOnColorVar(color),
            border: "none",
            ...(!disabled && {
                "&:hover": { backgroundColor: mixTransparent(colorVar, 80) },
                "&:active": { backgroundColor: mixTransparent(colorVar, 70) },
            }),
            "&:disabled": { backgroundColor: mixTransparent(colorVar, 50) },
        },
        outlined: {
            backgroundColor: selected
                ? mixTransparent(colorVar, 30)
                : "transparent",
            border: `1px solid ${colorVar}`,
            color: colorVar,
            ...(!disabled && {
                "&:hover": {
                    backgroundColor: mixTransparent(colorVar, 20),
                    borderColor: colorVar,
                },
                "&:active": { backgroundColor: mixTransparent(colorVar, 30) },
            }),
            "&:disabled": { borderColor: mixTransparent(colorVar, 30) },
        },
        plain: {
            backgroundColor: selected
                ? mixTransparent(colorVar, 30)
                : "transparent",
            border: "none",
            color: colorVar,
            ...(!disabled && {
                "&:hover": { backgroundColor: mixTransparent(colorVar, 20) },
                "&:active": { backgroundColor: mixTransparent(colorVar, 30) },
            }),
        },
        soft: {
            backgroundColor: selected
                ? mixTransparent(colorVar, 40)
                : mixTransparent(colorVar, 15),
            color: colorVar,
            border: "none",
            ...(!disabled && {
                "&:hover": { backgroundColor: mixTransparent(colorVar, 30) },
                "&:active": { backgroundColor: mixTransparent(colorVar, 40) },
            }),
            "&:disabled": { backgroundColor: mixTransparent(colorVar, 5) },
        },
    };
};

export const resolveButtonContainerSize = (
    theme: Theme,
    size: Size | SizeValue | number,
    padding?: Size | SizeValue | number,
) => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        fontSize: resolvedSize,
        padding: padding ?? resolvedSize * 0.6,
        gap: resolvedSize * 0.5,
    };
};

export const resolveButtonContainerStyles = (
    theme: Theme,
    color: ThemeVarColor | ColorLike,
    textColor?: Color | ColorLike,
    disabled?: boolean,
    selected?: boolean,
): Record<Variant, CSSObject> => {
    if (isThemeVarColor(color) && !textColor) {
        return themeVarContainerStyles(color, disabled, selected);
    }

    const resolvedColor = resolveButtonColor(color, theme);
    let resolvedTextColor: ColorLike | undefined;
    if (textColor) resolvedTextColor = resolveColor(textColor, theme);
    const hexColor = formatColor(resolvedColor);

    const solidTextColor = formatColor(theme.typography.colors.primary, {
        negate: createColor(resolvedColor).isLight(),
    });

    return {
        solid: {
            backgroundColor: selected
                ? formatColor(resolvedColor, {
                      alpha: 70,
                      format: "hexa",
                  })
                : hexColor,
            color: resolvedTextColor ? resolvedTextColor : solidTextColor,
            border: "none",
            ...(!disabled && {
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
            }),
            "&:disabled": {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: 50,
                    format: "hexa",
                }),
            },
        },
        outlined: {
            backgroundColor: selected
                ? formatColor(resolvedColor, {
                      alpha: 30,
                      format: "hexa",
                  })
                : "transparent",
            border: `1px solid ${formatColor(resolvedColor)}`,
            color: resolvedTextColor ? resolvedTextColor : hexColor,
            ...(!disabled && {
                "&:hover": {
                    backgroundColor: resolvedTextColor
                        ? formatColor(resolvedColor, {
                              alpha: 5,
                              format: "hexa",
                          })
                        : formatColor(resolvedColor, {
                              alpha: 20,
                              format: "hexa",
                          }),
                    borderColor: formatColor(resolvedColor),
                },
                "&:active": {
                    backgroundColor: formatColor(resolvedColor, {
                        alpha: 30,
                        format: "hexa",
                    }),
                },
            }),
            "&:disabled": {
                borderColor: formatColor(resolvedColor, {
                    alpha: 30,
                    format: "hexa",
                }),
            },
        },
        plain: {
            backgroundColor: selected
                ? formatColor(resolvedColor, {
                      format: "hexa",
                      alpha: 30,
                  })
                : "transparent",
            border: "none",
            color: resolvedTextColor ? resolvedTextColor : hexColor,
            ...(!disabled && {
                "&:hover": {
                    backgroundColor: resolvedTextColor
                        ? formatColor(resolvedColor, {
                              alpha: 5,
                              format: "hexa",
                          })
                        : formatColor(resolvedColor, {
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
            }),
        },
        soft: {
            backgroundColor: selected
                ? formatColor(resolvedColor, {
                      format: "hexa",
                      alpha: 40,
                  })
                : formatColor(resolvedColor, {
                      alpha: 15,
                      format: "hexa",
                  }),
            color: resolvedTextColor ? resolvedTextColor : hexColor,
            border: "none",
            ...(!disabled && {
                "&:hover": {
                    backgroundColor: resolvedTextColor
                        ? formatColor(resolvedColor, {
                              alpha: 5,
                              format: "hexa",
                          })
                        : formatColor(resolvedColor, {
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
            }),
            "&:disabled": {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: 5,
                    format: "hexa",
                }),
            },
        },
    };
};

export const resolveButtonTextStyles = (
    theme: Theme,
    color: ThemeVarColor | ColorLike,
    textColor?: Color | ColorLike,
): Record<Variant, CSSObject> => {
    if (isThemeVarColor(color) && !textColor) {
        const colorVar = themeColorVar(color);
        return {
            solid: { color: themeOnColorVar(color) },
            outlined: { color: colorVar },
            plain: { color: colorVar },
            soft: { color: colorVar },
        };
    }

    const resolvedColor = resolveButtonColor(color, theme);
    let resolvedTextColor: ColorLike | undefined;
    if (textColor) resolvedTextColor = resolveColor(textColor, theme);

    const hexColor = formatColor(resolvedColor);

    const solidTextColor = formatColor(theme.typography.colors.primary, {
        negate: createColor(resolvedColor).isLight(),
    });

    return {
        solid: {
            color: resolvedTextColor ? resolvedTextColor : solidTextColor,
        },
        outlined: {
            color: resolvedTextColor ? resolvedTextColor : hexColor,
        },
        plain: {
            color: resolvedTextColor ? resolvedTextColor : hexColor,
        },
        soft: {
            color: resolvedTextColor ? resolvedTextColor : hexColor,
        },
    };
};

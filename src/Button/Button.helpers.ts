import { type CSSObject, type Theme } from "@emotion/react";
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

const baseSizeMap: Record<Size, number> = {
    sm: 12,
    md: 14,
    lg: 16,
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
    color: Color | ColorLike,
    disabled?: boolean,
    selected?: boolean,
): Record<Variant, CSSObject> => {
    const resolvedColor = resolveColor(color, theme);
    const hexColor = formatColor(resolvedColor, { format: "hexa" });

    const solidTextColor = formatColor(theme.typography.colors.primary, {
        format: "hexa",
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
            color: solidTextColor,
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
                color: formatColor(theme.typography.colors.primary, {
                    alpha: 60,
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
            border: `1px solid ${formatColor(resolvedColor, { format: "hexa" })}`,
            color: formatColor(resolvedColor, { format: "hexa" }),
            ...(!disabled && {
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
            }),
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
            backgroundColor: selected
                ? formatColor(resolvedColor, {
                      format: "hexa",
                      alpha: 30,
                  })
                : "transparent",
            border: "none",
            color: formatColor(resolvedColor, { format: "hexa" }),
            ...(!disabled && {
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
            }),
            "&:disabled": {
                color: formatColor(resolvedColor, {
                    alpha: 50,
                    format: "hexa",
                }),
            },
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
            color: formatColor(resolvedColor, {
                format: "hexa",
            }),
            border: "none",
            ...(!disabled && {
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
            }),
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

    const solidTextColor = formatColor(theme.typography.colors.primary, {
        format: "hexa",
        negate: createColor(resolvedColor).isLight(),
    });

    return {
        solid: {
            color: solidTextColor,
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

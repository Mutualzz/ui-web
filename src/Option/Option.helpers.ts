import type { CSSObject, Theme } from "@emotion/react";
import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import { formatColor, resolveColor, resolveSize } from "@mutualzz/ui-core";

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
    const resolvedColor = resolveColor(color, theme);

    return {
        solid: {
            backgroundColor: isSelected
                ? formatColor(resolvedColor, {
                      lighten: 18,
                      format: "hexa",
                  })
                : formatColor(resolvedColor, {
                      format: "hexa",
                  }),
            color: formatColor(theme.typography.colors.primary, {
                format: "hexa",
            }),
            ...(!isSelected && {
                "&:hover": {
                    backgroundColor: formatColor(resolvedColor, {
                        lighten: 28,
                        format: "hexa",
                    }),
                },
            }),
        },
        outlined: {
            "&:not(:first-of-type)": {
                borderTop: `1px solid ${formatColor(resolvedColor, {
                    format: "hexa",
                })}`,
            },
            backgroundColor: isSelected
                ? formatColor(resolvedColor, {
                      alpha: 70,
                      lighten: 15,
                      format: "hexa",
                  })
                : "transparent",
            color: formatColor(resolvedColor, {
                format: "hexa",
                lighten: 80,
            }),
            ...(!isSelected && {
                "&:hover": {
                    backgroundColor: formatColor(resolvedColor, {
                        alpha: 50,
                        lighten: 22,
                        format: "hexa",
                    }),
                },
            }),
        },
        soft: {
            backgroundColor: isSelected
                ? formatColor(resolvedColor, {
                      format: "hexa",
                      alpha: 70,
                      lighten: 15,
                  })
                : formatColor(resolvedColor, {
                      format: "hexa",
                      lighten: 8,
                  }),
            color: formatColor(resolvedColor, {
                format: "hexa",
                lighten: 80,
            }),
            ...(!isSelected && {
                "&:hover": {
                    backgroundColor: formatColor(resolvedColor, {
                        format: "hexa",
                        lighten: 18,
                    }),
                },
            }),
        },
        plain: {
            backgroundColor: isSelected
                ? formatColor(resolvedColor, {
                      alpha: 70,
                      lighten: 15,
                  })
                : "transparent",
            color: formatColor(resolvedColor, {
                lighten: 80,
                format: "hexa",
            }),
            ...(!isSelected && {
                "&:hover": {
                    backgroundColor: formatColor(resolvedColor, {
                        alpha: 50,
                        lighten: 22,
                    }),
                },
            }),
        },
    };
};

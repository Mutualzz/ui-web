import type { CSSObject, Theme } from "@emotion/react";
import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    TypographyColor,
    Variant,
} from "@mutualzz/ui-core";
import {
    formatColor,
    isValidColorInput,
    resolveColor,
    resolveSize,
    resolveTypographyColor,
} from "@mutualzz/ui-core";
import ColorPkg from "color";

export const baseSizeMap: Record<Size, number> = {
    sm: 12,
    md: 14,
    lg: 16,
};

export const resolveInputRootSize = (
    theme: Theme,
    size: Size | SizeValue | number,
    fullWidth?: boolean,
) => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        width: fullWidth ? "100%" : resolvedSize * 16,
        maxWidth: "100%",
        fontSize: resolvedSize,
        lineHeight: 1.2,
        minHeight: resolvedSize * 2.2,
        padding: `${resolvedSize * 0.4}px ${resolvedSize * 0.6}px`,
    };
};

export const resolveInputRootStyles = (
    theme: Theme,
    color: Color | ColorLike,
    textColor: TypographyColor | ColorLike | "inherit",
    error: boolean,
): Record<Variant, CSSObject> => {
    const { colors } = theme;
    const resolvedColor = resolveColor(color, theme);

    const parsedTextColor =
        textColor === "inherit"
            ? theme.typography.colors.primary
            : resolveTypographyColor(textColor, theme);

    const errorColor = colors.danger;
    const activeColor = error ? errorColor : resolvedColor;
    const isColorLike = isValidColorInput(parsedTextColor);

    const luminance = ColorPkg(activeColor).luminosity();
    const solidTextColor =
        luminance < 0.5
            ? formatColor(colors.common.white, {
                  format: "hexa",
              })
            : formatColor(activeColor, {
                  darken: 70,
                  format: "hexa",
              });

    const textColorFinal = formatColor(
        isColorLike ? parsedTextColor : theme.typography.colors.primary,
        {
            format: "hexa",
        },
    );

    return {
        outlined: {
            backgroundColor: "transparent",
            color: textColorFinal,
            border: `1px solid ${formatColor(activeColor, {
                format: "hexa",
            })}`,
            "&:hover": {
                borderColor: formatColor(activeColor, {
                    alpha: 50,
                    format: "hexa",
                }),
                backgroundColor: formatColor(activeColor, {
                    alpha: 5,
                    format: "hexa",
                }),
            },
            "&:focus-within": {
                borderColor: formatColor(activeColor, { format: "hexa" }),
                backgroundColor: formatColor(activeColor, {
                    alpha: 5,
                    format: "hexa",
                }),
                boxShadow: `0 0 0 2px ${formatColor(activeColor, {
                    alpha: 20,
                    format: "hexa",
                })}`,
            },
        },
        solid: {
            backgroundColor: formatColor(activeColor, {
                format: "hexa",
            }),
            color: solidTextColor,
            border: "none",
            "&:hover": {
                backgroundColor: formatColor(activeColor, {
                    alpha: 90,
                    format: "hexa",
                }),
            },
            "&:focus-within": {
                backgroundColor: formatColor(activeColor, {
                    format: "hexa",
                    alpha: 80,
                }),
                boxShadow: `0 0 0 2px ${formatColor(activeColor, {
                    alpha: 30,
                    format: "hexa",
                })}`,
            },
        },
        soft: {
            backgroundColor: formatColor(activeColor, {
                alpha: 10,
                format: "hexa",
            }),
            color: formatColor(activeColor, {
                format: "hexa",
            }),
            border: "none",
            "&:hover": {
                backgroundColor: formatColor(activeColor, {
                    alpha: 15,
                    format: "hexa",
                }),
            },
            "&:focus-within": {
                backgroundColor: formatColor(activeColor, {
                    alpha: 20,
                    format: "hexa",
                }),
                boxShadow: `0 0 0 2px ${formatColor(activeColor, {
                    format: "hexa",
                    alpha: 20,
                })}`,
            },
        },
        plain: {
            backgroundColor: "transparent",
            color: textColorFinal,
            border: "none",
            "&:hover": {
                backgroundColor: formatColor(activeColor, {
                    alpha: 5,
                    format: "hexa",
                }),
            },
            "&:focus-within": {
                backgroundColor: formatColor(activeColor, {
                    alpha: 10,
                    format: "hexa",
                }),
                boxShadow: `0 0 0 2px ${formatColor(activeColor, { alpha: 20, format: "hexa" })}`,
            },
        },
    };
};

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
    createColor,
    formatColor,
    isValidColorInput,
    resolveColor,
    resolveSize,
    resolveTypographyColor,
} from "@mutualzz/ui-core";

const baseSizeMap: Record<Size, number> = {
    sm: 12,
    md: 14,
    lg: 16,
};

export const resolveTextareaSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        fontSize: resolvedSize,
        minHeight: resolvedSize * 4,
    };
};

export const resolveTextareaInputSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);
    const padding = `${resolvedSize * 0.5}px ${resolvedSize * 0.75}px`;

    return {
        padding,
    };
};

export const resolveTextareaStyles = (
    theme: Theme,
    color: Color | ColorLike,
    textColor: TypographyColor | ColorLike | "inherit",
): Record<Variant, CSSObject> => {
    const { colors } = theme;
    const resolvedColor = resolveColor(color, theme);

    const parsedTextColor =
        textColor === "inherit"
            ? theme.typography.colors.primary
            : resolveTypographyColor(textColor, theme);

    const errorColor = colors.danger;
    const isColorLike = isValidColorInput(parsedTextColor);

    const isDark = createColor(resolvedColor).isDark();
    const solidTextColor = isDark
        ? formatColor(theme.typography.colors.primary, {
              format: "hexa",
          })
        : formatColor(resolvedColor, {
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
        solid: {
            backgroundColor: formatColor(resolvedColor, {
                format: "hexa",
            }),
            color: solidTextColor,
            border: "none",
            "&:focus-within": {
                backgroundColor: formatColor(resolvedColor, {
                    format: "hexa",
                    alpha: 90,
                }),
            },
        },
        outlined: {
            backgroundColor: colors.background,
            border: `1px solid ${formatColor(resolvedColor, { alpha: 30, format: "hexa" })}`,
            color: textColorFinal,
            "&:focus-within": {
                borderColor: formatColor(resolvedColor, {
                    format: "hexa",
                }),
                backgroundColor: formatColor(resolvedColor, {
                    alpha: 5,
                    format: "hexa",
                }),
            },
        },
        soft: {
            backgroundColor: formatColor(resolvedColor, {
                alpha: 10,
                format: "hexa",
            }),
            border: "none",
            color: textColorFinal,
            "&:focus-within": {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: 15,
                    format: "hexa",
                }),
            },
        },
        plain: {
            backgroundColor: "transparent",
            border: "none",
            color: textColorFinal,
            "&:focus-within": {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: 5,
                    format: "hexa",
                }),
            },
        },
    };
};

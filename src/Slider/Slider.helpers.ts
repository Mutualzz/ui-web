import type { CSSObject, Theme } from "@emotion/react";
import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import { formatColor, resolveColor, resolveSize } from "@mutualzz/ui-core";

const thumbSizeMap: Record<Size, number> = {
    sm: 16,
    md: 20,
    lg: 24,
};

export const resolveSliderThumbSize = (
    theme: Theme,
    size: Size | SizeValue | number,
): CSSObject => {
    const resolvedSize = resolveSize(theme, size, thumbSizeMap);

    return {
        width: resolvedSize,
        height: resolvedSize,
        borderRadius: resolvedSize / 2,
    };
};

export const resolveSliderTrackThickness = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const resolvedSize = resolveSize(theme, size, thumbSizeMap);

    return Math.round(resolvedSize / 3);
};

export const resolveSliderTickSize = (
    theme: Theme,
    size: Size | SizeValue | number,
): CSSObject => {
    const resolvedSize = resolveSize(theme, size, thumbSizeMap);

    const tickSize = Math.round(resolvedSize * 0.25);

    return {
        width: tickSize,
        height: tickSize,
    };
};

export const resolveSliderLabelSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const baseFontMap: Record<Size, number> = {
        sm: theme.typography.levels["body-xs"].fontSize,
        md: theme.typography.levels["body-sm"].fontSize,
        lg: theme.typography.levels["body-md"].fontSize,
    };

    return resolveSize(theme, size, baseFontMap);
};

export const resolveSliderTrackStyles = (
    theme: Theme,
    color: Color | ColorLike,
    hovered: boolean,
): Record<Variant, CSSObject> => {
    const resolvedColor = resolveColor(color, theme);

    return {
        solid: {
            backgroundColor: hovered
                ? formatColor(resolvedColor, { alpha: 90, format: "hexa" })
                : formatColor(resolvedColor),
        },
        outlined: {
            border: hovered
                ? `1px solid ${formatColor(resolvedColor, { format: "hexa", alpha: 70 })}`
                : `1px solid ${formatColor(resolvedColor)}`,
            backgroundColor: hovered
                ? formatColor(resolvedColor, {
                      alpha: 10,
                      format: "hexa",
                  })
                : "transparent",
        },
        plain: {
            backgroundColor: hovered
                ? formatColor(resolvedColor, {
                      alpha: 20,
                      format: "hexa",
                  })
                : "transparent",
        },
        soft: {
            backgroundColor: hovered
                ? formatColor(resolvedColor, {
                      alpha: 20,
                      format: "hexa",
                  })
                : formatColor(resolvedColor, {
                      format: "hexa",
                      alpha: 10,
                  }),
        },
    };
};

export const resolveSliderThumbStyles = (
    theme: Theme,
    color: Color | ColorLike,
    hovered: boolean,
): Record<Variant, CSSObject> => {
    const { colors } = theme;

    const resolvedColor = resolveColor(color, theme);

    return {
        solid: {
            backgroundColor: colors.common.white,
            border: hovered
                ? `2px solid ${formatColor(resolvedColor, {
                      format: "hexa",
                      alpha: 90,
                  })}`
                : `2px solid ${formatColor(resolvedColor)}`,
        },
        outlined: {
            backgroundColor: colors.common.white,
            border: `2px solid ${formatColor(resolvedColor)}`,
        },
        plain: {
            backgroundColor: formatColor(resolvedColor, {
                format: "hexa",
                alpha: 80,
            }),
        },
        soft: {
            backgroundColor: hovered
                ? formatColor(resolvedColor, {
                      lighten: 50,
                  })
                : formatColor(resolvedColor, {
                      lighten: 70,
                  }),
            border: hovered
                ? `2px solid ${formatColor(resolvedColor, { alpha: 85, format: "hexa" })}`
                : `2px solid ${formatColor(resolvedColor)}`,
        },
    };
};

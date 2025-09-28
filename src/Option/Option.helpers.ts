import type { CSSObject, Theme } from "@emotion/react";
import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import {
    alpha,
    getLuminance,
    lighten,
    resolveColor,
    resolveColorFromLuminance,
    resolveSize,
} from "@mutualzz/ui-core";
import { formatHex, formatHex8 } from "culori";

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
    const bgLuminance = getLuminance(resolvedColor);
    const textColor = resolveColorFromLuminance(bgLuminance, theme);

    return {
        solid: {
            backgroundColor: isSelected
                ? formatHex(lighten(resolvedColor, 0.18)) // lighter when selected
                : formatHex(resolvedColor),
            color: formatHex(textColor),
            ...(!isSelected && {
                "&:hover": {
                    backgroundColor: formatHex(lighten(resolvedColor, 0.28)), // even lighter on hover
                },
            }),
        },
        outlined: {
            "&:not(:first-of-type)": {
                borderTop: `1px solid ${formatHex(resolvedColor)}`,
            },
            backgroundColor: isSelected
                ? formatHex8(alpha(lighten(resolvedColor, 0.15), 0.7))
                : "transparent",
            color: formatHex(lighten(resolvedColor, 0.8)),
            ...(!isSelected && {
                "&:hover": {
                    backgroundColor: formatHex8(
                        alpha(lighten(resolvedColor, 0.22), 0.5),
                    ),
                },
            }),
        },
        soft: {
            backgroundColor: isSelected
                ? formatHex8(alpha(lighten(resolvedColor, 0.15), 0.7))
                : formatHex(lighten(resolvedColor, 0.08)),
            color: formatHex(lighten(resolvedColor, 0.8)),
            ...(!isSelected && {
                "&:hover": {
                    backgroundColor: formatHex(lighten(resolvedColor, 0.18)),
                },
            }),
        },
        plain: {
            backgroundColor: isSelected
                ? formatHex8(alpha(lighten(resolvedColor, 0.15), 0.7))
                : "transparent",
            color: formatHex(lighten(resolvedColor, 0.8)),
            ...(!isSelected && {
                "&:hover": {
                    backgroundColor: formatHex8(
                        alpha(lighten(resolvedColor, 0.22), 0.5),
                    ),
                },
            }),
        },
    };
};

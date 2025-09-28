import { type CSSObject, type Theme } from "@emotion/react";
import {
    alpha,
    getLuminance,
    resolveColor,
    resolveColorFromLuminance,
    resolveSize,
    type Color,
    type ColorLike,
    type Size,
    type SizeValue,
    type Variant,
} from "@mutualzz/ui-core";
import { formatHex8 } from "culori";

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
    const bgLuminance = getLuminance(resolvedColor);
    const textColor = resolveColorFromLuminance(bgLuminance, theme);
    const hexColor = formatHex8(resolvedColor);

    return {
        solid: {
            backgroundColor: hexColor,
            color: textColor,
            border: `1px solid ${hexColor}`,
            "&:hover": {
                backgroundColor: checked
                    ? formatHex8(alpha(resolvedColor, 0.8))
                    : formatHex8(alpha(resolvedColor, 0.1)),
                borderColor: hexColor,
            },
            "&:active": {
                backgroundColor: checked
                    ? formatHex8(alpha(resolvedColor, 0.7))
                    : formatHex8(alpha(resolvedColor, 0.2)),
            },
        },
        outlined: {
            backgroundColor: checked
                ? formatHex8(alpha(resolvedColor, 0.1))
                : "transparent",
            color: formatHex8(resolvedColor),
            border: `1px solid ${formatHex8(resolvedColor)}`,
            "&:hover": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.2)),
                borderColor: formatHex8(resolvedColor),
            },
            "&:active": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.3)),
            },
        },
        soft: {
            backgroundColor: formatHex8(
                alpha(resolvedColor, checked ? 0.3 : 0.1),
            ),
            color: formatHex8(resolvedColor),
            border: "none",
            "&:hover": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.4)),
            },
            "&:active": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.5)),
            },
        },
        plain: {
            backgroundColor: "transparent",
            color: formatHex8(resolvedColor),
            border: "none",
            "&:hover": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.2)),
            },
            "&:active": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.3)),
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

import type { Theme } from "@emotion/react";
import type { Color, ColorLike, Size, SizeValue } from "@mutualzz/ui-core";
import {
    alpha,
    getLuminance,
    resolveColor,
    resolveColorFromLuminance,
    resolveSize,
} from "@mutualzz/ui-core";
import { formatHex8 } from "culori";

const baseSizeMap: Record<Size, number> = {
    sm: 16,
    md: 20,
    lg: 24,
};

export const resolveColorPickerButtonSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        width: resolvedSize,
        height: resolvedSize,
        minWidth: resolvedSize,
        minHeight: resolvedSize,
        borderRadius: resolvedSize * 0.25,
        padding: 0,
    };
};

export const resolveColorPickerButtonStyles = (
    theme: Theme,
    color: Color | ColorLike,
) => {
    const resolvedColor = resolveColor(color, theme);
    const bgLuminance = getLuminance(resolvedColor);
    const contrastColor = resolveColorFromLuminance(bgLuminance, theme);

    return {
        solid: {
            background: resolvedColor,
            border: `2px solid ${contrastColor}`,
            "&:hover": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.9)),
                borderColor: contrastColor,
            },
            "&:active": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.8)),
            },
        },
        outlined: {
            background: resolvedColor,
            border: `2px solid ${formatHex8(alpha(resolvedColor, 0.6))}`,
            "&:hover": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.9)),
                borderColor: formatHex8(alpha(resolvedColor, 0.8)),
            },
            "&:active": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.8)),
            },
        },
        soft: {
            background: resolvedColor,
            border: `2px solid ${formatHex8(alpha(contrastColor, 0.3))}`,
            "&:hover": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.9)),
                borderColor: formatHex8(alpha(contrastColor, 0.5)),
            },
            "&:active": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.8)),
            },
        },
        plain: {
            background: resolvedColor,
            border: "2px solid transparent",
            "&:hover": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.9)),
                borderColor: formatHex8(alpha(contrastColor, 0.2)),
            },
            "&:active": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.8)),
            },
        },
    };
};

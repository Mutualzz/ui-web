import type { Theme } from "@emotion/react";
import type { Color, ColorLike, Size, SizeValue } from "@mutualzz/ui-core";
import {
    formatColor,
    resolveColor,
    resolveColorFromLuminance,
    resolveSize,
} from "@mutualzz/ui-core";
import ColorPkg from "color";

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
    const contrastColor = resolveColorFromLuminance(
        ColorPkg(resolvedColor),
        theme,
    );

    return {
        solid: {
            background: resolvedColor,
            border: `2px solid ${contrastColor}`,
            "&:hover": {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: 90,
                    format: "hexa",
                }),
                borderColor: contrastColor,
            },
            "&:active": {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: 80,
                    format: "hexa",
                }),
            },
        },
        outlined: {
            background: resolvedColor,
            border: `2px solid ${formatColor(resolvedColor, {
                format: "hexa",
                alpha: 60,
            })}`,
            "&:hover": {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: 90,
                    format: "hexa",
                }),
                borderColor: formatColor(resolvedColor, {
                    alpha: 80,
                    format: "hexa",
                }),
            },
            "&:active": {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: 80,
                    format: "hexa",
                }),
            },
        },
        soft: {
            background: resolvedColor,
            border: `2px solid ${formatColor(contrastColor, {
                format: "hexa",
                alpha: 30,
            })}`,
            "&:hover": {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: 90,
                    format: "hexa",
                }),
                borderColor: formatColor(contrastColor, {
                    alpha: 50,
                    format: "hexa",
                }),
            },
            "&:active": {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: 80,
                    format: "hexa",
                }),
            },
        },
        plain: {
            background: resolvedColor,
            border: "2px solid transparent",
            "&:hover": {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: 90,
                    format: "hexa",
                }),
                borderColor: formatColor(contrastColor, {
                    alpha: 20,
                    format: "hexa",
                }),
            },
            "&:active": {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: 80,
                    format: "hexa",
                }),
            },
        },
    };
};

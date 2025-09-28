import { type CSSObject, type Theme } from "@emotion/react";
import type { Color, ColorLike, Variant } from "@mutualzz/ui-core";
import {
    alpha,
    getLuminance,
    resolveColor,
    resolveColorFromLuminance,
} from "@mutualzz/ui-core";
import { formatHex8 } from "culori";

export const resolveButtonContainerStyles = (
    theme: Theme,
    color: Color | ColorLike,
): Record<Variant, CSSObject> => {
    const resolvedColor = resolveColor(color, theme);
    const bgLuminance = getLuminance(resolvedColor);
    const textColor = resolveColorFromLuminance(bgLuminance, theme);
    const hexColor = formatHex8(resolvedColor);

    return {
        solid: {
            backgroundColor: hexColor,
            color: textColor,
            border: "none",
            "&:hover": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.8)),
            },
            "&:active": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.7)),
            },
            "&:disabled": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.5)),
                color: formatHex8(alpha(textColor, 0.6)),
            },
        },
        outlined: {
            backgroundColor: "transparent",
            border: `1px solid ${formatHex8(resolvedColor)}`,
            color: formatHex8(resolvedColor),
            "&:hover": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.2)),
                borderColor: formatHex8(resolvedColor),
            },
            "&:active": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.3)),
            },
            "&:disabled": {
                color: formatHex8(alpha(resolvedColor, 0.5)),
                borderColor: formatHex8(alpha(resolvedColor, 0.3)),
            },
        },
        plain: {
            backgroundColor: "transparent",
            border: "none",
            color: formatHex8(resolvedColor),
            "&:hover": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.2)),
            },
            "&:active": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.3)),
            },
            "&:disabled": {
                color: formatHex8(alpha(resolvedColor, 0.5)),
            },
        },
        soft: {
            backgroundColor: formatHex8(alpha(resolvedColor, 0.15)),
            color: formatHex8(resolvedColor),
            border: "none",
            "&:hover": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.3)),
            },
            "&:active": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.4)),
            },
            "&:disabled": {
                backgroundColor: formatHex8(alpha(resolvedColor, 0.05)),
                color: formatHex8(alpha(resolvedColor, 0.5)),
            },
        },
    };
};

export const resolveButtonTextStyles = (
    theme: Theme,
    color: Color | ColorLike,
): Record<Variant, CSSObject> => {
    const resolvedColor = resolveColor(color, theme);
    const bgLuminance = getLuminance(resolvedColor);
    const textColor = resolveColorFromLuminance(bgLuminance, theme);

    return {
        solid: {
            color: textColor,
        },
        outlined: {
            color: formatHex8(resolvedColor),
        },
        plain: {
            color: formatHex8(resolvedColor),
        },
        soft: {
            color: formatHex8(resolvedColor),
        },
    };
};

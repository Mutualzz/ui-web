import type { CSSObject, Theme } from "@emotion/react";
import type { Color, ColorLike, Size, SizeValue } from "@mutualzz/ui-core";
import {
    createColor,
    formatColor,
    resolveColor,
    resolveSize,
} from "@mutualzz/ui-core";
import type { AvatarShape } from "./Avatar.types";

const baseSizeMap: Record<Size, number> = {
    sm: 28,
    md: 36,
    lg: 48,
};

export const resolveAvatarSize = (
    theme: Theme,
    size: Size | SizeValue | number,
    hasText: boolean,
): CSSObject => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    const base = {
        width: resolvedSize,
        height: resolvedSize,
    };

    if (hasText) {
        return {
            ...base,
            padding: resolvedSize / 6,
            fontSize: resolvedSize / 2.2,
        };
    } else return base;
};

export const resolveAvatarShape = (
    radius: AvatarShape | SizeValue | number,
): CSSObject => {
    let resolvedRadius;
    switch (radius) {
        case "circle":
            resolvedRadius = 9999;
            break;
        case "rounded":
            resolvedRadius = "25%";
            break;
        case "square":
            resolvedRadius = 0;
            break;
        default:
            resolvedRadius = radius;
            break;
    }

    return {
        borderRadius: resolvedRadius,
    };
};

export const resolveAvatarStyles = (
    theme: Theme,
    color: Color | ColorLike,
    hasText: boolean,
) => {
    const resolvedColor = resolveColor(color, theme);
    const hexColor = formatColor(resolvedColor, { format: "hexa" });

    const solidTextColor = formatColor(theme.typography.colors.primary, {
        format: "hexa",
        negate: createColor(resolvedColor).isLight(),
    });

    return {
        ...(hasText && {
            solid: {
                backgroundColor: hexColor,
                color: solidTextColor,
                border: "none",
            },
            plain: {
                backgroundColor: "transparent",
                border: "none",
                color: formatColor(resolvedColor, { format: "hexa" }),
            },
            soft: {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: 15,
                    format: "hexa",
                }),
                color: formatColor(resolvedColor, { format: "hexa" }),
                border: "none",
            },
        }),
        outlined: {
            backgroundColor: "transparent",
            border: `1px solid ${formatColor(resolvedColor, { format: "hexa" })}`,
            color: formatColor(resolvedColor, { format: "hexa" }),
        },
    };
};

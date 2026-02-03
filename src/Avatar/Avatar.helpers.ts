import type { CSSObject, Theme } from "@emotion/react";
import {
    type Color,
    type ColorLike,
    createColor,
    dynamicElevation,
    formatColor,
    resolveColor,
    resolveSize,
    type Size,
    type SizeValue,
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
    elevation: number,
) => {
    const { colors } = theme;
    const resolvedColor = resolveColor(color, theme);
    const hexColor = formatColor(resolvedColor);

    const solidTextColor = formatColor(theme.typography.colors.primary, {
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
                color: formatColor(resolvedColor),
            },
            soft: {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: 15,
                    format: "hexa",
                }),
                color: formatColor(resolvedColor),
                border: "none",
            },
        }),
        elevation: {
            background: dynamicElevation(colors.surface, elevation),
            boxShadow: `0 ${2 + elevation}px ${8 + elevation * 2}px rgba(0,0,0,${0.1 + elevation * 0.05})`,
            backdropFilter: `blur(${6 + elevation * 2}px)`,
        },
        outlined: {
            backgroundColor: "transparent",
            border: `1px solid ${formatColor(resolvedColor)}`,
            color: formatColor(resolvedColor),
        },
    };
};

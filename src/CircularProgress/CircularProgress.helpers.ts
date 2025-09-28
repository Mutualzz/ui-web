import type { CSSObject, Theme } from "@emotion/react";
import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import { alpha, resolveColor, resolveSize } from "@mutualzz/ui-core";
import { formatHex8 } from "culori";

export const baseSizeMap: Record<Size, number> = {
    sm: 32,
    md: 40,
    lg: 48,
};

const strokeWidthSizeMap: Record<Size, number> = {
    sm: 2,
    md: 4,
    lg: 6,
};

export const resolveCircularProgressOuterStroke = (
    theme: Theme,
    color: Color | ColorLike,
): Record<Variant, CSSObject> => {
    const resolvedColor = resolveColor(color, theme);

    return {
        plain: {
            stroke: "transparent",
        },
        solid: {
            stroke: formatHex8(alpha(resolvedColor, 0.5))!,
        },
        soft: {
            stroke: formatHex8(alpha(resolvedColor, 0.1))!,
        },
        outlined: {
            stroke: "transparent",
        },
    };
};

export const resolveCircularProgressSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => resolveSize(theme, size, baseSizeMap);

export const calculateCircle = (
    theme: Theme,
    size: Size | SizeValue | number,
    value: number,
    contentDiameter: number,
    strokeWidth: Size | SizeValue | number,
): Record<string, number> => {
    const baseDiameter = resolveCircularProgressSize(theme, size);
    const strokeWidthValue = strokeWidth
        ? resolveSize(theme, strokeWidth, strokeWidthSizeMap)
        : Math.max(2, baseDiameter * 0.1);

    const diameter = contentDiameter
        ? contentDiameter + strokeWidthValue + 8 * 2
        : baseDiameter;

    const radius = (diameter - strokeWidthValue) / 2;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = ((100 - value) / 100) * circumference;

    return {
        baseDiameter,
        strokeWidthValue,
        diameter,
        radius,
        circumference,
        dashOffset,
    };
};

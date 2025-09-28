import type { Theme } from "@emotion/react";
import type { Color, ColorLike, Variant } from "@mutualzz/ui-core";
import { lighten, resolveColor } from "@mutualzz/ui-core";
import { formatHex8 } from "culori";

export const resolvePasswordIconStyles = (
    theme: Theme,
    color: Color | ColorLike,
): Record<Variant, string> => {
    const resolvedColor = resolveColor(color, theme);

    const hexColor = formatHex8(resolvedColor) ?? theme.colors.primary;

    return {
        outlined: hexColor,
        solid: formatHex8(lighten(resolvedColor, 1)) ?? theme.colors.primary,
        plain: hexColor,
        soft: formatHex8(lighten(resolvedColor, 0.25)) ?? theme.colors.primary,
    };
};

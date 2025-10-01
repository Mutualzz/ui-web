import type { CSSObject, Theme } from "@emotion/react";
import type { Color, ColorLike, TypographyColor } from "@mutualzz/ui-core";
import {
    formatColor,
    isThemeColor,
    isTypographyColor,
    resolveColor,
    resolveTypographyColor,
} from "@mutualzz/ui-core";
import type { DividerVariant } from "./Divider.types";

export const resolveDividerColor = (
    theme: Theme,
    color: Color | ColorLike | TypographyColor,
) => {
    const resolvedColor = isThemeColor(color)
        ? resolveColor(color, theme)
        : isTypographyColor(color)
          ? resolveTypographyColor(color, theme)
          : resolveColor(color, theme);

    return formatColor(resolvedColor, { format: "hexa" });
};

export const resolveDividerStyles = (
    isVertical: boolean,
    lineColor: string,
): Record<DividerVariant, CSSObject> => {
    return {
        dashed: {
            ...(isVertical
                ? {
                      width: "1px",
                      backgroundImage: `repeating-linear-gradient(to bottom,${lineColor},${lineColor} 4px,transparent 4px,transparent 8px);`,
                  }
                : {
                      height: "1px",
                      backgroundImage: `repeating-linear-gradient(to right,${lineColor},${lineColor} 4px,transparent 4px,transparent 8px)`,
                  }),
        },
        dotted: {
            ...(isVertical
                ? {
                      width: "1px",
                      backgroundImage: `repeating-linear-gradient(to bottom,${lineColor},${lineColor} 1px,transparent 1px,transparent 4px)`,
                  }
                : {
                      height: "1px",
                      backgroundImage: `repeating-linear-gradient(to right,${lineColor},${lineColor} 1px,transparent 1px,transparent 4px)`,
                  }),
        },
        double: {
            ...(isVertical
                ? {
                      width: "1px",
                      borderLeft: `3px double ${lineColor}`,
                      background: "none",
                      boxSizing: "content-box" as const,
                  }
                : {
                      height: 0,
                      borderTop: `3px double ${lineColor}`,
                      background: "none",
                      boxSizing: "content-box" as const,
                  }),
        },
        solid: {
            ...(isVertical ? { width: "1px" } : { height: "1px" }),
            backgroundColor: lineColor,
        },
    };
};

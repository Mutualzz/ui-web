import type { Theme } from "@emotion/react";
import {
    createColor,
    dynamicElevation,
    flipNumber,
    formatColor,
    isValidGradient,
    resolveColor,
    resolveTypographyColor,
    type Color,
    type ColorLike,
    type TypographyColor,
} from "@mutualzz/ui-core";
import type { PaperVariant } from "./Paper.types";

export const resolvePaperStyles = (
    theme: Theme,
    color: Color | ColorLike,
    textColor: TypographyColor | ColorLike | "inherit",
    variant: PaperVariant,
    elevation: number,
    transparency: number,
) => {
    const { colors } = theme;
    const resolvedColor = resolveColor(color, theme);

    const resolvedTextColor =
        textColor === "inherit"
            ? resolvedColor
            : resolveTypographyColor(textColor, theme);

    const textColorWithFallback =
        formatColor(resolvedTextColor, {
            format: "hexa",
        }) ?? theme.typography.colors.muted;

    const solidTextColor = formatColor(theme.typography.colors.primary, {
        format: "hexa",
        negate: createColor(resolvedColor).isLight(),
    });

    const elevatedColor = dynamicElevation(
        variant === "solid" ? resolvedColor : colors.surface,
        elevation,
    );

    const isGradient = isValidGradient(elevatedColor);
    const gradientLayer = isGradient
        ? formatColor(elevatedColor, {
              alpha: flipNumber(transparency),
              format: "hexa",
          })
        : null;

    const opaqueBase =
        formatColor(colors.background, { format: "hexa" }) ??
        formatColor(colors.neutral, { darken: 20, format: "hexa" });

    const elevatedBackgroundStyles = isGradient
        ? {
              backgroundColor: opaqueBase,
              backgroundImage: gradientLayer!,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
          }
        : {
              background: elevatedColor,
          };

    return {
        elevation: {
            ...elevatedBackgroundStyles,
            boxShadow: `0 ${2 + elevation}px ${8 + elevation * 2}px rgba(0,0,0,${0.1 + elevation * 0.05})`,
            backdropFilter: `blur(${6 + elevation * 2}px)`,
        },
        solid: {
            background:
                formatColor(elevatedColor, {
                    format: "hexa",
                }) ?? theme.colors.primary,
            color: solidTextColor,
            border: "none",
        },
        outlined: {
            ...(elevation === 0
                ? { background: "transparent" }
                : elevatedBackgroundStyles),
            border: `1px solid ${formatColor(resolvedColor, { alpha: 20, format: "hexa" })}`,
            color: textColorWithFallback,
        },
        plain: {
            ...(elevation === 0
                ? { background: "transparent" }
                : elevatedBackgroundStyles),
            border: "none",
            color: textColorWithFallback,
        },
        soft: {
            background: formatColor(
                elevation === 0
                    ? resolvedColor
                    : (gradientLayer ?? resolvedColor),
                {
                    alpha: 10,
                    format: "hexa",
                },
            ),
            border: "none",
            color: textColorWithFallback,
        },
    };
};

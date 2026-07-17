import type { Theme } from "@emotion/react";
import {
    createColor,
    dynamicElevation,
    flipNumber,
    formatColor,
    isValidGradient,
    resolveColor,
    resolveTypographyColor,
    resolveWallpaperSurfaceStyles,
    type Color,
    type ColorLike,
    type TypographyColor,
    type WallpaperSurfaceRole,
} from "@mutualzz/ui-core";
import type { PaperVariant } from "./Paper.types";

export const resolvePaperStyles = (
    theme: Theme,
    color: Color | ColorLike,
    textColor: TypographyColor | ColorLike,
    variant: PaperVariant,
    elevation: number,
    transparency: number,
    surfaceRole?: WallpaperSurfaceRole,
) => {
    const { colors } = theme;
    const surface =
        surfaceRole && theme.backgroundImageUrl
            ? resolveWallpaperSurfaceStyles(theme, surfaceRole)
            : null;

    const resolvedColor = resolveColor(color, theme);
    const resolvedTextColor = resolveTypographyColor(textColor, theme);

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

    const opaqueBase = formatColor(colors.background, { format: "hexa" });

    const elevatedBackgroundStyles = isGradient
        ? {
              backgroundColor: opaqueBase,
              backgroundImage: gradientLayer,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
          }
        : {
              background: elevatedColor,
          };

    const transparentPanel = { background: "transparent" };

    const applySurface = (base: Record<string, unknown>) =>
        surface ? { ...base, ...surface } : base;

    const elevationStyles = surface
        ? surface
        : {
              ...elevatedBackgroundStyles,
              boxShadow: `0 ${2 + elevation}px ${8 + elevation * 2}px rgba(0,0,0,${0.1 + elevation * 0.05})`,
          };

    const panelBackground =
        elevation === 0 ? transparentPanel : elevatedBackgroundStyles;

    return {
        elevation: elevationStyles,
        solid: applySurface({
            background: formatColor(elevatedColor),
            color: solidTextColor,
            border: "none",
        }),
        outlined: applySurface({
            ...panelBackground,
            border: `1px solid ${formatColor(resolvedColor, { alpha: 20, format: "hexa" })}`,
            color: resolvedTextColor,
        }),
        plain: applySurface({
            ...panelBackground,
            border: "none",
            color: resolvedTextColor,
        }),
        soft: applySurface({
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
            color: resolvedTextColor,
        }),
    };
};

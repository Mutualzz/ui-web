import type { Theme } from "@emotion/react";
import {
    createColor,
    dynamicElevation,
    formatColor,
    isValidGradient,
    resolveColor,
    resolvePanelFill,
    resolveTypographyColor,
    resolveWallpaperSurfaceStyles,
    isWallpaperSurfaceRole,
    type Color,
    type ColorLike,
    type PaperVariant,
    type SurfaceRole,
    type TypographyColor,
} from "@mutualzz/ui-core";

export const resolvePaperStyles = (
    theme: Theme,
    color: Color | ColorLike,
    textColor: TypographyColor | ColorLike,
    variant: PaperVariant,
    elevation: number,
    surfaceRole?: SurfaceRole,
) => {
    const { colors } = theme;
    const surface =
        surfaceRole &&
        theme.backgroundImageUrl &&
        isWallpaperSurfaceRole(surfaceRole)
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

    const elevatedBackgroundStyles = resolvePanelFill(
        theme,
        elevatedColor,
        variant === "elevation" ? "elevation" : variant,
        elevation,
        surfaceRole,
    );

    const applySurface = (base: Record<string, unknown>) =>
        surface ? { ...base, ...surface } : base;

    const elevationStyles = surface
        ? surface
        : {
              ...elevatedBackgroundStyles,
              boxShadow: `0 ${2 + elevation}px ${8 + elevation * 2}px rgba(0,0,0,${0.1 + elevation * 0.05})`,
          };

    const panelBackground =
        elevation === 0 && (variant === "outlined" || variant === "plain")
            ? { background: "transparent" }
            : elevatedBackgroundStyles;

    const softFill = formatColor(
        elevation === 0 ? resolvedColor : elevatedColor,
        {
            alpha: 10,
            format: "hexa",
        },
    );

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
            background: softFill,
            border: "none",
            color: resolvedTextColor,
        }),
    };
};

import { Global, type CSSObject } from "@emotion/react";
import {
    formatColor,
    resolveWallpaperDimOverlay,
    resolveWallpaperImageFilter,
    resolveWallpaperScrim,
} from "@mutualzz/ui-core";
import { useTheme } from "../useTheme";

interface CssBaselineProps {
    adaptiveScrollbar?: boolean;
}

export const CssBaseline = ({ adaptiveScrollbar }: CssBaselineProps) => {
    const { theme } = useTheme();
    const backgroundImageUrl = theme.backgroundImageUrl;
    const dim = backgroundImageUrl
        ? resolveWallpaperDimOverlay(theme)
        : null;
    const scrim = backgroundImageUrl ? resolveWallpaperScrim(theme) : null;
    const imageFilter = backgroundImageUrl
        ? resolveWallpaperImageFilter(theme)
        : null;

    const styles: CSSObject = {
        "*, *::before, *::after": {
            boxSizing: "border-box",
        },
        html: {
            width: "100%",
            height: "100%",
            background: theme.colors.background,
        },

        body: {
            margin: 0,
            padding: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            position: "relative",
            isolation: "isolate",

            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.levels["body-md"].fontSize,
            lineHeight: theme.typography.levels["body-md"].lineHeight,
            background: "transparent",
            color: theme.typography.colors.primary,
        },

        "#app": {
            position: "relative",
            zIndex: 0,
            height: "100%",
        },

        pre: {
            margin: 0,
            padding: 0,
        },

        "img, video": {
            maxWidth: "100%",
            height: "auto",
            display: "block",
        },

        svg: {
            flexShrink: 0,
        },

        a: {
            textDecoration: "none",
            color: "inherit",
        },

        "button, input, textarea, select": {
            fontFamily: "inherit",
        },
    };

    if (backgroundImageUrl && dim && scrim && imageFilter) {
        styles["body::before"] = {
            content: '""',
            position: "fixed",
            inset: 0,
            zIndex: -2,
            pointerEvents: "none",
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            filter: imageFilter,
        };
        styles["body::after"] = {
            content: '""',
            position: "fixed",
            inset: 0,
            zIndex: -1,
            pointerEvents: "none",
            backgroundImage: `linear-gradient(${dim}, ${dim}), linear-gradient(${scrim}, ${scrim})`,
        };
    }

    if (adaptiveScrollbar) {
        styles["*"] = {
            scrollbarWidth: "thin",
            scrollbarColor: `${theme.colors.primary} transparent`,
        };
        styles["::-webkit-scrollbar"] = {
            width: 8,
            height: 8,
        };
        styles["::-webkit-scrollbar-thumb"] = {
            background: theme.colors.neutral,
            borderRadius: 4,
        };
        styles["::-webkit-scrollbar-track"] = {
            background: theme.colors.primary,
        };
        styles["::-webkit-scrollbar-thumb:hover"] = {
            background: formatColor(theme.colors.neutral, {
                lighten: 20,
                format: "hexa",
            }),
        };
    }

    return <Global styles={styles} />;
};

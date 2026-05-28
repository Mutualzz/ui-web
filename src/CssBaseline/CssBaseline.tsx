import { Global } from "@emotion/react";
import { formatColor } from "@mutualzz/ui-core";
import { useTheme } from "../useTheme";

interface CssBaselineProps {
    adaptiveScrollbar?: boolean;
}

export const CssBaseline = ({ adaptiveScrollbar }: CssBaselineProps) => {
    const { theme } = useTheme();

    const toastBackground = theme.colors.surface;
    const toastText = theme.typography.colors.primary;
    const toastBorder = formatColor(theme.colors.neutral, {
        lighten: 35,
        format: "hexa",
    });

    return (
        <Global
            styles={{
                "*, *::before, *::after": {
                    boxSizing: "border-box",
                },
                "html, body": {
                    margin: 0,
                    padding: 0,

                    fontFamily: theme.typography.fontFamily,
                    fontSize: theme.typography.levels["body-md"].fontSize,
                    lineHeight: theme.typography.levels["body-md"].lineHeight,
                    background: theme.colors.background,
                    color: theme.typography.colors.primary,
                },

                pre: {
                    margin: 0,
                    padding: 0,
                },

                "img, video, svg": {
                    maxWidth: "100%",
                    height: "auto",
                    display: "block",
                },

                a: {
                    textDecoration: "none",
                    color: "inherit",
                },

                "button, input, textarea, select": {
                    fontFamily: "inherit",
                },

                /* Toastify theme adaptation */
                ".Toastify__toast-container": {
                    zIndex: 9999,
                },

                ".Toastify__toast": {
                    borderRadius: 12,
                    boxShadow: `0 10px 30px ${formatColor(
                        theme.colors.primary,
                        {
                            darken: 70,
                            format: "hexa",
                        },
                    )}`,
                    border: `1px solid ${toastBorder}`,
                    fontFamily: theme.typography.fontFamily,
                    color: toastText,
                    overflow: "hidden",
                },

                ".Toastify__toast-theme--dark": {
                    background: toastBackground,
                    color: toastText,
                },

                ".Toastify__toast-theme--light": {
                    background: toastBackground,
                    color: toastText,
                },

                ".Toastify__toast-theme--colored.Toastify__toast--default": {
                    background: toastBackground,
                    color: toastText,
                },

                ".Toastify__toast-theme--colored.Toastify__toast--info": {
                    background: theme.colors.primary,
                    color: theme.typography.colors.primary,
                },

                ".Toastify__toast-theme--colored.Toastify__toast--success": {
                    background: theme.colors.success,
                    color: theme.typography.colors.primary,
                },

                ".Toastify__toast-theme--colored.Toastify__toast--warning": {
                    background: theme.colors.warning,
                    color: theme.typography.colors.primary,
                },

                ".Toastify__toast-theme--colored.Toastify__toast--error": {
                    background: theme.colors.danger,
                    color: theme.typography.colors.primary,
                },

                ".Toastify__toast-icon": {
                    marginInlineEnd: 10,
                },

                ".Toastify__progress-bar": {
                    height: 3,
                },

                ".Toastify__progress-bar-theme--light": {
                    background: theme.colors.primary,
                },

                ".Toastify__progress-bar-theme--dark": {
                    background: theme.colors.primary,
                },

                ".Toastify__progress-bar-theme--colored.Toastify__progress-bar--info, .Toastify__progress-bar-theme--colored.Toastify__progress-bar--success, .Toastify__progress-bar-theme--colored.Toastify__progress-bar--warning, .Toastify__progress-bar-theme--colored.Toastify__progress-bar--error":
                    {
                        background: theme.colors.primary,
                    },

                ".Toastify__close-button": {
                    color: toastText,
                    opacity: 0.75,
                },

                ".Toastify__close-button--default": {
                    color: toastText,
                },

                ".Toastify__close-button > svg": {
                    fill: "currentColor",
                },

                ".Toastify__close-button:hover, .Toastify__close-button:focus":
                    {
                        opacity: 1,
                    },

                ...(adaptiveScrollbar && {
                    "*": {
                        scrollbarWidth: "thin",
                        scrollbarColor: `${theme.colors.primary} transparent`,
                    },
                    "::-webkit-scrollbar": {
                        width: 8,
                        height: 8,
                    },
                    "::-webkit-scrollbar-thumb": {
                        background: theme.colors.neutral,
                        borderRadius: 4,
                    },
                    "::-webkit-scrollbar-track": {
                        background: theme.colors.primary,
                    },
                    "::-webkit-scrollbar-thumb:hover": {
                        background: formatColor(theme.colors.neutral, {
                            lighten: 20,
                            format: "hexa",
                        }),
                    },
                }),
            }}
        />
    );
};

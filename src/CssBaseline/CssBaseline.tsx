import { Global } from "@emotion/react";
import { formatColor } from "@mutualzz/ui-core";
import { useTheme } from "../useTheme";

interface CssBaselineProps {
    adaptiveScrollbar?: boolean;
}

export const CssBaseline = ({ adaptiveScrollbar }: CssBaselineProps) => {
    const { theme } = useTheme();

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

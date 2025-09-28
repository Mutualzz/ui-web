import { Global } from "@emotion/react";
import { isValidGradient, lighten, useTheme } from "@mutualzz/ui-core";

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
                        scrollbarWidth: "auto",
                        scrollbarColor: `${theme.colors.primary} ${isValidGradient(theme.colors.surface) ? theme.colors.primary : theme.colors.surface}`,
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
                        background: lighten(theme.colors.neutral, 0.2),
                    },
                }),
            }}
        />
    );
};

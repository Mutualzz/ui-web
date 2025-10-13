import {
    ThemeProvider as EmotionThemeProvder,
    type Theme,
} from "@emotion/react";
import type { ThemeStyle, ThemeType } from "@mutualzz/ui-core";
import {
    baseDarkTheme,
    baseLightTheme,
    themes as baseThemes,
} from "@mutualzz/ui-core";
import {
    createContext,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState,
    type PropsWithChildren,
} from "react";

export const ThemeContext = createContext({
    theme: baseThemes.find((theme) => theme.id === "baseDark") ?? baseThemes[0],
    changeTheme: (_theme: Theme) => {
        return;
    },
    type: "system" as ThemeType,
    changeType: (_type: ThemeType) => {
        return;
    },
    style: "normal" as ThemeStyle,
    changeStyle: (_style: ThemeStyle) => {
        return;
    },
});

export interface ThemeProviderRef {
    changeTheme: (theme: Theme) => void;
    changeType: (type: ThemeType) => void;
    changeStyle: (style: ThemeStyle) => void;
}

const ThemeProvider = forwardRef<
    ThemeProviderRef,
    PropsWithChildren & {
        onThemeChange?: (theme: Theme) => void;
        onTypeChange?: (type: ThemeType) => void;
        onStyleChange?: (style: ThemeStyle) => void;
        disableDefaultThemeOnTypeChange?: boolean;
        disableDefaultThemeOnStyleChange?: boolean;
    }
>(
    (
        {
            children,
            onThemeChange,
            onTypeChange,
            onStyleChange,
            disableDefaultThemeOnTypeChange = false,
            disableDefaultThemeOnStyleChange = false,
        },
        ref,
    ) => {
        const [theme, setTheme] = useState<Theme | null>(null);
        const [type, setType] = useState<ThemeType>("system");
        const [style, setStyle] = useState<ThemeStyle>("normal");
        const [prefersDark, setPrefersDark] = useState<boolean | null>(null);
        const [mounted, setMounted] = useState(false);

        useEffect(() => {
            setMounted(true);
            if (typeof window === "undefined") return;

            const mediaQuery = window.matchMedia(
                "(prefers-color-scheme: dark)",
            );
            const updatePrefersDark = () => {
                const isDark = mediaQuery.matches;
                setPrefersDark(isDark);
                if (type === "system") {
                    setTheme(isDark ? baseDarkTheme : baseLightTheme);
                }
            };

            updatePrefersDark(); // initialize on mount
            mediaQuery.addEventListener("change", updatePrefersDark);
            return () =>
                mediaQuery.removeEventListener("change", updatePrefersDark);
        }, [type]);

        const changeType = (type: ThemeType) => {
            setType(type);

            if (!disableDefaultThemeOnTypeChange) {
                if (type === "system" && prefersDark !== null)
                    setTheme(prefersDark ? baseDarkTheme : baseLightTheme);
                else if (type === "dark") setTheme(baseDarkTheme);
                else setTheme(baseLightTheme);
                setStyle("normal");
            }

            onTypeChange?.(type);
            onStyleChange?.("normal");
        };

        const changeTheme = (theme: Theme) => {
            setTheme(theme);
            setStyle(theme.style);

            onThemeChange?.(theme);
            onStyleChange?.(theme.style);
        };

        const changeStyle = (style: ThemeStyle) => {
            if (!disableDefaultThemeOnStyleChange && style === "normal") {
                if (type === "system" && prefersDark !== null)
                    setTheme(prefersDark ? baseDarkTheme : baseLightTheme);
                else if (type === "dark") setTheme(baseDarkTheme);
                else setTheme(baseLightTheme);
            }

            setStyle(style);
            onStyleChange?.(style);
        };

        useImperativeHandle(ref, () => ({
            changeTheme,
            changeType,
            changeStyle,
        }));

        const themeObject =
            theme ??
            (prefersDark != null
                ? prefersDark
                    ? baseDarkTheme
                    : baseLightTheme
                : baseDarkTheme);

        const value = useMemo(
            () => ({
                theme: themeObject,
                changeTheme,
                type,
                changeType,
                style,
                changeStyle,
            }),
            [type, style, themeObject],
        );

        if (!mounted) return null;

        return (
            <ThemeContext.Provider value={value}>
                <EmotionThemeProvder theme={themeObject}>
                    {children}
                </EmotionThemeProvder>
            </ThemeContext.Provider>
        );
    },
);

ThemeProvider.displayName = "ThemeProvider";

export { ThemeProvider };

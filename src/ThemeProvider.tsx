import {
    ThemeProvider as EmotionThemeProvder,
    Global,
    type Theme,
} from "@emotion/react";
import type { ThemeType } from "@mutualzz/ui-core";
import {
    baseDarkTheme,
    baseLightTheme,
    themeToCssVars,
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
    theme: baseDarkTheme,
    changeTheme: (_theme: Theme | null) => {
        return;
    },
    type: null as ThemeType | null,
});

const getSystemTheme = () => {
    if (typeof window === "undefined") return baseDarkTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? baseDarkTheme
        : baseLightTheme;
};

export interface ThemeProviderRef {
    theme: Theme;
    type: ThemeType | null;
    changeTheme: (theme: Theme | null) => void;
}

const ThemeProvider = forwardRef<
    ThemeProviderRef,
    PropsWithChildren & {
        onThemeChange?: (theme: Theme, type: ThemeType | null) => void;
    }
>(({ children, onThemeChange }, ref) => {
    const [type, setType] = useState<ThemeType | null>(null);

    const [theme, setTheme] = useState<Theme>(getSystemTheme);

    useEffect(() => {
        if (typeof window === "undefined" || type) return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const followSystemTheme = () => setTheme(getSystemTheme());

        mediaQuery.addEventListener("change", followSystemTheme);
        return () =>
            mediaQuery.removeEventListener("change", followSystemTheme);
    }, [type]);

    const changeTheme = (newTheme: Theme | null) => {
        if (!newTheme) {
            const preferredTheme = getSystemTheme();
            setTheme(preferredTheme);
            setType(null);
            onThemeChange?.(preferredTheme, null);
            return;
        }

        setTheme(newTheme);
        setType(newTheme.type);

        onThemeChange?.(newTheme, newTheme.type);
    };

    useImperativeHandle(ref, () => ({
        theme,
        type,
        changeTheme,
    }));

    const value = useMemo(
        () => ({
            theme,
            changeTheme,
            type,
        }),
        [type, theme],
    );

    const cssVars = useMemo(
        () => ({
            ":root": themeToCssVars(theme),
        }),
        [theme],
    );

    return (
        <ThemeContext.Provider value={value}>
            <EmotionThemeProvder theme={theme}>
                <Global styles={cssVars} />
                {children}
            </EmotionThemeProvder>
        </ThemeContext.Provider>
    );
});

export { ThemeProvider };

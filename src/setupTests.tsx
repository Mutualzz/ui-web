import { afterEach } from "@jest/globals";
import type * as DOMTestingLibrary from "@testing-library/dom";
import "@testing-library/jest-dom";
import {
    cleanup,
    render,
    type RenderOptions,
    type RenderResult,
} from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { CssBaseline } from "./CssBaseline/CssBaseline";
import { ThemeProvider } from "./ThemeProvider";

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

afterEach(() => {
    cleanup();
});

const AllTheProviders = ({ children }: { children: ReactNode }) => {
    return (
        <ThemeProvider>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, "wrapper">,
): RenderResult<typeof DOMTestingLibrary.queries, HTMLElement, HTMLElement> =>
    render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };

import { createContext, type ReactNode, useContext, useMemo } from "react";

export interface UiLabels {
    closeModal: string;
    increment: string;
    decrement: string;
    showPassword: string;
    selectPlaceholder: string;
}

export const defaultUiLabels: UiLabels = {
    closeModal: "Close modal",
    increment: "Increment",
    decrement: "Decrement",
    showPassword: "Show password",
    selectPlaceholder: "Select an option",
};

const UiLabelsContext = createContext<UiLabels>(defaultUiLabels);

export const UiLabelsProvider = ({
    labels,
    children,
}: {
    labels: Partial<UiLabels>;
    children: ReactNode;
}) => {
    const mergedLabels = useMemo(
        () => ({ ...defaultUiLabels, ...labels }),
        [labels],
    );

    return (
        <UiLabelsContext.Provider value={mergedLabels}>
            {children}
        </UiLabelsContext.Provider>
    );
};

export const useUiLabels = () => useContext(UiLabelsContext);

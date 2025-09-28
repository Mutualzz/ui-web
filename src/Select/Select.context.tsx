import type {
    Color,
    ColorLike,
    Responsive,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import { createContext } from "react";
import type { SelectProps } from "./Select.types";

export interface SelectContextValue {
    value: SelectProps["value"];
    multiple?: boolean;
    onSelect: (value: string | number) => void;
    color?: Responsive<Color | ColorLike>;
    variant?: Responsive<Variant>;
    size?: Responsive<Size | SizeValue | number>;
    disabled?: boolean;
}

export const SelectContext = createContext<SelectContextValue | null>(null);

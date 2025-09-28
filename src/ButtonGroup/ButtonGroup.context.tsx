import type {
    Color,
    ColorLike,
    Responsive,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import { createContext } from "react";

export interface ButtonGroupContextProps {
    color?: Responsive<Color | ColorLike>;
    variant?: Responsive<Variant>;
    size?: Responsive<Size | SizeValue | number>;
    disabled?: boolean;
    loading?: boolean;
}

export const ButtonGroupContext = createContext<ButtonGroupContextProps | null>(
    null,
);

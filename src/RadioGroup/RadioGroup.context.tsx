import type {
    Color,
    ColorLike,
    Orientation,
    Responsive,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import { createContext, type ChangeEvent } from "react";

export interface RadioGroupContextType {
    color?: Responsive<Color | ColorLike>;
    variant?: Responsive<Variant>;
    size?: Responsive<Size | SizeValue | number>;
    orientation?: Responsive<Orientation>;
    name?: string;
    value?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>, value: string) => void;
    disabled?: boolean;
}

export const RadioGroupContext = createContext<RadioGroupContextType | null>(
    null,
);

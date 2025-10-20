import type {
    Color,
    ColorLike,
    Responsive,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type {
    HorizontalButtonAlign,
    VerticalButtonAlign,
} from "../Button/Button.types";

import { createContext } from "react";

export interface ButtonGroupContextProps {
    color?: Responsive<Color | ColorLike>;
    variant?: Responsive<Variant>;
    size?: Responsive<Size | SizeValue | number>;
    verticalAlign?: Responsive<VerticalButtonAlign>;
    horizontalAlign?: Responsive<HorizontalButtonAlign>;
    disabled?: boolean;
    loading?: boolean;
}

export const ButtonGroupContext = createContext<ButtonGroupContextProps | null>(
    null,
);

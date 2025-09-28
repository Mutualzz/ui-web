import type {
    Color,
    ColorLike,
    Orientation,
    Responsive,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import { createContext } from "react";

interface ListContextType {
    color?: Responsive<Color | ColorLike>;
    size?: Responsive<Size | SizeValue | number>;
    variant?: Responsive<Variant>;
    orientation?: Responsive<Orientation>;

    nesting?: number;
    marker?: string | string[] | ((nesting: number) => string);
}

export const ListContext = createContext<ListContextType>({
    color: "neutral",
    variant: "plain",
    size: "md",
    nesting: 0,
    marker: undefined,
});

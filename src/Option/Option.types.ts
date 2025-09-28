import type {
    Color,
    ColorLike,
    Responsive,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { HTMLAttributes, ReactNode } from "react";

export interface OptionProps
    extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
    value: string | number;

    disabled?: boolean;
    selected?: boolean;
    children?: ReactNode;
    color?: Responsive<Color | ColorLike>;
    variant?: Responsive<Variant>;
    size?: Responsive<Size | SizeValue | number>;

    // For keyboard accessibility
    label?: string;
}

import type {
    Color,
    ColorLike,
    Responsive,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { HTMLAttributes, ReactNode } from "react";

export interface SelectProps<T = string | number> extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "color" | "defaultValue" | "onChange" | "placeholder"
> {
    size?: Responsive<Size | SizeValue | number>;
    variant?: Responsive<Variant>;
    color?: Responsive<Color | ColorLike>;

    startDecorator?: ReactNode;
    endDecorator?: ReactNode;

    placeholder?: string;

    multiple?: boolean;
    disabled?: boolean;
    required?: boolean;
    autoFocus?: boolean;

    name?: string;

    value?: T | T[];
    defaultValue?: T | T[];

    onValueChange?: (value: T | T[]) => void;

    closeOnClickOutside?: boolean;
}

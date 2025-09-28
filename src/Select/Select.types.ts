import type {
    Color,
    ColorLike,
    Responsive,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { ReactNode, SelectHTMLAttributes } from "react";

export interface SelectProps<T = string | number>
    extends Omit<
        SelectHTMLAttributes<HTMLSelectElement>,
        "size" | "value" | "defaultValue" | "color"
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

    value?: T | T[];
    defaultValue?: T | T[];

    onValueChange?: (value: T | T[]) => void;

    closeOnClickOutside?: boolean;
}

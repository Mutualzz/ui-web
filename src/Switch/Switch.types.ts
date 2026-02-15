import type { InputHTMLAttributes, ReactNode } from "react";
import type {
    Color,
    Responsive,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { ColorLike } from "color";

export interface SwitchProps extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "color"
> {
    color?: Responsive<Color | ColorLike>;
    variant?: Responsive<Variant>;
    size?: Responsive<Size | SizeValue | number>;

    label?: ReactNode;
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;

    startDecorator?: ReactNode;
    endDecorator?: ReactNode;
}

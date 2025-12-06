import type { Responsive, Size, SizeValue } from "@mutualzz/ui-core";
import type { InputHTMLAttributes } from "react";

export interface InputBaseProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        "onChange" | "size" | "type" | "color"
    > {
    /**
     * The size of the input element.
     * Can be a predefined size ("sm", "md", "lg") or a custom size in pixels.
     * If a number is provided, it will be used as the font size.
     *
     * @default "md"
     * @min 6
     * @max 32
     * @example "sm", "md", "lg", 16
     */
    size?: Responsive<Size | SizeValue | number>;

    /**
     * If true, the input will take the full width of its container.
     * @default false
     */
    fullWidth?: boolean;
}

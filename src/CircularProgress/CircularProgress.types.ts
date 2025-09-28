import {
    type Color,
    type ColorLike,
    type Responsive,
    type Size,
    type SizeValue,
    type Variant,
} from "@mutualzz/ui-core";
import type { ReactNode } from "react";

export interface CircularProgressProps {
    /**
     * The size of the circular progress component.
     * Can be a predefined size or a custom size in pixels.
     *
     * @default "md"
     * @example "sm", "md", "lg", 36
     */
    size?: Responsive<Size | SizeValue | number>;
    /**
     * The color of the circular progress component.
     * Can be a predefined color or a custom color.
     *
     * @default "primary"
     * @example "primary", "neutral", "success", "info", "warning", "danger", "#ff5733"
     */
    color?: Responsive<Color | ColorLike>;
    /**
     * The variant of the circular progress component.
     * Determines the style of the progress indicator.
     *
     * @default "soft"
     * @example "solid", "outlined", "soft", "plain"
     */
    variant?: Responsive<Variant>;
    /**
     * Indicates whether the circular progress is in a determinate state.
     * If true, the progress will be based on the `value` prop.
     *
     * @default false
     */
    determinate?: boolean;
    /**
     * The current value of the progress indicator when in determinate mode.
     * Should be a number between 0 and 100.
     *
     * @default 0
     */
    value?: number;

    /**
     * Manually set stroke width, if you don't want automatic one
     *
     */
    strokeWidth?: Responsive<Size | SizeValue | number>;

    /**
     * Optional children to render inside the circular progress component.
     * This can be used to display additional content, such as text or icons.
     * If provided, the circular progress will adjust its size to accommodate the content.
     */
    children?: ReactNode;
}

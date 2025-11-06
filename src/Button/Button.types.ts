import {
    type Color,
    type ColorLike,
    type Responsive,
    type Size,
    type SizeValue,
    type Variant,
} from "@mutualzz/ui-core";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

export type VerticalButtonAlign = "top" | "center" | "bottom";
export type HorizontalButtonAlign = "left" | "center" | "right";

export interface ButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color" | "size"> {
    /**
     * The variant of the button, which determines its style.
     * @default "solid"
     * @example "solid", "outlined", "soft", "plain"
     */
    variant?: Responsive<Variant>;
    /**
     * The color of the button, which can be a predefined color or a custom color.
     * @default "primary"
     * @example "primary", "neutral", "success", "info", "warning", "danger", "#ff5733"
     */
    color?: Responsive<Color | ColorLike>;
    /**
     * The size of the button, which can be a predefined size or a custom size in pixels.
     * @default "md"
     * @example "sm", "md", "lg", 20
     */
    size?: Responsive<Size | SizeValue | number>;

    verticalAlign?: Responsive<VerticalButtonAlign>;
    horizontalAlign?: Responsive<HorizontalButtonAlign>;

    /**
     * Indicates whether the button is in a loading state.
     * If true, the button will show a loading indicator and be disabled.
     * @default false
     */
    loading?: boolean;
    /**
     * Custom loading indicator to display when the button is in a loading state.
     * If not provided, a default loading spinner will be shown.
     */
    loadingIndicator?: ReactNode;

    /**
     * Content to display at the start of the button (e.g., an icon).
     */
    startDecorator?: ReactNode;
    /**
     * Content to display at the end of the button (e.g., an icon).
     */
    endDecorator?: ReactNode;

    /**
     * Content to display inside the button.
     */
    children?: ReactNode;

    /**
     * If true, the button will have no padding.
     * @default false
     */
    padding?: Size | SizeValue | number;
}

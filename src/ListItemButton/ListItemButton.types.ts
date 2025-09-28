import type {
    Color,
    ColorLike,
    Responsive,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ListItemButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size" | "color"> {
    /**
     * The variant of the button, which determines its style.
     *
     * @default "solid"
     * @example "solid", "outlined", "soft", "plain"
     */
    variant?: Responsive<Variant>;
    /**
     * The color of the button, which can be a predefined color or a custom color.
     *
     * @default "primary"
     * @example "primary", "neutral", "success", "info", "warning", "danger", "#ff5733"
     */
    color?: Responsive<Color | ColorLike>;
    /**
     * The size of the button, which can be a predefined size or a custom size in pixels.
     *
     * @default "md"
     * @min 24
     * @max 72
     * @example "sm", "md", "lg", 32
     */
    size?: Responsive<Size | SizeValue | number>;

    /**
     * Indicates whether the button is in a loading state.
     * If true, the button will show a loading indicator and be disabled.
     *
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
}

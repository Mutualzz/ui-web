import {
    type Color,
    type ColorLike,
    type Responsive,
    type Size,
    type SizeValue,
    type Variant,
} from "@mutualzz/ui-core";
import { type ReactNode } from "react";
import type { ButtonProps } from "../Button/Button.types";

export interface IconButtonProps extends Omit<
    ButtonProps,
    | "verticalAlign"
    | "horizontalAlign"
    | "fullWidth"
    | "startDecorator"
    | "endDecorator"
> {
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
     * Content to display inside the button.
     */
    children?: ReactNode;
}

import {
    type Color,
    type ColorLike,
    type Size,
    type SizeValue,
    type TypographyColor,
    type TypographyLevel,
} from "@mutualzz/ui-core";
import type { HTMLAttributes, ReactNode } from "react";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerInset = "none" | "half-start" | "half-end" | "start" | "end";

export type DividerVariant = "solid" | "dashed" | "dotted" | "double";

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
    /**
     * The orientation of the divider.
     *
     * @default "horizontal"
     * @example "horizontal", "vertical"
     */
    orientation?: DividerOrientation;
    /**
     * The inset of the divider.
     * Determines how the divider is positioned relative to its container.
     *
     * @default "none"
     * @example "none", "start", "end"
     */
    inset?: DividerInset;

    /**
     * The color of the divider line.
     * Can be a predefined color or a custom color.
     *
     * @default "neutral"
     * @example "primary", "neutral", "secondary", "accent", "disabled", "success", "info", "warning", "danger", "#ff5733"
     */
    lineColor?: Color | ColorLike | TypographyColor;
    /**
     * The color of the divider text.
     * Can be a predefined color or a custom color.
     *
     * @default "neutral"
     * @example "primary", "neutral", "secondary", "accent", "disabled", "success", "info", "warning", "danger", "#ff5733"
     */
    textColor?: Color | ColorLike | TypographyColor;
    /**
     * The variant of the divider.
     * Determines the style of the divider line.
     *
     * @default "solid"
     * @example "solid", "dashed", "dotted", "double"
     */
    variant?: DividerVariant;

    /**
     * The padding around the divider text.
     * Can be a predefined size, a custom size value, or a number representing pixels.
     *
     * @example "sm", "md", "lg", 8, 16
     * @default 0
     */
    textPadding?: Size | SizeValue | number;

    textLevel?: TypographyLevel | "inherit";

    /**
     * Optional children to render inside the divider.
     * This can be used to display text or other content in the divider.
     */
    children?: ReactNode;
}

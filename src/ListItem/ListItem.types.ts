import type {
    Color,
    ColorLike,
    Responsive,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { HTMLAttributes, ReactNode } from "react";

export interface ListItemProps
    extends Omit<HTMLAttributes<HTMLLIElement>, "color"> {
    /**
     * Color of the list item
     * Can be a predefined color or a custom color.
     *
     * @default "neutral"
     * @example "primary", "neutral", "success", "info", "warning", "danger", "#ff5733"
     */
    color?: Responsive<Color | ColorLike>;

    /**
     * Variant of the list item
     *
     * @default "plain"
     * @example "solid", "outlined", "plain", "soft"
     */
    variant?: Responsive<Variant>;

    /**
     * Size of the list item
     *
     * @default "md"
     * @min 24
     * @max 72
     * @example "sm", "md", "lg", 32
     */
    size?: Responsive<Size | SizeValue | number>;

    /**
     * The start decorator of the list item.
     * This can be an icon, text, or any ReactNode.
     */
    startDecorator?: ReactNode;

    /**
     * The end decorator of the list item.
     * This can be an icon, text, or any ReactNode.
     */
    endDecorator?: ReactNode;

    /**
     * Marker to use for the list item.
     * can be anything from "disc", "circle", "square" to custom markers like "•", "◦", etc.
     *
     * @example "disc", "circle", "square", "•", "◦"
     */
    marker?: string;
}

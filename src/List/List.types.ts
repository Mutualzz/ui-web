import type {
    allowedListStyleTypes,
    Color,
    ColorLike,
    Orientation,
    Responsive,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { HTMLProps } from "react";

export type AllowedListStyleTypes = (typeof allowedListStyleTypes)[number];

export interface ListProps
    extends Omit<HTMLProps<HTMLUListElement>, "size" | "wrap" | "color"> {
    /**
     * Color of the list
     * Can be a predefined color or a custom color.
     *
     * @default "neutral"
     * @example "primary", "neutral", "success", "info", "warning", "danger", "#ff5733"
     */
    color?: Responsive<Color | ColorLike>;

    /**
     * Variant of the lists
     *
     * @default "plain"
     * @example "solid", "outlined", "plain", "soft"
     */
    variant?: Responsive<Variant>;

    /**
     * Size of the list
     *
     * @default "md"
     * @min 24
     * @max 72
     * @example "sm", "md", "lg", 32
     */
    size?: Responsive<Size | SizeValue | number>;

    /**
     * Marker to use for the list items.
     * can be anything from "disc", "circle", "square" to custom markers like "•", "◦", etc.
     *
     * @example "disc", "circle", "square", "•", "◦"
     */
    marker?: string | string[] | ((nesting: number) => string);

    /**
     * Orientation of the lists
     *
     * @default "vertical"
     * @example "vertical", "horizontal"
     */
    orientation?: Responsive<Orientation>;
}

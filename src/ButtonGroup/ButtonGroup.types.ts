import type {
    Color,
    ColorLike,
    Orientation,
    Responsive,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { ReactNode } from "react";
import type {
    HorizontalButtonAlign,
    VerticalButtonAlign,
} from "../Button/Button.types";

export interface ButtonGroupProps {
    /**
     * The color of the button group, which can be a predefined color or a custom color.
     * If not provided, the buttons will use their assigned colors.
     *
     * @example "primary", "neutral", "success", "info", "warning", "danger", "#ff5733"
     */
    color?: Responsive<Color | ColorLike>;
    /**
     * The variant of the button group, which determines the style of the buttons.
     * If not provided, the buttons will use their assigned variants.
     *
     * @example "solid", "outlined", "soft", "plain"
     */
    variant?: Responsive<Variant>;
    /**
     * The size of the buttons in the group, which can be a predefined size or a custom size in pixels.
     * If not provided, the buttons will use their assigned sizes.
     *
     * @example "sm", "md", "lg", 20
     */
    size?: Responsive<Size | SizeValue | number>;

    verticalAlign?: Responsive<VerticalButtonAlign>;
    horizontalAlign?: Responsive<HorizontalButtonAlign>;

    /**
     * Indicates whether all buttons in the group should be disabled.
     * If true, all buttons will be disabled.
     * If not provided, the buttons will use their individual disabled states.
     */
    disabled?: boolean;

    /**
     * The orientation of the button group, either "horizontal" or "vertical".
     *
     * @default "horizontal"
     */
    orientation?: Responsive<Orientation>;

    /**
     * The loading state of the button group.
     * If true, all buttons in the group will show a loading indicator and be disabled.
     */
    loading?: boolean;

    /**
     * The separator color for the button group.
     * This can be a predefined color or a custom color.
     * If not provided, the default color will be used."
     * @example "primary", "neutral", "success", "info", "warning", "danger", "#ff5733"
     */
    separatorColor?: Responsive<Color | ColorLike>;

    /**
     * The spacing between buttons in the group, in pixels.
     * If not provided, the default spacing will be used.
     * @default 0
     */
    spacing?: Responsive<Size | SizeValue | number>;

    /**
     * The children of the button group, which should be Button components.
     */
    children: ReactNode;
}

import type {
    Color,
    ColorLike,
    Responsive,
    Shape,
    Size,
    SizeValue,
    TypographyColor,
    Variant,
} from "@mutualzz/ui-core";
import type { ReactNode, TextareaHTMLAttributes } from "react";

export interface TextareaProps extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "color"
> {
    /**
     * Color or color-like value for the textarea.
     * This can be a color name, hex code, or any valid color format.
     *
     * @default "neutral"
     * @example "primary", "neutral", "success", "info", "warning", "danger", "#ff5733"
     */
    color?: Responsive<Color | ColorLike>;
    /**
     * Text color for the textarea.
     * This can be a color name, hex code
     * If set to "inherit", it will inherit the color from the parent element.
     *
     * @default "inherit"
     * @example "primary", "secondary", "accent", "disabled"
     */
    textColor?: Responsive<TypographyColor | ColorLike | "inherit">;
    /**
     * Variant of the textarea.
     * This can be "outlined", "solid", "soft", or "plain".
     * It determines the visual style of the textarea.
     *
     * @default "outlined"
     * @example "outlined", "solid", "soft", "plain"
     */
    variant?: Responsive<Variant>;
    /**
     * Size of the textarea.
     * This can be a predefined size like "sm", "md", "lg", or a custom number.
     * It determines the font size and line height of the textarea.
     *
     * @default "md"
     * @min 6
     * @max 24
     * @example "sm", "md", "lg", 14
     */
    size?: Responsive<Size | SizeValue | number>;

    /**
     * Whether the textarea is disabled.
     * If true, the textarea will be unresponsive to user interactions.
     */
    disabled?: boolean;

    /**
     * The value of the textarea.
     * This is a controlled component, so the value should be managed by the parent component.
     */
    value?: string;

    /**
     * Resizable property.
     * If true, the textarea can be resized by the user.
     * If false, the textarea will have a fixed size.
     * @default false
     */
    resizable?: boolean;

    /**
     * Left decorator.
     * This can be any valid React node, such as an icon or text.
     * It will be displayed at the start of the textarea.
     * This is useful for adding icons or labels to the textarea.
     */
    startDecorator?: ReactNode;
    /**
     * Right decorator.
     * This can be any valid React node, such as an icon or text.
     * It will be displayed at the end of the textarea.
     * This is useful for adding icons or labels to the textarea.
     */
    endDecorator?: ReactNode;

    /**
     * Error state.
     * If true, the textarea will be styled to indicate an error state.
     * This can be used to show validation errors or other issues.
     * @default false
     */
    error?: boolean;

    /**
     * Minimum number of rows for the textarea.
     * This can be used to set a lower limit on the height of the textarea.
     */
    minRows?: number;
    /**
     * Maximum number of rows for the textarea.
     * This can be used to set an upper limit on the height of the textarea.
     */
    maxRows?: number;

    shape?: Responsive<Shape | SizeValue | number>;
}

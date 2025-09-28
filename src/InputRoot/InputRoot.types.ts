import type {
    Color,
    ColorLike,
    Responsive,
    Size,
    SizeValue,
    TypographyColor,
    Variant,
} from "@mutualzz/ui-core";
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";

export type InputType =
    | "date"
    | "datetime-local"
    | "email"
    | "month"
    | "color"
    | "number"
    | "password"
    | "search"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week";

export type InputMode =
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search";

export interface InputRootProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        "onChange" | "size" | "type" | "color"
    > {
    /**
     * The color of the input element.
     * Can be a predefined color or a custom color.
     *
     * @default "neutral"
     * @example "primary", "neutral", "success", "info", "warning", "danger", "#ff5733"
     */
    color?: Responsive<Color | ColorLike>;
    /**
     * The text color of the input element.
     * If set to "inherit", the input will inherit the text color from its parent.
     *
     * @default "inherit"
     * @example "primary", "secondary", "accent", "disabled", "inherit"
     */
    textColor?: Responsive<TypographyColor | ColorLike | "inherit">;
    /**
     * The variant of the input element.
     * Determines the style of the input element.
     *
     * @default "outlined"
     * @example "outlined", "solid", "plain", "soft"
     */
    variant?: Responsive<Variant>;
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
     * Optional start decorator to render before the input element.
     * This can be used to display icons or additional content.
     */
    startDecorator?: ReactNode;
    /**
     * Optional end decorator to render after the input element.
     * This can be used to display icons or additional content.
     */
    endDecorator?: ReactNode;

    /**
     * If true, the input will take the full width of its container.
     * @default false
     */
    fullWidth?: boolean;
    /**
     * If true, the input will be displayed in an error state.
     * This can be used to indicate validation errors or issues with the input.
     * @default false
     */
    error?: boolean;

    /**
     * The type of the input element.
     * Determines the input behavior and validation.
     *
     * @default "text"
     * @example "date", "datetime-local", "color", "email", "month", "number", "password", "search", "tel", "text", "time", "url", "week".
     */
    type?: InputType;

    /**
     * The input mode for the input element.
     * Determines the virtual keyboard layout and behavior on mobile devices.
     *
     * @default "text"
     * @example "none", "text", "tel", "url", "email", "numeric", "decimal", "search"
     */
    inputMode?: InputMode;

    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

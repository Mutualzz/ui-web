import type {
    Color,
    ColorLike,
    Responsive,
    TypographyColor,
    Variant,
} from "@mutualzz/ui-core";
import type { InputBaseProps } from "InputBase/InputBase.props";
import type { ChangeEvent, ReactNode } from "react";

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

export interface InputRootProps extends InputBaseProps {
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

import type {
    Color,
    ColorLike,
    Responsive,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type {
    ChangeEvent,
    InputHTMLAttributes,
    MouseEvent,
    ReactNode,
    TouchEvent,
} from "react";

export interface SliderMark {
    /**
     * The value of the mark.
     * This should be a number that corresponds to the slider's value range.
     */
    value: number;
    /**
     * The label to display for the mark.
     * This can be a string or any valid React node.
     * If not provided, the mark will not display a label and will use the value as the label.
     */
    label?: ReactNode;
}

export type SliderOrientation = "horizontal" | "vertical";
export type SliderValueLabelDisplay = "off" | "on" | "auto";

export interface SliderProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        | "size"
        | "step"
        | "onChange"
        | "value"
        | "defaultValue"
        | "type"
        | "color"
    > {
    /**
     * Slider color or color-like value.
     * This can be a color name, hex code, or any valid color format.
     * It determines the color of the slider track and thumb.
     *
     * @default "primary"
     * @example "primary", "neutral", "success", "info", "warning", "danger", "#ff5733"
     */
    color?: Responsive<Color | ColorLike>;
    /**
     * Slider size.
     * This can be a predefined size like "sm", "md", "lg", or a custom number.
     * It determines the size of the slider thumb and track.
     *
     * @default "md"
     * @min 10
     * @max 28
     * @example "sm", "md", "lg", 20
     */
    size?: Responsive<Size | SizeValue | number>;
    /**
     * Slider variant.
     * This can be a predefined variant like "solid", "outlined", "soft" or "plain".
     * It determines the visual style of the slider.
     *
     * @default "solid"
     * @example "solid", "outlined", "soft", "plain"
     */
    variant?: Responsive<Variant>;

    /**
     * Whether the slider is disabled.
     * If true, the slider will be unresponsive to user interactions.
     */
    disabled?: boolean;

    /**
     * Slider orientation.
     * This can be "horizontal" or "vertical".
     * It determines the direction in which the slider is rendered.
     *
     * @default "horizontal"
     * @example "horizontal", "vertical"
     */
    orientation?: Responsive<SliderOrientation>;

    /**
     * Minimum value of the slider.
     * This should be a number that represents the lowest value the slider can take.
     *
     * @default 0
     */
    min?: number;
    /**
     * Maximum value of the slider.
     * This should be a number that represents the highest value the slider can take.
     *
     * @default 100
     */
    max?: number;
    /**
     * Step value of the slider.
     * This should be a number that represents the incremental step the slider takes.
     *
     * @default 1
     */
    step?: number | null;

    /**
     * The default value of the slider when it is uncontrolled.
     * This can be a single number for a single-value slider or an array of numbers for a range slider.
     * If not provided, the slider will start at the minimum value.
     */
    defaultValue?: number | number[];
    /**
     * The current value of the slider when it is controlled.
     * This can be a single number for a single-value slider or an array of numbers for a range slider.
     * If not provided, the slider will be uncontrolled.
     */
    value?: number | number[];

    /**
     * Whether to disable swapping of values in a range slider.
     * If true, the user will not be able to swap the values of the two thumbs.
     */
    disableSwap?: boolean;

    /**
     * Whether to show marks on the slider.
     * If true, marks will be displayed at the defined intervals.
     * If an array is provided, custom marks can be defined.
     */
    marks?: boolean | SliderMark[];

    /**
     * The value label display mode.
     * This can be "off", "on", or "auto".
     * - "off": No value labels are displayed.
     * - "on": Value labels are always displayed.
     * - "auto": Value labels are displayed only when the slider is focused or hovered.
     *
     * @default "off"
     * @example "off", "on", "auto"
     */
    valueLabelDisplay?: Responsive<SliderValueLabelDisplay>;
    /**
     * The format for displaying the value label.
     */
    valueLabelFormat?: string | ((value: number, index: number) => ReactNode);

    /**
     * onChange event handler.
     * This is called when the slider value changes.
     * It receives the event and the new value as parameters.
     * For a single-value slider, the value is a number.
     * For a range slider, the value is an array of two numbers.
     */
    onChange?: (
        event: ChangeEvent<HTMLInputElement>,
        value: number | number[],
    ) => void;

    /**
     * onChangeCommitted event handler.
     * This is called when the user stops dragging the slider thumb.
     * It receives the event and the final value as parameters.
     * For a single-value slider, the value is a number.
     * For a range slider, the value is an array of two numbers.
     * This is useful for committing the value to a state or performing side effects.
     */
    onChangeCommitted?: (
        event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
        value: number | number[],
    ) => void;

    /**
     * Aria label for the slider.
     * This is used for accessibility purposes to describe the slider to screen readers.
     * If not provided, the slider will not have an aria-label.
     */
    getAriaLabel?: (index: number) => string;
    /**
     * Aria value text function.
     * This function is used to provide a custom text description for the slider's value.
     * It receives the value and index as parameters and should return a string.
     * This is useful for accessibility purposes to describe the current value of the slider.
     * If not provided, the slider will not have an aria value text.
     */
    getAriaValueText?: (value: number, index: number) => string;
}

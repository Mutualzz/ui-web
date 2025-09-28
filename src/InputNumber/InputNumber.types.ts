import type { InputRootProps } from "../InputRoot/InputRoot.types";

export interface InputNumberProps
    extends Omit<InputRootProps, "inputMode" | "type" | "value"> {
    /**
     * The type of the input element.
     * Should always be "number" for number inputs.
     * @default "number"
     */
    type?: "number";
    /**
     * The input mode for the input element.
     * Determines the virtual keyboard layout and behavior on mobile devices.
     *
     * @default "decimal"
     * @example "decimal", "numeric"
     */
    inputMode?: "decimal" | "numeric";

    /**
     * The step value for the number input.
     * Determines the increment or decrement value when using the up/down arrows.
     * If not specified, the default step is 1.
     */
    step?: number;
    /**
     * The minimum value for the number input.
     * If the input value is less than this, it will be considered invalid.
     * If not specified, there is no minimum limit.
     */
    min?: number;
    /**
     * The maximum value for the number input.
     * If the input value exceeds this, it will be considered invalid.
     * If not specified, there is no maximum limit.
     */
    max?: number;

    /**
     * Optional start decorator to render before the input element.
     * This can be used to display icons or additional content.
     */
    value?: string;

    /**
     * Callback function to be called when the value is incremented.
     * This function can be used to handle custom logic when the value increases.
     */
    onIncrement?: () => void;
    /**
     * Callback function to be called when the value is decremented.
     * This function can be used to handle custom logic when the value decreases.
     */
    onDecrement?: () => void;
}

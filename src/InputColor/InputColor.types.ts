import type { ColorLike, ColorResult } from "@mutualzz/ui-core";
import type { InputRootProps } from "../InputRoot/InputRoot.types";

export interface InputColorProps
    extends Omit<
        InputRootProps,
        "onChange" | "type" | "value" | "defaultValue"
    > {
    /**
     * The type of the input element.
     *
     * @readonly
     * @default "color"
     */
    type?: "color";

    /**
     * Whether to show the color picker.
     * @default true
     */
    showColorPicker?: boolean;

    /**
     * Whether to show a random color button.
     * @default false
     */
    showRandom?: boolean;

    /**
     * Whether to allow gradient colors.
     * @default false
     */
    allowGradient?: boolean;

    /**
     * Whether to allow alpha channel in colors.
     * @default false
     */
    allowAlpha?: boolean;

    /**
     * The current color value.
     */
    value?: ColorLike;

    defaultValue?: ColorLike;

    onChange?: (color: ColorResult) => void;
}

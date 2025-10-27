import type { ColorLike } from "@mutualzz/ui-core";

export interface ColorPickerOnChangePayload {
    hex: string;
    rgb: { r: number; g: number; b: number; a: number };
    hsv: { h: number; s: number; v: number; a: number };
}

export type ColorPickerProps = {
    value?: ColorLike;
    defaultValue?: ColorLike;

    onChange?: (payload: ColorPickerOnChangePayload) => void;

    disabled?: boolean;

    allowAlpha?: boolean;
};

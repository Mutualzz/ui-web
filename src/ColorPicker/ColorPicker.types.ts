import type { CSSObject } from "@emotion/react";
import type { ColorLike, ColorResult, HsvaColor } from "@mutualzz/ui-core";

export interface ColorPickerProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "color"> {
    onChange?: (color: ColorResult) => void;

    onChangeGradient?: (results: ColorResult[]) => void;

    color?: ColorLike | HsvaColor;

    allowGradient?: boolean;
    allowAlpha?: boolean;

    css?: CSSObject;
}

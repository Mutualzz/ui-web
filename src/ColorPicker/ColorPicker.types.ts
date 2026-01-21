import type { CSSObject } from "@emotion/react";
import type { ColorLike, ColorResult, HsvaColor } from "@mutualzz/ui-core";

export interface ColorPickerProps extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "color"
> {
    color?: ColorLike | HsvaColor | (ColorLike | HsvaColor)[];

    onChange?: (color: ColorResult | ColorResult[], stop?: number) => void;
    currentStop?: number;
    onStopChange?: (stop: number) => void;

    rotation?: number;
    onRotationChange?: (rotation: number) => void;

    allowGradient?: boolean;
    allowAlpha?: boolean;

    css?: CSSObject;
}

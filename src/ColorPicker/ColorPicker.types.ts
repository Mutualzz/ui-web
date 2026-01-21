import type { CSSObject } from "@emotion/react";
import type { ColorLike, ColorResult, HsvaColor } from "@mutualzz/ui-core";
import type { HTMLAttributes } from "react";

export type GradientStop = HsvaColor & { position: number; id: string };

export interface ColorPickerProps extends Omit<
    HTMLAttributes<HTMLDivElement>,
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

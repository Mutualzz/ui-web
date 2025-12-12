import type {
    Color,
    ColorLike,
    Responsive,
    Size,
    SizeValue,
} from "@mutualzz/ui-core";
import type { ImgHTMLAttributes } from "react";
import type { PaperVariant } from "../Paper/Paper.types";

export type AvatarShape = "circle" | "square" | "rounded";

export interface AvatarProps extends Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    "color" | "size" | "variant"
> {
    color?: Responsive<Color | ColorLike>;
    variant?: Responsive<PaperVariant>;
    size?: Responsive<Size | SizeValue | number>;

    elevation?: Responsive<number>;

    shape?: Responsive<AvatarShape | SizeValue | number>;
}

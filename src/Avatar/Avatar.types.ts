import type {
    Color,
    ColorLike,
    Responsive,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { ImgHTMLAttributes } from "react";

export type AvatarShape = "circle" | "square" | "rounded";

export interface AvatarProps
    extends Omit<
        ImgHTMLAttributes<HTMLImageElement>,
        "color" | "size" | "variant"
    > {
    color?: Responsive<Color | ColorLike>;
    variant?: Responsive<Variant>;
    size?: Responsive<Size | SizeValue | number>;

    shape?: Responsive<AvatarShape | SizeValue | number>;
}

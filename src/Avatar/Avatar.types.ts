import type {
    Color,
    ColorLike,
    Responsive,
    Shape,
    Size,
    SizeValue,
} from "@mutualzz/ui-core";
import type { HTMLAttributes, ImgHTMLAttributes } from "react";
import type { PaperVariant } from "../Paper/Paper.types";

type AvatarImageProps = Pick<
    ImgHTMLAttributes<HTMLImageElement>,
    | "src"
    | "alt"
    | "loading"
    | "decoding"
    | "crossOrigin"
    | "referrerPolicy"
    | "srcSet"
    | "sizes"
    | "onLoad"
    | "onError"
>;

export interface AvatarProps
    extends
        Omit<HTMLAttributes<HTMLDivElement>, "color" | "onLoad" | "onError">,
        AvatarImageProps {
    color?: Responsive<Color | ColorLike>;
    variant?: Responsive<PaperVariant>;
    size?: Responsive<Size | SizeValue | number>;

    elevation?: Responsive<number>;

    shape?: Responsive<Shape | SizeValue | number>;
}

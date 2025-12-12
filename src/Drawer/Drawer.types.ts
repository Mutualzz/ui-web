import type {
    Color,
    ColorLike,
    Responsive,
    Size,
    SizeValue,
} from "@mutualzz/ui-core";
import type { HTMLAttributes } from "react";
import type { PaperVariant } from "../Paper/Paper.types";

export type DrawerAnchor = "left" | "right" | "top" | "bottom";
export type DrawerConsistency = "permanent" | "temporary";

export interface DrawerProps extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "color"
> {
    color?: Responsive<Color | ColorLike>;
    variant?: Responsive<PaperVariant>;
    size?: Responsive<Size | SizeValue | number>;

    elevation?: Responsive<number>;

    anchor?: Responsive<DrawerAnchor>;
    hideBackdrop?: Responsive<boolean>;
    onOpen: () => void;
    onClose: () => void;
    open: boolean;

    consistency?: Responsive<DrawerConsistency>;

    swipeable?: boolean;

    disablePortal?: boolean;

    transparency?: Responsive<number>;

    swipeArea?: Responsive<number | Size | SizeValue>;
    threshold?: Responsive<number | Size | SizeValue>;
}

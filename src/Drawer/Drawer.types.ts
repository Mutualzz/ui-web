import type {
    Color,
    ColorLike,
    Responsive,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { HTMLAttributes } from "react";

export type DrawerAnchor = "left" | "right" | "top" | "bottom";
export type DrawerConsistency = "permanent" | "temporary";

export interface DrawerProps
    extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
    color?: Responsive<Color | ColorLike>;
    variant?: Responsive<Variant | "elevation">;
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

    nonTranslucent?: Responsive<boolean>;

    swipeArea?: Responsive<number | Size | SizeValue>;
    threshold?: Responsive<number | Size | SizeValue>;
}

import type {
    Color,
    ColorLike,
    Responsive,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { HTMLAttributes, ReactElement, ReactNode } from "react";

export type TooltipPlacement =
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end"
    | "left-start"
    | "left-end"
    | "right-start"
    | "right-end";

export type TooltipVariant = Variant | "none";

export interface TooltipProps
    extends Omit<
        HTMLAttributes<HTMLDivElement>,
        "color" | "title" | "content"
    > {
    title?: ReactNode;
    content?: ReactNode;
    children?: ReactElement;

    elevation?: Responsive<number>;

    placement?: Responsive<TooltipPlacement>;

    open?: boolean;
    defaultOpen?: boolean;

    onOpenChange?: (open: boolean) => void;

    variant?: Responsive<TooltipVariant>;
    size?: Responsive<Size | SizeValue | number>;
    color?: Responsive<Color | ColorLike>;

    enterDelay?: number; // ms
    leaveDelay?: number; // ms

    disableHoverListener?: boolean;
    disableFocusListener?: boolean;
    disableTouchListener?: boolean;
    followCursor?: boolean;

    id?: string;
}

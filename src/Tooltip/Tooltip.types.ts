import type {
    FlipOptions,
    OffsetOptions,
    ShiftOptions,
} from "@floating-ui/react";
import type { Responsive, Variant } from "@mutualzz/ui-core";
import type { HTMLAttributes, ReactNode } from "react";

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
    children?: ReactNode;

    flip?: FlipOptions;
    shift?: ShiftOptions;

    offset?: OffsetOptions;

    placement?: Responsive<TooltipPlacement>;

    open?: boolean;
    defaultOpen?: boolean;

    onHover?: (open: boolean) => void;

    enterDelay?: number; // ms
    leaveDelay?: number; // ms

    disableHoverListener?: boolean;
    disableFocusListener?: boolean;
    disableTouchListener?: boolean;
    followCursor?: boolean;

    id?: string;
}

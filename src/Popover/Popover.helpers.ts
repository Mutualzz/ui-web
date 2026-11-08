import type { Theme } from "@emotion/react";
import type { Size, SizeValue } from "@mutualzz/ui-core";
import { resolveSize } from "@mutualzz/ui-core";
import type { PopoverAlign, PopoverPlacement } from "./Popover.types";

const baseSizeMap: Record<Size, number> = {
    sm: 12,
    md: 14,
    lg: 16,
};

export const getBestPlacement = (
    triggerRect: DOMRect,
    popoverRect: DOMRect,
    viewportWidth: number,
    viewportHeight: number,
    offset = 10,
): "bottom" | "top" | "right" | "left" => {
    const space = {
        bottom: viewportHeight - triggerRect.bottom,
        top: triggerRect.top,
        right: viewportWidth - triggerRect.right,
        left: triggerRect.left,
    };
    if (space.bottom >= popoverRect.height + offset) return "bottom";
    if (space.top >= popoverRect.height + offset) return "top";
    if (space.right >= popoverRect.width + offset) return "right";
    if (space.left >= popoverRect.width + offset) return "left";
    return "bottom"; // fallback
};

const alignOnAxis = (
    start: number,
    triggerSize: number,
    popoverSize: number,
    align: PopoverAlign,
) => {
    if (align === "start") return start;
    if (align === "end") return start + triggerSize - popoverSize;
    return start + (triggerSize - popoverSize) / 2;
};

export const getPopoverPosition = (
    placement: PopoverPlacement,
    triggerRect: DOMRect,
    popoverRect: DOMRect,
    scrollTop: number,
    scrollLeft: number,
    align: PopoverAlign = "center",
    offset = 10,
) => {
    const horizontal = alignOnAxis(
        triggerRect.left + scrollLeft,
        triggerRect.width,
        popoverRect.width,
        align,
    );
    const vertical = alignOnAxis(
        triggerRect.top + scrollTop,
        triggerRect.height,
        popoverRect.height,
        align,
    );

    switch (placement) {
        case "bottom":
            return {
                top: triggerRect.bottom + scrollTop + offset,
                left: horizontal,
            };
        case "top":
            return {
                top: triggerRect.top + scrollTop - popoverRect.height - offset,
                left: horizontal,
            };
        case "right":
            return {
                top: vertical,
                left: triggerRect.right + scrollLeft + offset,
            };
        case "left":
            return {
                top: vertical,
                left:
                    triggerRect.left + scrollLeft - popoverRect.width - offset,
            };
        default:
            return { top: 0, left: 0 };
    }
};

export const resolvePopoverSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        fontSize: resolvedSize,
    };
};

export { resolvePaperStyles as resolvePopoverStyles } from "../Paper/Paper.helpers";

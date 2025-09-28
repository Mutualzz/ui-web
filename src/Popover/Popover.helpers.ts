import type { Theme } from "@emotion/react";
import type { Size, SizeValue } from "@mutualzz/ui-core";
import { resolveSize } from "@mutualzz/ui-core";

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

export const getPopoverPosition = (
    placement: "top" | "bottom" | "left" | "right",
    triggerRect: DOMRect,
    popoverRect: DOMRect,
    scrollTop: number,
    scrollLeft: number,
    offset = 10,
) => {
    switch (placement) {
        case "bottom":
            return {
                top: triggerRect.bottom + scrollTop + offset,
                // Center popover over trigger
                left:
                    triggerRect.left +
                    scrollLeft +
                    (triggerRect.width - popoverRect.width) / 2,
            };
        case "top":
            return {
                top: triggerRect.top + scrollTop - popoverRect.height - offset,
                left:
                    triggerRect.left +
                    scrollLeft +
                    (triggerRect.width - popoverRect.width) / 2,
            };
        case "right":
            return {
                top:
                    triggerRect.top +
                    scrollTop +
                    (triggerRect.height - popoverRect.height) / 2,
                left: triggerRect.right + scrollLeft + offset,
            };
        case "left":
            return {
                top:
                    triggerRect.top +
                    scrollTop +
                    (triggerRect.height - popoverRect.height) / 2,
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

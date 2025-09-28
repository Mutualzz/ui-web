import type { CSSObject, Theme } from "@emotion/react";
import type { Responsive, Size, SizeValue } from "@mutualzz/ui-core";
import { resolveResponsiveMerge, resolveSize } from "@mutualzz/ui-core";
import { useCallback, useRef } from "react";
import type { DrawerAnchor } from "./Drawer.types";

const baseSizeMap: Record<Size, number> = {
    sm: 240,
    md: 320,
    lg: 360,
};

const swipeAreaMap: Record<Size, number> = {
    sm: 64,
    md: 96,
    lg: 128,
};

const swipeThresholdMap: Record<Size, number> = {
    sm: 24,
    md: 40,
    lg: 56,
};

export const resolveAnchorStyles = (
    theme: Theme,
    anchor: DrawerAnchor,
    size: Size | SizeValue | number,
): CSSObject => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    switch (anchor) {
        case "left":
            return {
                top: 0,
                left: 0,
                height: "100%",
                width: resolvedSize,
                transform: "translateX(-100%)",
                touchAction: "pan-y",
            };
        case "right":
            return {
                top: 0,
                right: 0,
                height: "100%",
                width: resolvedSize,
                transform: "translateX(100%)",
                touchAction: "pan-y",
            };
        case "top":
            return {
                top: 0,
                left: 0,
                width: "100%",
                height: 320,
                transform: "translateY(-100%)",
                touchAction: "pan-x",
            };
        case "bottom":
        default:
            return {
                bottom: 0,
                left: 0,
                width: "100%",
                height: resolvedSize,
                transform: "translateY(100%)",
                touchAction: "pan-x",
            };
    }
};

export const resolveSwipeAreaStyles = (
    theme: Theme,
    anchor: DrawerAnchor,
    swipeArea: number | Size | SizeValue,
): CSSObject => {
    const size = swipeArea;

    switch (anchor) {
        case "left":
            return {
                position: "fixed",
                top: 0,
                left: 0,
                width: size,
                height: "100vh",
                zIndex: theme.zIndex.drawer - 1,
                touchAction: "pan-y",
            };
        case "right":
            return {
                position: "fixed",
                top: 0,
                right: 0,
                width: size,
                height: "100vh",
                zIndex: theme.zIndex.drawer - 1,
                touchAction: "pan-y",
            };
        case "top":
            return {
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: size,
                zIndex: theme.zIndex.drawer - 1,
                touchAction: "pan-x",
            };
        case "bottom":
        default:
            return {
                position: "fixed",
                bottom: 0,
                left: 0,
                width: "100vw",
                height: size,
                zIndex: theme.zIndex.drawer - 1,
                touchAction: "pan-x",
            };
    }
};

export const useSwipeableDrawer = ({
    theme,
    anchor,
    swipeArea,
    threshold,
    swipeable,
    open,
    onOpen,
    onClose,
}: {
    theme: Theme;
    anchor: Responsive<DrawerAnchor>;
    swipeArea: Responsive<number | Size | SizeValue>;
    threshold: Responsive<number | Size | SizeValue>;
    swipeable?: boolean;
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
}) => {
    const touchStart = useRef<{ x: number; y: number } | null>(null);

    const { resolvedAnchor, resolvedArea, resolvedThreshold } =
        resolveResponsiveMerge(
            theme,
            { anchor, swipeArea, threshold },
            ({ anchor: a, swipeArea: sa, threshold: st }) => ({
                resolvedAnchor: a,
                resolvedArea: resolveSize(theme, sa, swipeAreaMap),
                resolvedThreshold: resolveSize(theme, st, swipeThresholdMap),
            }),
        );

    // For swipe-to-close (when open)
    const handleTouchStart = useCallback(
        (e: React.TouchEvent) => {
            if (!swipeable || !open) return;
            const touch = e.touches[0];
            touchStart.current = { x: touch.clientX, y: touch.clientY };
        },
        [swipeable, open],
    );

    const handleTouchEnd = useCallback(
        (e: React.TouchEvent) => {
            if (!swipeable || !open || !touchStart.current) return;
            const touch = e.changedTouches[0];
            const dx = touch.clientX - touchStart.current.x;
            const dy = touch.clientY - touchStart.current.y;

            let shouldClose = false;
            if (resolvedAnchor === "left" && dx < -resolvedThreshold)
                shouldClose = true;
            if (resolvedAnchor === "right" && dx > resolvedThreshold)
                shouldClose = true;
            if (resolvedAnchor === "top" && dy < -resolvedThreshold)
                shouldClose = true;
            if (resolvedAnchor === "bottom" && dy > resolvedThreshold)
                shouldClose = true;

            if (shouldClose) onClose();
            touchStart.current = null;
        },
        [resolvedAnchor, swipeable, open, onClose],
    );

    // For swipe-to-open (when closed)
    const handleSwipeOpenStart = useCallback(
        (e: React.TouchEvent) => {
            if (!swipeable || open) return;
            const touch = e.touches[0];
            touchStart.current = { x: touch.clientX, y: touch.clientY };
        },
        [swipeable, open],
    );

    const handleSwipeOpenEnd = useCallback(
        (e: React.TouchEvent) => {
            if (!swipeable || open || !touchStart.current) return;
            const touch = e.changedTouches[0];
            const dx = touch.clientX - touchStart.current.x;
            const dy = touch.clientY - touchStart.current.y;

            let shouldOpen = false;
            if (resolvedAnchor === "left" && dx > resolvedThreshold)
                shouldOpen = true;
            if (resolvedAnchor === "right" && dx < -resolvedThreshold)
                shouldOpen = true;
            if (resolvedAnchor === "top" && dy > resolvedThreshold)
                shouldOpen = true;
            if (resolvedAnchor === "bottom" && dy < -resolvedThreshold)
                shouldOpen = true;

            if (shouldOpen) onOpen();
            touchStart.current = null;
        },
        [resolvedAnchor, swipeable, open, onOpen],
    );

    return {
        resolvedAnchor,
        resolvedArea,
        handleTouchStart,
        handleTouchEnd,
        handleSwipeOpenStart,
        handleSwipeOpenEnd,
    };
};

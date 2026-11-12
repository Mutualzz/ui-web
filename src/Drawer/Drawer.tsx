import type {
    Color,
    ColorLike,
    Responsive,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import { resolveResponsiveMerge, styled, useForkRef } from "@mutualzz/ui-core";
import { forwardRef, useEffect, useRef, type KeyboardEvent } from "react";
import { resolvePaperStyles } from "../Paper/Paper.helpers";
import { Portal } from "../Portal/Portal";
import { useTheme } from "../useTheme";
import {
    resolveAnchorStyles,
    resolveSwipeAreaStyles,
    useSwipeableDrawer,
} from "./Drawer.helpers";
import type { DrawerAnchor, DrawerProps } from "./Drawer.types";
import { FocusTrap } from "../FocusTrap/FocusTrap";

const DrawerRoot = styled("div")<{
    color: Responsive<Color | ColorLike>;
    variant: Responsive<Variant | "elevation">;
    open: boolean;
    anchor: Responsive<DrawerAnchor>;
    elevation: Responsive<number>;
    size: Responsive<number | Size | SizeValue>;
}>(({ theme, open, anchor, color, variant, elevation, size }) => ({
    position: "fixed",
    zIndex: theme.zIndex.drawer,
    background: theme.colors.surface,
    boxShadow: theme.shadows[4],
    transition: open
        ? "transform 0.3s cubic-bezier(0.4,0,0.2,1), visibility 0s"
        : "transform 0.3s cubic-bezier(0.4,0,0.2,1), visibility 0s linear 0.3s",
    visibility: open ? "visible" : "hidden",
    outline: 0,
    overflowY: "auto",

    ...resolveResponsiveMerge(
        theme,
        {
            anchor,
            color,
            variant,
            elevation,
            size,
        },
        ({ anchor: a, color: c, variant: v, elevation: e, size: s }) => ({
            ...resolveAnchorStyles(theme, a, s),
            ...resolvePaperStyles(theme, c, "primary", v, e, "modal")[v],
            flexDirection: a === "left" || a === "right" ? "column" : "row",
            ...(open && {
                transform: "none",
            }),
        }),
    ),
}));

const DrawerBackdrop = styled("div")(({ theme }) => ({
    position: "fixed",
    zIndex: theme.zIndex.drawer - 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    WebkitTapHighlightColor: "transparent",
    backdropFilter: "blur(4px)",
}));

const SwipeableArea = styled("div")<{
    anchor: DrawerAnchor;
    swipeArea: number;
}>(({ theme, anchor, swipeArea }) => ({
    ...resolveSwipeAreaStyles(theme, anchor, swipeArea),
}));

const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
    (
        {
            color = "primary",
            variant = "elevation",
            size = "md",
            open,
            elevation = 0,
            hideBackdrop,
            onOpen,
            onClose,
            anchor = "left",
            swipeable = true,
            disablePortal = false,
            swipeArea = "md",
            threshold = "md",
            onKeyDown,
            children,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();

        const drawerRef = useRef<HTMLDivElement>(null);
        const handleRef = useForkRef(drawerRef, ref);

        useEffect(() => {
            const drawerNode = drawerRef.current;
            if (!open || !drawerNode) return;
            if (!drawerNode.contains(document.activeElement))
                drawerNode.focus();
        }, [open]);

        const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
            onKeyDown?.(event);
            if (event.key !== "Escape" || !open) return;
            event.stopPropagation();
            onClose();
        };

        useEffect(() => {
            if (open) {
                const original = document.body.style.overflow;
                document.body.style.overflow = "hidden";
                return () => {
                    document.body.style.overflow = original;
                };
            }
        }, [open]);

        const {
            resolvedAnchor,
            resolvedArea,
            handleTouchStart,
            handleTouchEnd,
            handleSwipeOpenStart,
            handleSwipeOpenEnd,
        } = useSwipeableDrawer({
            theme,
            anchor,
            swipeArea,
            threshold,
            swipeable,
            open,
            onOpen,
            onClose,
        });

        const DrawerContent = (
            <>
                {!hideBackdrop && open && <DrawerBackdrop onClick={onClose} />}
                <FocusTrap active={open}>
                    <DrawerRoot
                        elevation={elevation}
                        color={color}
                        size={size}
                        variant={variant}
                        open={open}
                        anchor={anchor}
                        tabIndex={-1}
                        ref={handleRef}
                        role="dialog"
                        aria-modal={open ? "true" : undefined}
                        onKeyDown={handleKeyDown}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        {...props}
                    >
                        {children}
                    </DrawerRoot>
                </FocusTrap>
            </>
        );

        return (
            <>
                {!open && swipeable && (
                    <SwipeableArea
                        anchor={resolvedAnchor}
                        swipeArea={resolvedArea}
                        onTouchStart={handleSwipeOpenStart}
                        onTouchEnd={handleSwipeOpenEnd}
                        aria-hidden
                    />
                )}
                {disablePortal ? (
                    <>{DrawerContent}</>
                ) : (
                    <Portal>{DrawerContent}</Portal>
                )}
            </>
        );
    },
);

Drawer.displayName = "Drawer";

export { Drawer };

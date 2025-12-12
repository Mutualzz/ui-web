import type {
    Color,
    ColorLike,
    Responsive,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import { resolveResponsiveMerge, styled } from "@mutualzz/ui-core";
import { forwardRef, useEffect, useRef } from "react";
import { resolvePaperStyles } from "../Paper/Paper.helpers";
import { Portal } from "../Portal/Portal";
import { useTheme } from "../useTheme";
import {
    resolveAnchorStyles,
    resolveSwipeAreaStyles,
    useSwipeableDrawer,
} from "./Drawer.helpers";
import type { DrawerAnchor, DrawerProps } from "./Drawer.types";

const DrawerRoot = styled("div")<{
    color: Responsive<Color | ColorLike>;
    variant: Responsive<Variant | "elevation">;
    open: boolean;
    anchor: Responsive<DrawerAnchor>;
    elevation: Responsive<number>;
    size: Responsive<number | Size | SizeValue>;
    transparency: Responsive<number>;
}>(
    ({
        theme,
        open,
        anchor,
        color,
        variant,
        elevation,
        size,
        transparency,
    }) => ({
        position: "fixed",
        zIndex: theme.zIndex.drawer,
        background: theme.colors.surface,
        boxShadow: theme.shadows[4],
        transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
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
                transparency,
            },
            ({
                anchor: a,
                color: c,
                variant: v,
                elevation: e,
                size: s,
                transparency: trans,
            }) => ({
                ...resolveAnchorStyles(theme, a, s),
                ...resolvePaperStyles(theme, c, "primary", e, trans)[v],
                flexDirection: a === "left" || a === "right" ? "column" : "row",
                ...(open && {
                    transform: "none",
                }),
            }),
        ),
    }),
);

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

const FocusTrap = ({
    active,
    children,
}: {
    active: boolean;
    children: React.ReactNode;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!active) return;
        const node = ref.current;
        if (!node) return;
        const focusable = node.querySelectorAll<HTMLElement>(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        node.addEventListener("keydown", handleKeyDown);
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        (first ?? node).focus();
        return () => node.removeEventListener("keydown", handleKeyDown);
    }, [active]);
    return <div ref={ref}>{children}</div>;
};

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
            transparency = 90,
            disablePortal = false,
            swipeArea = "md",
            threshold = "md",
            children,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();

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
                        transparency={transparency}
                        elevation={elevation}
                        color={color as string}
                        size={size}
                        variant={variant}
                        open={open}
                        anchor={anchor}
                        tabIndex={-1}
                        ref={ref}
                        role="dialog"
                        aria-modal="true"
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

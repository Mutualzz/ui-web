import {
    autoUpdate,
    flip,
    offset,
    safePolygon,
    shift,
    useClientPoint,
    useDismiss,
    useFloating,
    useFocus,
    useHover,
    useInteractions,
    useRole,
} from "@floating-ui/react";
import { resolveResponsiveMerge, styled } from "@mutualzz/ui-core";
import { Portal } from "../Portal/Portal";
import {
    Children,
    cloneElement,
    forwardRef,
    useEffect,
    useId,
    useState,
} from "react";
import { useTheme } from "../useTheme";
import type { TooltipProps } from "./Tooltip.types";

const TooltipRoot = styled("div")<Omit<TooltipProps, "children">>(
    ({ theme }) => ({
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: theme.zIndex.tooltip,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        maxWidth: "calc(100vw - 16px)",
        width: "max-content",
        pointerEvents: "auto",
    }),
);

TooltipRoot.displayName = "TooltipRoot";

const TooltipContent = styled("span")<Omit<TooltipProps, "children">>({
    lineHeight: 1.2,
});

TooltipContent.displayName = "TooltipContent";

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
    (
        {
            id,
            title,
            content,
            children,
            placement: placementProp = "top",
            open: openProp,
            defaultOpen,
            onHover,
            enterDelay = 100,
            flip: flipProp,
            shift: shiftProp,
            offset: offsetProp,
            leaveDelay = 100,
            disableFocusListener,
            disableHoverListener,
            disableTouchListener,
            followCursor,
            disablePortal = false,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();
        const tipId = id || useId();
        const isControlled = openProp !== undefined;
        const [uncontrolled, setUncontrolled] = useState(!!defaultOpen);
        const open = isControlled ? !!openProp : uncontrolled;

        const [mounted, setMounted] = useState(false);
        const label = content ?? title;

        const setOpen = (value: boolean) => {
            if (!isControlled) setUncontrolled(value);
            onHover?.(value);
        };

        const { placement } = resolveResponsiveMerge(
            theme,
            { placement: placementProp },
            ({ placement }) => ({ placement }),
        );

        const { refs, floatingStyles, context } = useFloating({
            open,
            onOpenChange: setOpen,
            placement,
            // Always fixed so tips never expand scroll containers / document.
            strategy: "fixed",
            whileElementsMounted: (r, f, u) =>
                autoUpdate(r, f, u, {
                    animationFrame: true,
                }),
            middleware: [
                offset(offsetProp ?? 8),
                flip({
                    padding: 8,
                    fallbackAxisSideDirection: "start",
                    ...flipProp,
                }),
                shift({
                    padding: 8,
                    ...shiftProp,
                }),
            ],
        });

        const hover = useHover(context, {
            enabled: !disableHoverListener,
            delay: { open: enterDelay, close: leaveDelay },
            handleClose: safePolygon(),
            move: !!followCursor,
        });
        const focus = useFocus(context, { enabled: !disableFocusListener });
        const dismiss = useDismiss(context, { escapeKey: true });
        const role = useRole(context, { role: "tooltip" });
        const clientPoint = useClientPoint(context, {
            enabled: !!followCursor,
        });

        const { getReferenceProps, getFloatingProps } = useInteractions([
            hover,
            focus,
            dismiss,
            role,
            clientPoint,
        ]);

        useEffect(() => setMounted(true), []);

        const child = children ? Children.only<any>(children) : null;

        const tooltipEl = (
            <TooltipRoot
                ref={refs.setFloating}
                id={tipId}
                role="tooltip"
                // Inline style required: floating position updates every frame.
                style={floatingStyles}
                css={{
                    visibility: open ? "visible" : "hidden",
                }}
                {...getFloatingProps(props)}
            >
                <TooltipContent>{label ?? title}</TooltipContent>
            </TooltipRoot>
        );

        return (
            <div
                ref={ref}
                css={{
                    display: "contents",
                }}
            >
                {child &&
                    cloneElement(child, {
                        ref: refs.setReference,
                        "aria-describedby": open ? tipId : undefined,
                        ...getReferenceProps(child.props),
                    })}

                {mounted &&
                    open &&
                    label &&
                    (!disablePortal ? <Portal>{tooltipEl}</Portal> : tooltipEl)}
            </div>
        );
    },
);

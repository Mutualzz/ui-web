import type { CSSObject } from "@emotion/react";
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
import { Portal } from "Portal/Portal";
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
        position: "absolute",
        zIndex: theme.zIndex.tooltip,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
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
            whileElementsMounted: (r, f, u) =>
                autoUpdate(r, f, u, {
                    animationFrame: true,
                }),
            middleware: [
                offset(offsetProp ?? 8),
                shift(shiftProp),
                flip(flipProp),
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

        return (
            <div ref={ref} {...props}>
                {child &&
                    cloneElement(child, {
                        ref: refs.setReference,
                        "aria-describedby": open ? tipId : undefined,
                        ...getReferenceProps(child.props as any),
                    })}

                {mounted && open && label && (
                    <Portal>
                        <TooltipRoot
                            ref={refs.setFloating}
                            id={tipId}
                            role="tooltip"
                            css={floatingStyles as CSSObject}
                            {...getFloatingProps({})}
                        >
                            <TooltipContent>{label ?? title}</TooltipContent>
                        </TooltipRoot>
                    </Portal>
                )}
            </div>
        );
    },
);

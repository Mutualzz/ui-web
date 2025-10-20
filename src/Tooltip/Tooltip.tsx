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
import {
    resolveTooltipContainerSize,
    resolveTooltipContainerStyles,
    resolveTooltipTextStyles,
} from "./Tooltip.helpers";
import type { TooltipProps } from "./Tooltip.types";

const TooltipRoot = styled("div")<Omit<TooltipProps, "children">>(
    ({
        theme,
        color = "neutral",
        variant = "none",
        size = "md",
        elevation = 1,
    }) => ({
        position: "absolute",
        zIndex: theme.zIndex.tooltip,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        boxShadow: theme.shadows[4],
        whiteSpace: "nowrap",
        pointerEvents: "none",
        ...resolveResponsiveMerge(
            theme,
            { size, color, variant, elevation },
            ({ size: s, color: c, variant: v, elevation: e }) => ({
                borderRadius: resolveTooltipContainerSize(theme, s)
                    .borderRadius,
                padding: resolveTooltipContainerSize(theme, s).padding,
                ...resolveTooltipContainerStyles(theme, c, e)[v],
            }),
        ),
    }),
);

TooltipRoot.displayName = "TooltipRoot";

const TooltipContent = styled("span")<Omit<TooltipProps, "children">>(
    ({
        theme,
        color = "neutral",
        variant = "none",
        size = "md",
        elevation = 1,
    }) => ({
        lineHeight: 1.2,
        ...resolveResponsiveMerge(
            theme,
            { size, color, variant, elevation },
            ({ color: c, variant: v, size: s }) => ({
                ...resolveTooltipTextStyles(theme, c)[v],
                fontSize: resolveTooltipContainerSize(theme, s).fontSize,
            }),
        ),
    }),
);

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
            onOpenChange,
            variant = "none",
            size: sizeProp = "md",
            color = "neutral",
            elevation = 5,
            enterDelay = 100,
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
            onOpenChange?.(value);
        };

        const { placement, size } = resolveResponsiveMerge(
            theme,
            { placement: placementProp, size: sizeProp },
            ({ placement, size }) => ({ placement, size }),
        );

        const { refs, floatingStyles, context } = useFloating({
            open,
            onOpenChange: setOpen,
            placement,
            whileElementsMounted: autoUpdate,
            middleware: [
                offset(() => resolveTooltipContainerSize(theme, size).gap),
                flip({ padding: 8 }),
                shift({ padding: 8 }),
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
                            elevation={elevation}
                            ref={refs.setFloating}
                            id={tipId}
                            role="tooltip"
                            color={color as string}
                            variant={variant}
                            size={size}
                            style={floatingStyles as React.CSSProperties}
                            {...getFloatingProps({})}
                        >
                            <TooltipContent
                                color={color as string}
                                variant={variant}
                                size={size}
                                elevation={1}
                            >
                                {label ?? title}
                            </TooltipContent>
                        </TooltipRoot>
                    </Portal>
                )}
            </div>
        );
    },
);

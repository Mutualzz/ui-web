import type { CSSObject } from "@emotion/react";
import type { Responsive, Size, SizeValue } from "@mutualzz/ui-core";
import {
    clamp,
    resolveResponsiveMerge,
    styled,
    useOnClickOutside,
} from "@mutualzz/ui-core";
import {
    forwardRef,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { Paper } from "../Paper/Paper";
import { Portal } from "../Portal/Portal";
import { Stack } from "../Stack/Stack";
import {
    getBestPlacement,
    getPopoverPosition,
    resolvePopoverSize,
    resolvePopoverStyles,
} from "./Popover.helpers";
import type { PopoverPlacement, PopoverProps } from "./Popover.types";

const PopoverRoot = styled("div")({
    position: "relative",
    display: "inline-block",
});

const PopoverContent = styled(Paper)<{
    disablePortal?: boolean;
    top?: number;
    left?: number;
    placement?: "top" | "bottom" | "left" | "right";
    size: Responsive<Size | SizeValue | number>;
    transparency: Responsive<number>;
}>(({
    theme,
    disablePortal,
    top,
    left,
    size,
    color = "neutral",
    textColor = "primary",
    variant = "elevation",
    elevation = 0,
    placement = "bottom",
    transparency,
}) => {
    const baseStyles: CSSObject = {
        position: disablePortal ? "absolute" : "fixed",
        transition:
            "opacity 0.2s ease, transform 0.2s cubic-bezier(0.4,0,0.2,1)",
        borderRadius: 4,
        zIndex: theme.zIndex.tooltip,
        whiteSpace: "nowrap",
    };

    if (!disablePortal) {
        if (placement === "top" || placement === "bottom") {
            baseStyles.top = top;
            baseStyles.left = left;
        } else {
            baseStyles.top = top;
            baseStyles.left = left;
        }
    } else {
        if (placement === "bottom") {
            baseStyles.top = "100%";
            baseStyles.left = "50%";
            baseStyles.marginTop = 10;
            baseStyles.transform = "translateX(-50%)";
        } else if (placement === "top") {
            baseStyles.bottom = "100%";
            baseStyles.left = "50%";
            baseStyles.marginBottom = 10;
            baseStyles.transform = "translateX(-50%)";
        } else if (placement === "left") {
            baseStyles.top = "50%";
            baseStyles.right = "100%";
            baseStyles.marginRight = 10;
            baseStyles.transform = "translateY(-50%)";
        } else {
            baseStyles.top = "50%";
            baseStyles.left = "100%";
            baseStyles.marginLeft = 10;
            baseStyles.transform = "translateY(-50%)";
        }
    }

    return {
        ...baseStyles,
        ...resolveResponsiveMerge(
            theme,
            {
                color,
                textColor,
                elevation,
                variant,
                size,
                transparency,
            },
            ({
                color: c,
                textColor: tc,
                elevation: e,
                size: s,
                variant: v,
                transparency: trans,
            }) => ({
                ...resolvePopoverSize(theme, s),
                ...resolvePopoverStyles(theme, c, tc, v, e, trans)[v],
            }),
        ),
    };
});

const Popover = forwardRef<HTMLDivElement, PopoverProps>(
    (
        {
            color = "primary",
            variant = "elevation",
            size = "md",
            trigger,
            children,
            isOpen: isOpenProp,
            disablePortal = false,
            closeOnClickOutside = true,
            closeOnInteract = false,
            placement: placementProp,
            elevation = 0,
            transparency = 80,
            ...props
        },
        ref,
    ) => {
        const [visible, setVisible] = useState(false);
        const [position, setPosition] = useState({ top: 0, left: 0 });
        const [measured, setMeasured] = useState(false);
        const [internalPlacement, setInternalPlacement] =
            useState<PopoverPlacement>("bottom");
        const triggerRef = useRef<HTMLDivElement>(null);
        const contentRef = useRef<HTMLDivElement>(null);

        const isControlled = isOpenProp !== undefined;
        const isOpen = isControlled ? isOpenProp : visible;
        const placement = placementProp ?? internalPlacement;

        const updatePosition = () => {
            if (!triggerRef.current || !contentRef.current) return;
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const popoverRect = contentRef.current.getBoundingClientRect();

            if (
                (popoverRect.width === 0 && popoverRect.height === 0) ||
                (triggerRect.width === 0 && triggerRect.height === 0)
            )
                return;

            const scrollTop =
                window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft =
                window.pageXOffset || document.documentElement.scrollLeft;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const bestPlacement = getBestPlacement(
                triggerRect,
                popoverRect,
                viewportWidth,
                viewportHeight,
            );
            setInternalPlacement(bestPlacement);

            const scrollTopForPosition = disablePortal ? scrollTop : 0;
            const scrollLeftForPosition = disablePortal ? scrollLeft : 0;

            const bestPosition = getPopoverPosition(
                bestPlacement,
                triggerRect,
                popoverRect,
                scrollTopForPosition,
                scrollLeftForPosition,
            );

            const clampedPosition = {
                top: clamp(
                    bestPosition.top,
                    0,
                    viewportHeight - popoverRect.height,
                ),
                left: clamp(
                    bestPosition.left,
                    0,
                    viewportWidth - popoverRect.width,
                ),
            };

            setPosition(clampedPosition);
            setMeasured(true);
        };

        useLayoutEffect(() => {
            if (!isOpen) {
                setMeasured(false);
                return;
            }
            requestAnimationFrame(() =>
                requestAnimationFrame(() => {
                    updatePosition();
                }),
            );
        }, [isOpen, updatePosition]);

        useEffect(() => {
            if (!isOpen) return;
            const handleScroll = () => updatePosition();
            const handleResize = () => updatePosition();
            window.addEventListener("scroll", handleScroll, true);
            window.addEventListener("resize", handleResize);
            return () => {
                window.removeEventListener("scroll", handleScroll, true);
                window.removeEventListener("resize", handleResize);
            };
        }, [isOpen, updatePosition]);

        useEffect(() => {
            if (!isOpen || !contentRef.current) return;
            const ro = new ResizeObserver(() => updatePosition());
            ro.observe(contentRef.current);
            return () => ro.disconnect();
        }, [isOpen, updatePosition]);

        const toggleVisibility = () => {
            if (!isControlled) setVisible((prev) => !prev);
        };

        useOnClickOutside([triggerRef, contentRef] as any[], () => {
            if (!closeOnClickOutside) return;
            setVisible(false);
        });

        const handleContentClick = () => {
            if (closeOnInteract) setVisible(false);
        };

        const popoverContent = isOpen && (
            <PopoverContent
                {...props}
                ref={contentRef}
                color={color as string}
                variant={variant}
                size={size}
                transparency={transparency}
                disablePortal={disablePortal}
                top={position.top}
                elevation={elevation}
                left={position.left}
                placement={placement}
                onClick={() => closeOnInteract && handleContentClick()}
                css={{ visibility: measured ? "visible" : "hidden" }}
            >
                {children}
            </PopoverContent>
        );

        return (
            <PopoverRoot ref={ref}>
                <Stack ref={triggerRef} onClick={toggleVisibility}>
                    {trigger}
                </Stack>

                {!disablePortal ? (
                    <Portal>{popoverContent}</Portal>
                ) : (
                    popoverContent
                )}
            </PopoverRoot>
        );
    },
);

Popover.displayName = "Popover";

export { Popover };

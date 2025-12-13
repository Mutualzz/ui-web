import type { CSSObject } from "@emotion/react";
import { resolveResponsiveMerge, styled } from "@mutualzz/ui-core";
import { IconButton } from "IconButton/IconButton";
import {
    forwardRef,
    useCallback,
    useEffect,
    useRef,
    type KeyboardEvent as ReactKeyboardEvent,
    type ReactNode,
} from "react";
import { resolveButtonContainerStyles } from "../Button/Button.helpers";
import type { ButtonProps } from "../Button/Button.types";
import { Portal } from "../Portal/Portal";
import type { ModalProps } from "./Modal.types";

const ModalRoot = styled("div")<{
    open?: boolean;
    layout: "center" | "fullscreen";
}>(({ theme, open, layout }) => ({
    '& ~ [role="listbox"]': {
        // target all the listbox (Autocomplete, Menu, Select, etc.) that uses portal
        zIndex: `calc(${theme.zIndex.modal} + 1)`,
    },
    '& ~ [role="tooltip"]': {
        // target all the tooltips that uses portal
        zIndex: `calc(${theme.zIndex.modal} + 2)`,
    },
    position: "fixed",
    zIndex: theme.zIndex.modal,
    right: 0,
    bottom: 0,
    top: 0,
    left: 0,
    display: open ? "block" : "none",
    ...(layout === "center" && {
        display: "grid",
        placeItems: "center",
        paddingBlock: "2rem",
        overscrollBehavior: "contain",
    }),
    ...(layout === "fullscreen" && {
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: "100%",
        height: "100%",
    }),
}));

ModalRoot.displayName = "ModalRoot";

const ModalBackdrop = styled("div")({
    zIndex: -1,
    position: "fixed",
    right: 0,
    bottom: 0,
    top: 0,
    left: 0,
    WebkitTapHighlightColor: "transparent",
    backdropFilter: "blur(8px)",
});

ModalBackdrop.displayName = "ModalBackdrop";

const ModalContainer = styled("div")<{
    layout: "center" | "fullscreen";
    height?: string | number;
}>(({ layout, height }) => ({
    position: "relative",
    ...(layout === "center" && {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        maxHeight: "calc(100dvh - 4rem)",
        overflow: "hidden",
        height,
    }),
    ...(layout === "fullscreen" && {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
    }),
}));

const ModalContent = styled("div")<{
    layout: "center" | "fullscreen";
    height?: string | number;
}>(({ layout, height }) => ({
    width: "100%",
    minHeight: 0,
    position: "relative",
    ...(layout === "center" && {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        height,
    }),
    ...(layout === "fullscreen" && {
        height: "100%",
        overflowY: "auto",
    }),
}));

const ModalCloseButton = styled(IconButton)<
    ButtonProps & {
        layout: "center" | "fullscreen";
    }
>(
    ({ theme, color = "neutral", variant = "plain", layout }) =>
        ({
            ...resolveResponsiveMerge(
                theme,
                { color, variant },
                ({ color: c, variant: v }) => ({
                    ...resolveButtonContainerStyles(theme, c)[v],
                }),
            ),

            position: "relative",
            alignSelf: "flex-end",
            marginTop: layout === "fullscreen" ? "3em" : "1.5em",
            marginRight: layout === "fullscreen" ? "3em" : "1.5em",
            marginBottom: "-3em",
            zIndex: 1,
            borderRadius: 16,

            aspectRatio: "1",
            minWidth: layout === "fullscreen" ? "44px" : "40px",
            width: layout === "fullscreen" ? "44px" : "40px",
            height: layout === "fullscreen" ? "44px" : "40px",
            padding: 0,

            // Center the X
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            "&::before": {
                content: '"✕"',
                fontSize: layout === "fullscreen" ? "18px" : "16px",
                lineHeight: 1,
                fontWeight: "bold",
            },
        }) as CSSObject,
);

ModalCloseButton.displayName = "ModalCloseButton";

const FocusTrap = ({
    active,
    children,
    disableEnforceFocus,
}: {
    active: boolean;
    children: ReactNode;
    disableEnforceFocus?: boolean;
}) => {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!active || disableEnforceFocus) return;

        const node = rootRef.current;
        if (!node) return;

        const focusableElements = node.querySelectorAll<HTMLElement>(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );

        const firstElement: HTMLElement | null = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    (lastElement ?? node).focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    (firstElement ?? node).focus();
                }
            }
        };

        node.addEventListener("keydown", handleKeyDown);
        (firstElement ?? node).focus();

        return () => {
            node.removeEventListener("keydown", handleKeyDown);
        };
    }, [active, disableEnforceFocus]);

    return (
        <div ref={rootRef} tabIndex={-1}>
            {children}
        </div>
    );
};

const Modal = forwardRef<HTMLDivElement, ModalProps>(
    (
        {
            children,
            container,
            disableAutoFocus = false,
            disableEnforceFocus = false,
            disableEscapeKeyDown = false,
            disablePortal = false,
            disableRestoreFocus = false,
            disableScrollLock = false,
            disableBackdropClick = false,
            hideBackdrop = false,
            keepMounted = false,
            layout = "center",
            showCloseButton = true,
            closeButton,
            onClose,
            onKeyDown,
            open,
            height,
            ...props
        },
        ref,
    ) => {
        const modalRef = useRef<HTMLDivElement>(null);
        const lastFocusedElementRef = useRef<Element | null>(null);

        useEffect(() => {
            if (open) {
                lastFocusedElementRef.current = document.activeElement;
            }
        }, [open]);

        useEffect(() => {
            if (!open && !disableRestoreFocus) {
                if (lastFocusedElementRef.current instanceof HTMLElement) {
                    lastFocusedElementRef.current.focus();
                }
            }
        }, [open, disableRestoreFocus]);

        useEffect(() => {
            if (open && !disableAutoFocus) {
                modalRef.current?.focus();
            }
        }, [open, disableAutoFocus]);

        useEffect(() => {
            if (open && !disableScrollLock) {
                const originalOverflow = document.body.style.overflow;
                document.body.style.overflow = "hidden";
                return () => {
                    document.body.style.overflow = originalOverflow;
                };
            }
        }, [open, disableScrollLock]);

        const handleKeyDown = useCallback(
            (e: ReactKeyboardEvent<HTMLDivElement>) => {
                if (!disableEscapeKeyDown && e.key === "Escape") {
                    onClose?.();
                }
                onKeyDown?.(e);
            },
            [disableEscapeKeyDown, onClose, onKeyDown],
        );

        if (!open && !keepMounted) return null;

        const modalContent = (
            <FocusTrap active={open} disableEnforceFocus={disableEnforceFocus}>
                <ModalRoot
                    layout={layout}
                    open={open}
                    role="dialog"
                    aria-modal="true"
                    tabIndex={-1}
                    onKeyDown={handleKeyDown}
                    ref={(node: HTMLDivElement | null) => {
                        modalRef.current = node;
                        if (typeof ref === "function") ref(node);
                        else if (ref) ref.current = node;
                    }}
                    {...(props as any)}
                >
                    {!hideBackdrop &&
                        (disableBackdropClick ? (
                            <ModalBackdrop />
                        ) : (
                            <ModalBackdrop onClick={onClose} />
                        ))}
                    <ModalContainer height={height} layout={layout}>
                        {showCloseButton &&
                            (disableBackdropClick || onClose) &&
                            (closeButton ? (
                                closeButton
                            ) : (
                                <ModalCloseButton
                                    color="neutral"
                                    variant="plain"
                                    layout={layout}
                                    onClick={onClose}
                                    aria-label="Close modal"
                                />
                            ))}
                        <ModalContent height={height} layout={layout}>
                            {children}
                        </ModalContent>
                    </ModalContainer>
                </ModalRoot>
            </FocusTrap>
        );

        return (
            <>
                <Portal container={container} disablePortal={disablePortal}>
                    {modalContent}
                </Portal>
            </>
        );
    },
);

export { Modal, ModalBackdrop, ModalRoot };

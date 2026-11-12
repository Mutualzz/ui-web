import { resolveResponsiveMerge, styled } from "@mutualzz/ui-core";
import { IconButton } from "../IconButton/IconButton";
import {
    forwardRef,
    type KeyboardEvent as ReactKeyboardEvent,
    useCallback,
    useEffect,
    useRef,
} from "react";
import { resolveButtonContainerStyles } from "../Button/Button.helpers";
import type { ButtonProps } from "../Button/Button.types";
import { Portal } from "../Portal/Portal";
import { useUiLabels } from "../UiLabels/UiLabels";
import type { ModalProps } from "./Modal.types";
import { FocusTrap } from "../FocusTrap/FocusTrap";

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
    ...(!open && { display: "none" }),
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
>(({ theme, color = "neutral", variant = "plain", layout }) => ({
    ...resolveResponsiveMerge(
        theme,
        { color, variant },
        ({ color: resolvedColor, variant: resolvedVariant }) => ({
            ...resolveButtonContainerStyles(theme, resolvedColor)[
                resolvedVariant
            ],
        }),
    ),

    position: "absolute",
    top: layout === "fullscreen" ? 16 : 10,
    right: layout === "fullscreen" ? 16 : 10,
    zIndex: 1,
    borderRadius: 10,

    aspectRatio: "1",
    minWidth: layout === "fullscreen" ? "40px" : "32px",
    width: layout === "fullscreen" ? "40px" : "32px",
    height: layout === "fullscreen" ? "40px" : "32px",
    padding: 0,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    "&::before": {
        content: '"✕"',
        fontSize: layout === "fullscreen" ? "16px" : "13px",
        lineHeight: 1,
        fontWeight: "bold",
    },
}));

ModalCloseButton.displayName = "ModalCloseButton";

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
        const labels = useUiLabels();
        const modalRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const modalNode = modalRef.current;
            if (!open || disableAutoFocus || !modalNode) return;
            if (!modalNode.contains(document.activeElement)) modalNode.focus();
        }, [open, disableAutoFocus]);

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
                    e.stopPropagation();
                    onClose?.();
                }
                onKeyDown?.(e);
            },
            [disableEscapeKeyDown, onClose, onKeyDown],
        );

        if (!open && !keepMounted) return null;

        const modalContent = (
            <FocusTrap
                active={open}
                disableEnforceFocus={disableEnforceFocus}
                disableRestoreFocus={disableRestoreFocus}
            >
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
                    {...props}
                >
                    {!hideBackdrop &&
                        (disableBackdropClick ? (
                            <ModalBackdrop />
                        ) : (
                            <ModalBackdrop onClick={onClose} />
                        ))}
                    <ModalContainer height={height} layout={layout}>
                        {showCloseButton &&
                            onClose &&
                            (closeButton ? (
                                closeButton
                            ) : (
                                <ModalCloseButton
                                    color="neutral"
                                    variant="plain"
                                    layout={layout}
                                    onClick={onClose}
                                    aria-label={labels.closeModal}
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

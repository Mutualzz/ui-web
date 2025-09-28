import type { ReactNode } from "react";
import type { PaperProps } from "../Paper/Paper.types";

export interface ModalProps extends PaperProps {
    open: boolean;

    container?: HTMLDivElement | (() => HTMLDivElement);

    disableAutoFocus?: boolean;
    disableEnforceFocus?: boolean;
    disableEscapeKeyDown?: boolean;
    disablePortal?: boolean;
    disableRestoreFocus?: boolean;
    disableScrollLock?: boolean;
    disableBackdropClick?: boolean;
    hideBackdrop?: boolean;
    keepMounted?: boolean;

    showCloseButton?: boolean;
    closeButton?: ReactNode;

    layout?: "center" | "fullscreen";

    onClose?: () => void;
}

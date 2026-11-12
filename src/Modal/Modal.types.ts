import type { CSSObject } from "@emotion/react";
import type { HTMLAttributes, ReactNode } from "react";

export interface ModalProps extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "color"
> {
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

    height?: string | number;

    css?: CSSObject;
}

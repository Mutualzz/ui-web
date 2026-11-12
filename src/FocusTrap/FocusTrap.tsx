import { type ReactNode, useEffect, useRef } from "react";

export const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
].join(",");

export const FocusTrap = ({
    active,
    children,
    disableEnforceFocus,
    disableRestoreFocus,
}: {
    active: boolean;
    children: ReactNode;
    disableEnforceFocus?: boolean;
    disableRestoreFocus?: boolean;
}) => {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!active) return;

        const node = rootRef.current;
        if (!node) return;

        const previouslyFocused = document.activeElement;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (disableEnforceFocus || event.key !== "Tab") return;

            const focusableElements = Array.from(
                node.querySelectorAll<HTMLElement>(focusableSelector),
            );

            if (focusableElements.length === 0) {
                event.preventDefault();
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            const activeElement = document.activeElement;
            const focusIsOnNoElement = !focusableElements.some(
                (element) => element === activeElement,
            );

            if (
                event.shiftKey &&
                (activeElement === firstElement || focusIsOnNoElement)
            ) {
                event.preventDefault();
                lastElement.focus();
            } else if (
                !event.shiftKey &&
                (activeElement === lastElement || focusIsOnNoElement)
            ) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        node.addEventListener("keydown", handleKeyDown);

        return () => {
            node.removeEventListener("keydown", handleKeyDown);
            if (
                !disableRestoreFocus &&
                previouslyFocused instanceof HTMLElement
            ) {
                previouslyFocused.focus();
            }
        };
    }, [active, disableEnforceFocus, disableRestoreFocus]);

    return (
        <div ref={rootRef} tabIndex={-1}>
            {children}
        </div>
    );
};

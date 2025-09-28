import {
    getReactElementRef,
    setRef,
    useEnhancedEffect,
    useForkRef,
} from "@mutualzz/ui-core";
import { cloneElement, forwardRef, isValidElement, useState } from "react";
import { createPortal } from "react-dom";
import { type PortalProps } from "./Portal.types";

function getContainer(
    container?: PortalProps["container"],
): HTMLElement | null {
    if (!container) {
        return null;
    }

    if (typeof container === "function") {
        try {
            const result = container();
            return result instanceof HTMLElement ? result : null;
        } catch {
            return null;
        }
    }

    return container instanceof HTMLElement ? container : null;
}

/**
 * Portal component for rendering children into a different part of the DOM.
 */
const Portal = forwardRef<HTMLElement, PortalProps>(
    ({ children, container, disablePortal = false }, ref) => {
        const [mountNode, setMountNode] = useState<ReturnType<
            typeof getContainer
        > | null>(null);

        const handleRef = useForkRef(
            isValidElement(children) ? getReactElementRef(children) : null,
            ref,
        );

        useEnhancedEffect(() => {
            if (!disablePortal) {
                setMountNode(getContainer(container) || document.body);
            }
        }, [container, disablePortal]);

        useEnhancedEffect(() => {
            if (mountNode && !disablePortal) {
                setRef(ref, mountNode);
                return () => {
                    setRef(ref, null);
                };
            }

            return undefined;
        }, [ref, mountNode, disablePortal]);

        if (disablePortal) {
            if (isValidElement(children)) {
                const newProps = {
                    ref: handleRef,
                };
                return cloneElement(children, newProps);
            }
            return children;
        }

        return mountNode ? createPortal(children, mountNode) : mountNode;
    },
);

Portal.displayName = "Portal";

export { Portal };

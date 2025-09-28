import type { ReactNode } from "react";

export interface PortalProps {
    /**
     * The children to render inside the portal.
     * This can be any valid React node, such as elements, strings, or fragments.
     * It will be rendered in the specified container outside the normal DOM hierarchy.
     */
    children: ReactNode;
    /**
     * The container to render the portal into.
     * This can be a DOM element or a function that returns a DOM element.
     * If not provided, it defaults to the document body.
     * @default document.body
     */
    container?: HTMLElement | (() => HTMLElement) | null;
    /**
     * If true, the portal will not render its children in a different DOM node.
     * Instead, it will render them in the current DOM hierarchy.
     * This is useful for cases where you want to avoid the overhead of creating a new DOM
     * @default false
     */
    disablePortal?: boolean;
}

import type { SystemProps } from "@mutualzz/ui-core";
import type { ReactElement, ReactNode } from "react";

export interface IconSlotProps extends SystemProps<HTMLSpanElement> {
    /**
     * Fixed box size in pixels. When set, passes `size` to a single icon child.
     */
    size?: number;
    children: ReactNode;
}

export type IconSlotChild = ReactElement<{ size?: number | string }>;

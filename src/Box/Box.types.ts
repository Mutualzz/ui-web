import type { Responsive, SystemProps } from "@mutualzz/ui-core";

/**
 * Props for the Box component.
 */
export interface BoxProps extends SystemProps<HTMLDivElement> {
    /**
     * If true, the Box will be displayed as an inline-block element; otherwise, it will be a block element.
     */
    inline?: Responsive<boolean>;
}

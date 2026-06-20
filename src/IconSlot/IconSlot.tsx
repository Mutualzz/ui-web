import { styled } from "@mutualzz/ui-core";
import {
    Children,
    cloneElement,
    forwardRef,
    isValidElement,
    type Ref,
} from "react";
import type { IconSlotChild, IconSlotProps } from "./IconSlot.types";

const IconSlotRoot = styled("span")<Pick<IconSlotProps, "size">>(({ size }) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    flexShrink: 0,
    lineHeight: 0,
    fontSize: size,
    ...(size != null && {
        width: size,
        height: size,
    }),
}));

IconSlotRoot.displayName = "IconSlotRoot";

const IconSlot = forwardRef<HTMLSpanElement, IconSlotProps>(
    ({ size, children, ...props }, ref) => {
        const child = Children.only(children);

        return (
            <IconSlotRoot ref={ref} size={size} {...props}>
                {isValidElement(child) && size != null
                    ? cloneElement(child as IconSlotChild, { size })
                    : child}
            </IconSlotRoot>
        );
    },
);

IconSlot.displayName = "IconSlot";

export { IconSlot };

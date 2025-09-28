import { resolveResponsiveMerge, styled } from "@mutualzz/ui-core";
import type { BoxProps } from "./Box.types";

/**
 * Box component is a simple styled div that can be displayed as either a block or inline-block
 * element. It is used to create a flexible layout for arranging child elements.
 * The `inline` prop determines whether the Box is displayed as an inline-block or block element
 */
const Box = styled("div")<BoxProps>(({ theme, inline }) => ({
    ...resolveResponsiveMerge(theme, { inline }, ({ inline: i }) => ({
        display: i ? "inline-block" : "block",
    })),
}));

Box.displayName = "Box";

export { Box };

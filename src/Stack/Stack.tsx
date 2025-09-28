import { resolveResponsiveMerge, styled } from "@mutualzz/ui-core";
import type { BoxProps } from "../Box/Box.types";

/**
 * Stack component that uses BoxProps and sets the display property to flex or inline-flex.
 * It is used to create a flexible layout for arranging child elements.
 * The `inline` prop determines whether the Stack is displayed as an inline-flex or flex container
 */
const Stack = styled("div")<BoxProps>(({ theme, inline }) => ({
    ...resolveResponsiveMerge(theme, { inline }, ({ inline: i }) => ({
        display: i ? "inline-flex" : "flex",
    })),
}));

Stack.displayName = "Stack";

export { Stack };

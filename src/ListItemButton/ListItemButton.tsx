import type { Orientation, Responsive } from "@mutualzz/ui-core";
import { resolveResponsiveMerge, styled } from "@mutualzz/ui-core";
import { forwardRef, useContext } from "react";
import { DecoratorWrapper } from "../DecoratorWrapper/DecoratorWrapper";
import { ListContext } from "../List/List.context";
import { NestedListContext } from "../List/NestedList.context";
import {
    resolveListItemButtonContainerStyles,
    resolveListItemButtonSize,
} from "./ListItemButton.helpers";
import type { ListItemButtonProps } from "./ListItemButton.types";

export const ListItemButtonRoot = styled("button")<
    ListItemButtonProps & {
        nesting: number;
        orientation?: Responsive<Orientation>;
    }
>(({ theme, size = "md", color = "primary", variant = "solid" }) => ({
    width: "100%",
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 0,
    boxSizing: "border-box",
    cursor: "pointer",
    transition: "all 0.3s ease",
    gap: 4,
    ...resolveResponsiveMerge(
        theme,
        {
            color,
            variant,
            size,
        },
        ({ color: c, variant: v, size: s }) => ({
            ...resolveListItemButtonSize(theme, s),
            ...resolveListItemButtonContainerStyles(theme, c)[v],
            ...(v === "outlined" && {
                border: "none",
            }),
        }),
    ),
}));

const ListItemButtonContent = styled("span")({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 0,
    flexShrink: 0,
    width: "auto",
    height: "100%",
    opacity: 1,
    boxSizing: "border-box",
    transition: "all 0.3s ease",
});

const ListItemButton = forwardRef<HTMLButtonElement, ListItemButtonProps>(
    (props, ref) => {
        const nesting = useContext(NestedListContext);

        const { color, orientation, size, variant } = useContext(ListContext);
        const {
            children,
            startDecorator,
            endDecorator,
            color: colorOverride,
            size: sizeOverride,
            variant: variantOverride,
            ...rest
        } = props;

        return (
            <ListItemButtonRoot
                ref={ref}
                nesting={nesting}
                color={(colorOverride ?? color) as string}
                variant={variantOverride ?? variant}
                size={sizeOverride ?? size}
                orientation={orientation}
                {...rest}
            >
                {startDecorator && (
                    <DecoratorWrapper position="start">
                        {startDecorator}
                    </DecoratorWrapper>
                )}
                <ListItemButtonContent>{children}</ListItemButtonContent>
                {endDecorator && (
                    <DecoratorWrapper position="end">
                        {endDecorator}
                    </DecoratorWrapper>
                )}
            </ListItemButtonRoot>
        );
    },
);

ListItemButton.displayName = "ListItemButton";

export { ListItemButton };

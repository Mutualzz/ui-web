import { isCssMarker, resolveResponsiveMerge, styled } from "@mutualzz/ui-core";
import { forwardRef, useContext } from "react";
import { ListContext } from "./List.context";
import { resolveListStyles } from "./List.helpers";
import type { ListProps } from "./List.types";
import { NestedListContext } from "./NestedList.context";

const ListRoot = styled("ul")<
    ListProps & { nesting: number; cssMarker?: boolean }
>(
    ({
        theme,
        color = "neutral",
        orientation = "vertical",
        variant = "plain",
        nesting = 0,
        marker,
        cssMarker,
    }) => ({
        display: cssMarker ? "block" : "flex",
        boxSizing: "border-box",
        margin: 0,
        padding: 0,
        width: "100%",

        flexGrow: 1,
        position: "relative",
        alignSelf: "flex-start",
        paddingLeft: nesting * 1.5 + "rem",
        listStyleType: isCssMarker(marker) ? marker : "none",
        ...resolveResponsiveMerge(
            theme,
            { color, variant, orientation },
            ({ color: c, variant: v, orientation: ori }) => ({
                ...resolveListStyles(theme, c)[v],
                flexDirection: ori === "horizontal" ? "row" : "column",
            }),
        ),
    }),
);

const List = forwardRef<HTMLUListElement, ListProps>(
    (
        { marker, children, orientation, color, variant, size, ...props },
        ref,
    ) => {
        const parentNesting = useContext(NestedListContext);

        const cssMarker = typeof marker === "string" && isCssMarker(marker);

        return (
            <ListContext.Provider
                value={{
                    color,
                    variant,
                    size,
                    orientation,
                    nesting: parentNesting + 1,
                    marker,
                }}
            >
                <ListRoot
                    {...(props as any)}
                    ref={ref}
                    nesting={parentNesting}
                    cssMarker={cssMarker}
                    orientation={orientation}
                >
                    {children}
                </ListRoot>
            </ListContext.Provider>
        );
    },
);

List.displayName = "List";

export { List };

import type { Orientation, Responsive } from "@mutualzz/ui-core";
import { isCssMarker, resolveResponsiveMerge, styled } from "@mutualzz/ui-core";
import { forwardRef, useContext } from "react";
import { ListContext } from "../List/List.context";
import { NestedListContext } from "../List/NestedList.context";
import { resolveListItemSize, resolveListItemStyles } from "./ListItem.helpers";
import type { ListItemProps } from "./ListItem.types";

const ListItemRoot = styled("li")<
    ListItemProps & {
        nesting: number;
        orientation?: Responsive<Orientation>;
    }
>(
    ({
        theme,
        variant = "plain",
        color = "neutral",
        size = "md",
        orientation = "vertical",
        marker,
    }) => ({
        alignItems: !isCssMarker(marker) ? "center" : undefined,
        position: "relative",
        paddingBlock: marker ? "0.5em" : undefined,
        listStylePosition: isCssMarker(marker) ? "inside" : undefined,
        listStyleType: isCssMarker(marker) ? marker : "none",
        boxSizing: "border-box",
        transition: "all 0.3s ease",

        ...resolveResponsiveMerge(
            theme,
            {
                color,
                variant,
                orientation,
                size,
            },
            ({ color: c, variant: v, orientation: ori, size: s }) => ({
                display: isCssMarker(marker)
                    ? ori === "vertical"
                        ? "list-item"
                        : "inline list-item"
                    : ori === "vertical"
                      ? "flex"
                      : "inline-flex",
                "::marker": {
                    ...resolveListItemStyles(theme, c)[v],
                },
                ...resolveListItemSize(theme, s),
                ...resolveListItemStyles(theme, c)[v],
            }),
        ),
    }),
);

const ListItem = forwardRef<HTMLLIElement, ListItemProps & { marker?: string }>(
    (props: ListItemProps & { marker?: string }, ref) => {
        const nesting = useContext(NestedListContext);
        const { marker, color, orientation, size, variant } =
            useContext(ListContext);
        const {
            children,
            startDecorator,
            endDecorator,
            color: colorOverride,
            marker: markerOverride,
            size: sizeOverride,
            variant: variantOverride,
            ...rest
        } = props;

        let markerToUse: string | undefined;
        if (markerOverride !== undefined) markerToUse = markerOverride;
        else if (typeof marker === "function") markerToUse = marker(nesting);
        else if (Array.isArray(marker))
            markerToUse = marker[nesting] ?? marker[marker.length - 1];
        else if (typeof marker === "string") markerToUse = marker;

        const shouldRenderCustomMarker =
            !isCssMarker(markerToUse) &&
            markerToUse !== undefined &&
            markerToUse !== "";

        return (
            <ListItemRoot
                ref={ref}
                nesting={nesting}
                color={(colorOverride ?? color) as string}
                variant={variantOverride ?? variant}
                size={sizeOverride ?? size}
                orientation={orientation}
                marker={markerToUse}
                {...rest}
            >
                {startDecorator}
                {shouldRenderCustomMarker && <span>{markerToUse}</span>}
                {children}
                {endDecorator}
            </ListItemRoot>
        );
    },
);

ListItem.displayName = "ListItem";

export { ListItem };

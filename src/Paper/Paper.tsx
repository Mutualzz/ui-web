import { resolveResponsiveMerge, styled } from "@mutualzz/ui-core";
import { resolvePaperStyles } from "./Paper.helpers";
import { type PaperProps } from "./Paper.types";

/**
 * Paper component is a versatile container that can be used to create surfaces with different styles.
 * If display is not specified, it defaults to flex display, otherwise it uses the specified display type.
 * The component supports different variants such as elevation, outlined, plain, solid, and soft.
 * It can also have different colors and text colors.
 * The elevation prop controls the shadow depth for the elevation variant and applies on elevation variant
 */
const Paper = styled("div")<PaperProps>(
    ({
        theme,
        display = "flex",
        variant = "elevation",
        elevation = 0,
        color = "neutral",
        textColor = "inherit",
        nonTranslucent = false,
    }) => ({
        transition: "background 0.2s ease",
        ...resolveResponsiveMerge(
            theme,
            {
                display,
                variant,
                elevation,
                color,
                textColor,
                nonTranslucent,
            },
            ({
                display: d,
                variant: v,
                elevation: e,
                color: c,
                textColor: tc,
                nonTranslucent: trans,
            }) => ({
                display: d,
                ...resolvePaperStyles(theme, c, tc, e, trans)[v],
            }),
        ),
    }),
);

Paper.displayName = "Paper";

export { Paper };

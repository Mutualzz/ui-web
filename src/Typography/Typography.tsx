import { resolveResponsiveMerge, styled } from "@mutualzz/ui-core";
import { resolveTypographStyles } from "./Typography.helpers";
import { type TypographyProps } from "./Typography.types";

/**
 * Typography component for displaying text with different styles.
 * It supports various levels, colors, variants, and weights.
 * The component can be used for headings, body text, captions, and more.
 */
const Typography = styled("span")<TypographyProps>(
    ({
        theme,
        level = "inherit",
        color = "primary",
        textColor = "primary",
        variant = "none",
        weight,
    }) => ({
        ...resolveResponsiveMerge(
            theme,
            {
                level,
                color,
                variant,
                weight,
                textColor,
            },
            ({ level: l, color: c, variant: v, weight: w, textColor: tc }) => ({
                ...(l !== "inherit" && theme.typography.levels[l]),
                ...resolveTypographStyles(theme, c, tc)[v],
                fontWeight: w,
            }),
        ),
        transition: "all 0.3s ease",
    }),
);

Typography.displayName = "Typography";

export { Typography };

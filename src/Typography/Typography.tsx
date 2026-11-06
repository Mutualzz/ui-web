import { resolveResponsiveMerge, styled } from "@mutualzz/ui-core";
import { resolveTypographStyles } from "./Typography.helpers";
import { type TypographyProps } from "./Typography.types";

/**
 * Typography component for displaying text with different styles.
 * It supports various levels, colors, variants, and weights.
 * The component can be used for headings, body text, captions, and more.
 */
const Typography = styled("span")<TypographyProps>(({
    theme,
    level = "inherit",
    color,
    textColor,
    variant = "none",
    weight,
}) => {
    const colorOnNone = color !== undefined && textColor === undefined;

    return {
        ...resolveResponsiveMerge(
            theme,
            {
                level,
                color: color ?? "primary",
                variant,
                weight,
                textColor: textColor ?? "primary",
            },
            ({ level: l, color: c, variant: v, weight: w, textColor: tc }) => ({
                ...(l !== "inherit" && theme.typography.levels[l]),
                ...resolveTypographStyles(theme, c, tc, colorOnNone)[v],
                fontWeight: w,
            }),
        ),
        transition: "all 0.3s ease",
    };
});

Typography.displayName = "Typography";

export { Typography };

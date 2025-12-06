import { resolveResponsiveMerge, styled } from "@mutualzz/ui-core";
import { forwardRef } from "react";
import { DecoratorWrapper } from "../DecoratorWrapper/DecoratorWrapper";
import { resolveTypographStyles } from "../Typography/Typography.helpers";
import type { LinkProps } from "./Link.types";

/**
 * Link component for displaying links with different styles.
 * It supports various levels, colors, variants, and weights.
 * The component can be used for headings, body text, captions, and more.
 */
const LinkWrapper = styled("a")<LinkProps>(
    ({
        theme,
        level = "inherit",
        color = "primary",
        textColor = "primary",
        variant = "none",
        underline = "hover",
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
                underline,
            },
            ({
                level: l,
                color: c,
                variant: v,
                weight: w,
                textColor: tc,
                underline: u,
            }) => ({
                ...(l === "inherit" ? {} : theme.typography.levels[l]),
                ...resolveTypographStyles(theme, c, tc)[v],
                fontWeight: w,
                ...(u === "always" && {
                    textDecoration: "underline",
                }),
                ...(u === "hover" && {
                    ":hover": {
                        textDecoration: "underline",
                    },
                }),
            }),
        ),
        cursor: "pointer",
        transition: "all 0.3s ease",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
    }),
);

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
    (
        {
            color = "primary",
            textColor = "primary",
            variant = "none",
            underline = "hover",
            startDecorator,
            endDecorator,
            children,
            ...props
        },
        ref,
    ) => {
        return (
            <LinkWrapper
                {...props}
                ref={ref}
                color={color as string}
                textColor={textColor}
                variant={variant}
                underline={underline}
            >
                {startDecorator && (
                    <DecoratorWrapper position="start">
                        {startDecorator}
                    </DecoratorWrapper>
                )}
                {children}
                {endDecorator && (
                    <DecoratorWrapper position="end">
                        {endDecorator}
                    </DecoratorWrapper>
                )}
            </LinkWrapper>
        );
    },
);

Link.displayName = "Link";

export { Link };

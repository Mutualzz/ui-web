import { resolveResponsiveMerge, styled } from "@mutualzz/ui-core";
import { forwardRef } from "react";
import {
    resolveAvatarShape,
    resolveAvatarSize,
    resolveAvatarStyles,
} from "./Avatar.helpers";
import type { AvatarProps } from "./Avatar.types";

const AvatarWrapper = styled("div")<AvatarProps & { hasText: boolean }>(
    ({
        theme,
        color = "neutral",
        variant = "plain",
        shape = "circle",
        size = "md",
        elevation = 1,
        hasText,
    }) => ({
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        transition:
            "background 0.2s ease, box-shadow 0.2s ease, border-radius 0.2s ease, color 0.2s ease",
        ...resolveResponsiveMerge(
            theme,
            {
                color,
                variant,
                size,
                shape,
                elevation,
            },
            ({ color: c, variant: v, size: s, shape: sp, elevation: e }) => ({
                ...resolveAvatarSize(theme, s, hasText),
                ...resolveAvatarShape(sp),
                ...resolveAvatarStyles(theme, c, hasText, e)[v],
            }),
        ),
    }),
);

const AvatarImage = styled("img")<AvatarProps>(() => ({
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "inherit",
}));

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
    (
        {
            src,
            alt,
            children,
            color = "neutral",
            shape = "circle",
            size = "md",
            variant = "plain",
            elevation = 1,
            ...props
        },
        ref,
    ) => {
        return (
            <AvatarWrapper
                {...props}
                ref={ref}
                color={color as string}
                shape={shape}
                size={size}
                variant={variant}
                elevation={elevation}
                hasText={!src && Boolean(children)}
                tabIndex={0}
            >
                {src ? (
                    <AvatarImage {...props} src={src} alt={alt} />
                ) : alt ? (
                    alt.split(" ").join("")
                ) : (
                    children
                )}
            </AvatarWrapper>
        );
    },
);

Avatar.displayName = "Avatar";

export { Avatar };

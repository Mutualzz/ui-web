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
        hasText,
    }) => ({
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        ...resolveResponsiveMerge(
            theme,
            {
                color,
                variant,
                size,
                shape,
            },
            ({ color: c, variant: v, size: s, shape: sp }) => ({
                ...resolveAvatarSize(theme, s, hasText),
                ...resolveAvatarShape(sp),
                ...resolveAvatarStyles(theme, c, hasText)[v],
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

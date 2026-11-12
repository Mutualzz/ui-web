import {
    resolveResponsiveMerge,
    resolveShapeValue,
    styled,
} from "@mutualzz/ui-core";
import { forwardRef, type KeyboardEvent, useEffect, useState } from "react";
import { resolveAvatarSize, resolveAvatarStyles } from "./Avatar.helpers";
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
                ...resolveAvatarStyles(theme, c, hasText, e)[v],
                borderRadius: resolveShapeValue(sp),
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

const getInitials = (text: string) =>
    text
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();

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
            loading,
            decoding,
            crossOrigin,
            referrerPolicy,
            srcSet,
            sizes,
            onLoad,
            onError,
            onClick,
            onKeyDown,
            ...props
        },
        ref,
    ) => {
        const [imageFailed, setImageFailed] = useState(false);

        useEffect(() => {
            setImageFailed(false);
        }, [src]);

        const showImage = Boolean(src) && !imageFailed;
        const fallbackContent = children ?? (alt ? getInitials(alt) : null);
        const isClickable = Boolean(onClick);

        const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
            onKeyDown?.(event);
            if (!isClickable || event.target !== event.currentTarget) return;
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.currentTarget.click();
            }
        };

        return (
            <AvatarWrapper
                {...props}
                ref={ref}
                color={color}
                shape={shape}
                size={size}
                variant={variant}
                elevation={elevation}
                hasText={!showImage && Boolean(fallbackContent)}
                role={isClickable ? "button" : props.role}
                tabIndex={isClickable ? 0 : props.tabIndex}
                aria-label={
                    isClickable
                        ? (props["aria-label"] ?? alt)
                        : props["aria-label"]
                }
                onClick={onClick}
                onKeyDown={handleKeyDown}
            >
                {showImage ? (
                    <AvatarImage
                        src={src}
                        alt={alt ?? ""}
                        loading={loading}
                        decoding={decoding}
                        crossOrigin={crossOrigin}
                        referrerPolicy={referrerPolicy}
                        srcSet={srcSet}
                        sizes={sizes}
                        onLoad={onLoad}
                        onError={(event) => {
                            setImageFailed(true);
                            onError?.(event);
                        }}
                    />
                ) : (
                    fallbackContent
                )}
            </AvatarWrapper>
        );
    },
);

Avatar.displayName = "Avatar";

export { Avatar };

import {
    mixTransparent,
    styled,
    themeColorVar,
    type SystemProps,
} from "@mutualzz/ui-core";
import { forwardRef } from "react";
import { pulse, shimmer } from "./Skeleton.keyframes";
import type {
    SkeletonAnimation,
    SkeletonProps,
    SkeletonVariant,
} from "./Skeleton.types";

const variantRadius: Record<SkeletonVariant, string | number> = {
    text: 4,
    circular: "50%",
    rectangular: 0,
    rounded: 8,
};

const SkeletonRoot = styled("span")<
    SystemProps<HTMLSpanElement> & {
        variant: SkeletonVariant;
        animation: SkeletonAnimation;
        hasChildren: boolean;
    }
>(({ variant, animation, hasChildren, height }) => ({
    display: "block",
    position: "relative",
    overflow: "hidden",
    flexShrink: 0,
    borderRadius: variantRadius[variant],
    backgroundColor: mixTransparent(themeColorVar("text"), 12),
    ...(variant === "text" &&
        !hasChildren &&
        height === undefined && {
            height: "0.8em",
            marginBlock: "0.2em",
        }),
    ...(hasChildren && { maxWidth: "fit-content" }),
    ...(animation === "pulse" && {
        animation: `${pulse} 1.6s ease-in-out 0.4s infinite`,
    }),
    ...(animation === "shimmer" && {
        "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            transform: "translateX(-100%)",
            background: `linear-gradient(90deg, transparent, ${mixTransparent(themeColorVar("text"), 10)}, transparent)`,
            animation: `${shimmer} 1.6s ease-in-out 0.4s infinite`,
        },
    }),
    "@media (prefers-reduced-motion: reduce)": {
        animation: "none",
        "&::after": { display: "none" },
    },
    "[data-reduced-motion] &": {
        animation: "none",
        "&::after": { display: "none" },
    },
}));

SkeletonRoot.displayName = "SkeletonRoot";

const SkeletonLines = styled("span")<SystemProps<HTMLSpanElement>>({
    display: "flex",
    flexDirection: "column",
});

SkeletonLines.displayName = "SkeletonLines";

const HiddenContent = styled("span")({
    display: "contents",
    visibility: "hidden",
});

HiddenContent.displayName = "HiddenContent";

const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(
    (
        {
            variant = "text",
            animation = "shimmer",
            size,
            lines = 1,
            loading = true,
            width,
            height,
            children,
            ...props
        },
        ref,
    ) => {
        if (!loading) return <>{children}</>;

        const hasChildren = children !== undefined && children !== null;

        if (lines > 1 && !hasChildren) {
            return (
                <SkeletonLines
                    ref={ref}
                    aria-hidden="true"
                    width={width}
                    {...props}
                >
                    {Array.from({ length: lines }, (_line, index) => (
                        <SkeletonRoot
                            key={index}
                            variant="text"
                            animation={animation}
                            hasChildren={false}
                            width={index === lines - 1 ? "60%" : undefined}
                        />
                    ))}
                </SkeletonLines>
            );
        }

        return (
            <SkeletonRoot
                ref={ref}
                aria-hidden="true"
                variant={variant}
                animation={animation}
                hasChildren={hasChildren}
                width={width ?? size}
                height={height ?? size}
                {...props}
            >
                {hasChildren && <HiddenContent>{children}</HiddenContent>}
            </SkeletonRoot>
        );
    },
);

Skeleton.displayName = "Skeleton";

export { Skeleton };

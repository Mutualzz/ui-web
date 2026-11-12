import type { SystemProps } from "@mutualzz/ui-core";
import type { ReactNode } from "react";

export type SkeletonVariant = "text" | "circular" | "rectangular" | "rounded";

export type SkeletonAnimation = "shimmer" | "pulse" | "none";

export interface SkeletonProps extends SystemProps<HTMLSpanElement> {
    variant?: SkeletonVariant;
    animation?: SkeletonAnimation;
    size?: number | string;
    lines?: number;
    loading?: boolean;
    children?: ReactNode;
}

import type {
    Color,
    ColorLike,
    Responsive,
    Size,
    Variant,
} from "@mutualzz/ui-core";
import {
    resolveColor,
    resolveResponsiveMerge,
    resolveSize,
    styled,
} from "@mutualzz/ui-core";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useTheme } from "../useTheme";
import {
    baseSizeMap,
    resolveCircularProgressOuterStroke,
    resolveCircularProgressSize,
} from "./CircularProgress.helpers";
import { spin } from "./CircularProgress.keyframes";
import type { CircularProgressProps } from "./CircularProgress.types";

const CircularProgressWrapper = styled("div")<{
    diameter: number;
    strokeWidth: number;
    color: Responsive<Color | ColorLike>;
    variant: Responsive<Variant>;
}>(({ theme, color, diameter, strokeWidth, variant }) => ({
    position: "relative" as const,
    display: "inline-flex",
    width: diameter,
    height: diameter,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    transition: "all 0.3s ease",

    ...resolveResponsiveMerge(theme, { color }, ({ color: c }) => ({
        ...(variant === "outlined" &&
            diameter > 0 && {
                "::before": {
                    content: '""',
                    position: "absolute",
                    top: strokeWidth / 2,
                    left: strokeWidth / 2,
                    right: strokeWidth / 2,
                    bottom: strokeWidth / 2,
                    borderRadius: "50%",
                    border: `1px solid ${resolveColor(c, theme)}`,
                    boxSizing: "border-box",
                },
                "::after": {
                    content: '""',
                    position: "absolute",
                    top: -1,
                    left: -1,
                    right: -1,
                    bottom: -1,
                    borderRadius: "50%",
                    border: `1px solid ${resolveColor(c, theme)}`,
                    boxSizing: "border-box",
                },
            }),
    })),
}));

const CircularProgressContent = styled("div")({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    padding: 8,
    transition: "all 0.3s ease",
});

const CircularProgressSvg = styled("svg")<{
    diameter: number;
    determinate: boolean;
}>(({ diameter, determinate }) => ({
    position: "absolute",
    width: diameter,
    height: diameter,
    top: 0,
    left: 0,
    transition: "all 0.3s ease",
    ...(!determinate && {
        animation: `${spin} 1s linear infinite`,
    }),
}));

const CircularProgressCircleOuter = styled("circle")<{
    color: Responsive<Color | ColorLike>;
    variant: Responsive<Variant>;
    strokeWidth: number;
}>(({ theme, color, strokeWidth, variant }) => ({
    fill: "none",
    strokeWidth,

    ...resolveResponsiveMerge(
        theme,
        { color, variant },
        ({ color: c, variant: v }) => ({
            ...resolveCircularProgressOuterStroke(theme, c)[v],
        }),
    ),
}));

const CircularProgressCircleInner = styled("circle")<{
    color: Responsive<Color | ColorLike>;
    strokeWidth: number;
    determinate: boolean;
    circumference: number;
    dashOffset: number;
}>(({ theme, circumference, determinate, dashOffset, color, strokeWidth }) => ({
    transform: "rotate(-90deg)",
    transformOrigin: "center",
    fill: "none",
    strokeLinecap: "round",
    transition:
        "stroke-dasharray 0.3s ease, stroke-dashoffset 0.3s ease, transform 0.3s ease",

    strokeWidth,
    strokeDashoffset: determinate ? dashOffset : 0,
    strokeDasharray: determinate
        ? circumference
        : `${circumference * 0.25} ${circumference}`,

    ...resolveResponsiveMerge(theme, { color }, ({ color: c }) => ({
        stroke: resolveColor(c, theme),
    })),
}));

const strokeWidthSizeMap: Record<Size, number> = {
    sm: 2,
    md: 4,
    lg: 6,
};

/**
 * CircularProgress component that renders a circular progress indicator.
 * It supports both determinate and indeterminate states, with customizable size, variant, and color.
 * The component can display children content inside the circular progress.
 * It uses SVG for rendering the progress circle and applies styles based on the provided props.
 */
const CircularProgress = forwardRef<HTMLDivElement, CircularProgressProps>(
    (
        {
            size = "md",
            variant = "soft",
            color = "primary",
            determinate = false,
            strokeWidth: strokeWidthProp,
            value = 0,
            children,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();
        const contentRef = useRef<HTMLDivElement>(null);
        const [contentDiameter, setContentDiameter] = useState(0);

        useEffect(() => {
            if (!contentRef.current) return;
            const handleResize = (entry: ResizeObserverEntry) => {
                const { width, height } = entry.contentRect;
                setContentDiameter(Math.max(width, height));
            };

            const ro = new ResizeObserver((entries) => {
                if (entries[0]) handleResize(entries[0]);
            });
            ro.observe(contentRef.current);
            return () => {
                ro.disconnect();
            };
        }, []);

        const { size: resolvedSize, strokeWidth: resolvedStrokeWidth } =
            resolveResponsiveMerge(
                theme,
                {
                    size,
                    strokeWidth: strokeWidthProp,
                },
                ({ size: s, strokeWidth = "md" }) => ({
                    size: resolveSize(theme, s, baseSizeMap),
                    strokeWidth: resolveSize(
                        theme,
                        strokeWidth,
                        strokeWidthSizeMap,
                    ),
                }),
            );

        const baseDiameter = resolveCircularProgressSize(theme, resolvedSize);
        const strokeWidth = strokeWidthProp
            ? resolveSize(theme, resolvedStrokeWidth, strokeWidthSizeMap)
            : Math.max(2, baseDiameter * 0.1);

        const diameter = contentDiameter
            ? contentDiameter + strokeWidth + 8 * 2
            : baseDiameter;

        const radius = (diameter - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const dashOffset = ((100 - value) / 100) * circumference;

        return (
            <CircularProgressWrapper
                ref={ref}
                diameter={diameter}
                strokeWidth={strokeWidth}
                variant={variant}
                color={color as string}
            >
                <CircularProgressContent ref={contentRef}>
                    {children}
                </CircularProgressContent>

                {diameter > 0 && (
                    <CircularProgressSvg
                        {...props}
                        role="progressbar"
                        diameter={diameter}
                        determinate={determinate}
                        viewBox={`0 0 ${diameter} ${diameter}`}
                    >
                        <CircularProgressCircleOuter
                            variant={variant}
                            color={color as string}
                            strokeWidth={strokeWidth}
                            cx={diameter / 2}
                            cy={diameter / 2}
                            r={radius}
                        />
                        <CircularProgressCircleInner
                            color={color as string}
                            strokeWidth={strokeWidth}
                            determinate={determinate}
                            circumference={circumference}
                            dashOffset={dashOffset}
                            cx={diameter / 2}
                            cy={diameter / 2}
                            r={radius}
                        />
                    </CircularProgressSvg>
                )}
            </CircularProgressWrapper>
        );
    },
);

CircularProgress.displayName = "CircularProgress";

export { CircularProgress };

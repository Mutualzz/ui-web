import type { Variant } from "@mutualzz/ui-core";
import {
    resolveColorTokens,
    resolveResponsiveMerge,
    styled,
} from "@mutualzz/ui-core";
import { forwardRef } from "react";
import { useTheme } from "../useTheme";
import {
    resolveLinearProgressLength,
    resolveLinearProgressStyles,
    resolveLinearProgressThickness,
} from "./LinearProgress.helpers";
import {
    bounce,
    breathe,
    scaleInOut,
    slide,
    wave,
} from "./LinearProgress.keyframes";
import type { LinearProgressProps } from "./LinearProgress.types";

const LinearProgressWrapper = styled("div")<{
    width: string | number;
    height: string | number;
    background: string;
    outlinedColor: string;
    variant: Variant;
}>(({ width, height, background, outlinedColor, variant }) => ({
    position: "relative",
    width,
    height,
    background,
    borderRadius: "0.5rem",
    overflow: "hidden",
    transition: "all 0.3s ease",
    ...(variant === "outlined" && { border: `1px solid ${outlinedColor}` }),
}));

LinearProgressWrapper.displayName = "LinearProgressWrapper";

const DeterminateBar = styled("div")<{
    barColor: string;
    value: number;
}>(({ barColor, value }) => ({
    width: `${Math.min(Math.max(value, 0), 100)}%`,
    height: "100%",
    background: barColor,
    transition: "all 0.3s ease",
}));

DeterminateBar.displayName = "DeterminateBar";

const IndeterminateBar = styled("div")<{
    barColor: string;
    animation: LinearProgressProps["animation"];
}>(({ barColor, animation }) => {
    const reducedMotionStyles = {
        left: 0,
        width: "100%",
        transform: "none",
        animation: `${breathe} 2s ease-in-out infinite`,
    };

    return {
        height: "100%",
        background: barColor,
        position: "absolute",
        transition: "all 0.3s ease",
        ...resolveIndeterminateAnimation(animation),
        "@media (prefers-reduced-motion: reduce)": reducedMotionStyles,
        "[data-reduced-motion] &": reducedMotionStyles,
    };
});

const resolveIndeterminateAnimation = (
    animation: LinearProgressProps["animation"],
) => {
    switch (animation) {
        case "slide":
            return {
                width: "40%",
                animation: `${slide} 1.5s infinite ease-in-out`,
            };
        case "wave":
            return {
                width: "100%",
                animation: `${wave} 1.5s infinite ease-in-out`,
            };
        case "scale-in-out":
            return {
                width: "100%",
                animation: `${scaleInOut} 1.5s infinite ease-in-out`,
            };
        case "bounce":
        default:
            return {
                width: "30%",
                animation: `${bounce} 1.5s infinite ease-in-out`,
            };
    }
};

IndeterminateBar.displayName = "IndeterminateBar";

/**
 * LinearProgress component for displaying progress.
 * It supports both determinate and indeterminate states.
 * The determinate state shows a progress bar that fills based on a value.
 * The indeterminate state shows an animated bar that indicates ongoing progress.
 * The component can be styled with different thicknesses, lengths, variants, and colors.
 */
const LinearProgress = forwardRef<HTMLDivElement, LinearProgressProps>(
    (
        {
            thickness = "md",
            length = "md",
            variant = "soft",
            color = "primary",
            animation = "bounce",
            determinate = false,
            value = 0,
            "aria-label": ariaLabel,
            "aria-labelledby": ariaLabelledBy,
        },
        ref,
    ) => {
        const { theme } = useTheme();

        const {
            thickness: height,
            length: width,
            background,
            sharedColor,
            variant: resolvedVariant,
        } = resolveResponsiveMerge(
            theme,
            {
                thickness,
                length,
                color,
                variant,
            },
            ({ thickness: t, length: l, color: c, variant: v }) => ({
                thickness: resolveLinearProgressThickness(theme, t),
                length: resolveLinearProgressLength(theme, l),
                background: resolveLinearProgressStyles(theme, c)[v],
                sharedColor: resolveColorTokens(c, theme).base,
                variant: v,
            }),
        );

        return (
            <LinearProgressWrapper
                ref={ref}
                width={width}
                height={height}
                background={background}
                outlinedColor={sharedColor}
                variant={resolvedVariant}
                role="progressbar"
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                aria-valuemin={determinate ? 0 : undefined}
                aria-valuemax={determinate ? 100 : undefined}
                aria-valuenow={
                    determinate ? Math.min(Math.max(value, 0), 100) : undefined
                }
            >
                {determinate ? (
                    <DeterminateBar barColor={sharedColor} value={value} />
                ) : (
                    <IndeterminateBar
                        data-motion="essential"
                        barColor={sharedColor}
                        animation={animation}
                    />
                )}
            </LinearProgressWrapper>
        );
    },
);

LinearProgress.displayName = "LinearProgress";

export { LinearProgress };

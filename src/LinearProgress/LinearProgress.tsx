import type { Variant } from "@mutualzz/ui-core";
import {
    resolveColor,
    resolveResponsiveMerge,
    styled,
    useTheme,
} from "@mutualzz/ui-core";
import { forwardRef } from "react";
import {
    resolveLinearProgressLength,
    resolveLinearProgressStyles,
    resolveLinearProgressThickness,
} from "./LinearProgress.helpers";
import { bounce, scaleInOut, slide, wave } from "./LinearProgress.keyframes";
import type { LinearProgressProps } from "./LinearProgress.types";

const LinearProgressWrapper = styled("div")<{
    width: string | number;
    height: string | number;
    background: string;
    outlinedColor: string;
    variant: Variant;
}>(({ width, background, outlinedColor, variant }) => ({
    position: "relative",
    width,
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
    const base: Record<string, any> = {
        height: "100%",
        background: barColor,
        position: "absolute",
        transition: "all 0.3s ease",
    };

    switch (animation) {
        case "bounce":
            return {
                ...base,
                width: "30%",
                animation: `${bounce} 1.5s infinite ease-in-out`,
            };
        case "slide":
            return {
                ...base,
                width: "40%",
                animation: `${slide} 1.5s infinite ease-in-out`,
            };
        case "wave":
            return {
                ...base,
                width: "100%",
                animation: `${wave} 1.5s infinite ease-in-out`,
            };
        case "scale-in-out":
            return {
                ...base,
                width: "100%",
                animation: `${scaleInOut} 1.5s infinite ease-in-out`,
            };
    }
});

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
                sharedColor: resolveColor(c, theme),
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
            >
                {determinate ? (
                    <DeterminateBar barColor={sharedColor} value={value} />
                ) : (
                    <IndeterminateBar
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

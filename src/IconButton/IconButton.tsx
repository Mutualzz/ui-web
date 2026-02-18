import {
    resolveResponsiveMerge,
    resolveShapeValue,
    resolveSize,
    type Size,
    styled,
} from "@mutualzz/ui-core";
import { forwardRef, useContext } from "react";
import { ButtonGroupContext } from "../ButtonGroup/ButtonGroup.context";
import { CircularProgress } from "../CircularProgress/CircularProgress";
import {
    resolveIconButtonContainerStyles,
    resolveIconButtonTextStyles,
} from "./IconButton.helpers";
import { type IconButtonProps } from "./IconButton.types";

const baseSizeMap: Record<Size, number> = {
    sm: 16,
    md: 20,
    lg: 24,
};

const IconButtonWrapper = styled("button")<IconButtonProps>(
    ({
        disabled,
        size = "md",
        theme,
        color = "primary",
        variant = "solid",
        shape = "rounded",
        padding,
    }) => ({
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        borderRadius: "6px",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.3s ease",
        whiteSpace: "nowrap",
        flexShrink: 0,
        lineHeight: 1.2,
        padding,
        ...(disabled && {
            opacity: 0.5,
            pointerEvents: "none",
        }),
        ...resolveResponsiveMerge(
            theme,
            { size, color, variant, shape },
            ({ size: s, color: c, variant: v, shape: sp }) => {
                const resolvedSize = resolveSize(theme, s, baseSizeMap);

                return {
                    fontSize: resolvedSize,
                    borderRadius: resolveShapeValue(sp),
                    ...resolveIconButtonContainerStyles(theme, c)[v],
                };
            },
        ),
    }),
);

IconButtonWrapper.displayName = "IconButtonWrapper";

const IconButtonContent = styled("span")<IconButtonProps>(
    ({
        theme,
        color = "primary",
        variant = "plain",
        size = "md",
        loading,
    }) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 0,
        flexShrink: 0,
        width: "auto",
        height: "100%",
        opacity: loading ? 0 : 1,
        boxSizing: "border-box",
        ...resolveResponsiveMerge(
            theme,
            { size, color, variant },
            ({ size: s, color: c, variant: v }) => {
                const resolvedSize = resolveSize(theme, s, baseSizeMap);

                return {
                    fontSize: resolvedSize,
                    ...resolveIconButtonTextStyles(theme, c)[v],
                };
            },
        ),
    }),
);

IconButtonContent.displayName = "IconButtonContent";

const SpinnerOverlay = styled("span")({
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
});

SpinnerOverlay.displayName = "SpinnerOverlay";

/**
 * IconButton component that renders a styled icon button element with various properties.
 * It supports different variants, colors, sizes, and loading states.
 * The button can also include start and end decorators for additional content.
 */
const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    (
        {
            variant: propVariant,
            color: propColor,
            size: propSize,
            loading: propLoading,
            loadingIndicator,
            disabled: propDisabled,
            children,
            shape: propShape,
            padding = "0.25rem",
            type = "button",
            ...props
        },
        ref,
    ) => {
        const group = useContext(ButtonGroupContext);

        const variant = propVariant ?? group?.variant ?? "solid";
        const color = propColor ?? group?.color ?? "primary";
        const size = propSize ?? group?.size ?? "md";
        const loading = propLoading ?? group?.loading ?? false;
        const disabled = propDisabled ?? group?.disabled ?? false;
        const shape = propShape ?? group?.shape ?? "circle";

        return (
            <IconButtonWrapper
                {...props}
                type={type}
                ref={ref}
                variant={variant}
                color={color as string}
                size={size}
                disabled={loading || disabled}
                padding={padding}
                loading={loading}
                shape={shape}
            >
                {loading && (
                    <SpinnerOverlay>
                        {loadingIndicator ? (
                            loadingIndicator
                        ) : (
                            <CircularProgress
                                variant={
                                    variant === "solid" || variant === "soft"
                                        ? "plain"
                                        : "soft"
                                }
                                color={color}
                                size="sm"
                            />
                        )}
                    </SpinnerOverlay>
                )}
                <IconButtonContent
                    color={color as string}
                    variant={variant}
                    size={size}
                    loading={Boolean(loading)}
                >
                    {children}
                </IconButtonContent>
            </IconButtonWrapper>
        );
    },
);

IconButton.displayName = "Button";

export { IconButton };

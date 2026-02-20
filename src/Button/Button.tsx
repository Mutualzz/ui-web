import React, { forwardRef, useContext } from "react";
import { resolveResponsiveMerge, resolveShapeValue, resolveSize, type Size, styled, } from "@mutualzz/ui-core";
import { ButtonGroupContext } from "../ButtonGroup/ButtonGroup.context";
import { CircularProgress } from "../CircularProgress/CircularProgress";
import { DecoratorWrapper } from "../DecoratorWrapper/DecoratorWrapper";
import { resolveButtonContainerSize, resolveButtonContainerStyles, resolveButtonTextStyles, } from "./Button.helpers";
import { type ButtonProps } from "./Button.types";

const baseSizeMap: Record<Size, number> = {
    sm: 12,
    md: 14,
    lg: 16,
};

const ButtonWrapper = styled("button")<ButtonProps>(
    ({
        disabled,
        size = "md",
        theme,
        color = "primary",
        variant = "solid",
        verticalAlign = "center",
        horizontalAlign = "center",
        fullWidth,
        selected,
        shape = "rounded",
        textColor,
        padding,
    }) => ({
        position: "relative",
        display: "flex",
        boxSizing: "border-box",
        borderRadius: 12,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.3s ease",
        whiteSpace: "nowrap",
        flexShrink: 0,
        lineHeight: 1,
        flex: fullWidth ? "1 1 0%" : "0 0 auto",
        minWidth: 0,
        ...(disabled && {
            opacity: 0.5,
        }),
        ...resolveResponsiveMerge(
            theme,
            {
                size,
                color,
                variant,
                verticalAlign,
                horizontalAlign,
                padding,
                shape,
                textColor,
            },
            ({
                size: s,
                color: c,
                variant: v,
                verticalAlign: va,
                horizontalAlign: ha,
                padding: p,
                shape: sp,
                textColor: tc,
            }) => ({
                ...resolveButtonContainerSize(theme, s, p),
                ...resolveButtonContainerStyles(
                    theme,
                    c,
                    tc,
                    disabled,
                    selected,
                )[v],
                borderRadius: resolveShapeValue(sp),
                alignItems:
                    va === "top"
                        ? "flex-start"
                        : va === "bottom"
                          ? "flex-end"
                          : "center",
                justifyContent: fullWidth
                    ? ha === "left"
                        ? "flex-start"
                        : ha === "right"
                          ? "flex-end"
                          : "center"
                    : ha === "left"
                      ? "flex-start"
                      : ha === "right"
                        ? "flex-end"
                        : "space-between",
            }),
        ),
    }),
);

ButtonWrapper.displayName = "ButtonWrapper";

const ButtonContent = styled("span")<ButtonProps>(
    ({
        theme,
        color = "primary",
        variant = "solid",
        size = "md",
        horizontalAlign = "center",
        verticalAlign = "center",
        textColor,
        loading,
    }) => ({
        flex: "1 1 0%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 0,
        opacity: loading ? 0 : 1,
        boxSizing: "border-box",
        ...resolveResponsiveMerge(
            theme,
            { size, color, variant, horizontalAlign, verticalAlign, textColor },
            ({
                size: s,
                color: c,
                variant: v,
                horizontalAlign: ha,
                verticalAlign: va,
                textColor: tc,
            }) => {
                const resolvedSize = resolveSize(theme, s, baseSizeMap);
                return {
                    fontSize: resolvedSize,
                    justifyContent:
                        ha === "left"
                            ? "flex-start"
                            : ha === "right"
                              ? "flex-end"
                              : "center",
                    alignItems:
                        va === "top"
                            ? "flex-start"
                            : va === "bottom"
                              ? "flex-end"
                              : "center",
                    ...resolveButtonTextStyles(theme, c, tc)[v],
                };
            },
        ),
    }),
);

ButtonContent.displayName = "ButtonContent";

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
 * Button component that renders a styled button element with various properties.
 * It supports different variants, colors, sizes, and loading states.
 * The button can also include start and end decorators for additional content.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant: propVariant,
            color: propColor,
            size: propSize,
            loading: propLoading,
            verticalAlign: propVerticalAlign,
            horizontalAlign: propHorizontalAlign,
            loadingIndicator,
            startDecorator,
            endDecorator,
            disabled: propDisabled,
            shape: propShape,
            padding,
            fullWidth: propFullWidth,
            children,
            selected: selectedProp,
            onClick: onClickProp,
            textColor: textColorProp,
            type = "button",
            ...props
        },
        ref,
    ) => {
        const group = useContext(ButtonGroupContext);

        const variant = propVariant ?? group?.variant ?? "solid";
        const color = propColor ?? group?.color ?? "primary";
        const size = propSize ?? group?.size ?? "md";
        const verticalAlign =
            propVerticalAlign ?? group?.verticalAlign ?? "center";
        const horizontalAlign =
            propHorizontalAlign ?? group?.horizontalAlign ?? "center";
        const loading = propLoading ?? group?.loading ?? false;
        const disabled = propDisabled ?? group?.disabled ?? false;
        const fullWidth = propFullWidth ?? group?.fullWidth ?? false;
        const shape = propShape ?? group?.shape ?? "rounded";
        const textColor = textColorProp ?? group?.textColor;

        const selected =
            selectedProp !== undefined
                ? selectedProp
                : group?.exclusive
                  ? group.value === props.value
                  : Array.isArray(group?.value) &&
                    group.value.includes(props.value);

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (
                group?.toggleable &&
                group.onChange &&
                props.value !== undefined
            ) {
                if (group.exclusive) {
                    group.onChange(props.value);
                } else {
                    // For multi-select, toggle value in array
                    const arr = Array.isArray(group.value) ? group.value : [];
                    const exists = arr.includes(props.value);
                    const newArr = exists
                        ? arr.filter((v: any) => v !== props.value)
                        : [...arr, props.value];
                    group.onChange(newArr);
                }
            }

            onClickProp?.(e);
        };

        return (
            <ButtonWrapper
                {...props}
                type={type}
                ref={ref}
                variant={variant}
                color={color as string}
                size={size}
                fullWidth={fullWidth}
                verticalAlign={verticalAlign}
                horizontalAlign={horizontalAlign}
                disabled={loading || disabled}
                loading={loading}
                onClick={handleClick}
                padding={padding}
                selected={selected}
                shape={shape}
                textColor={textColor}
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

                {startDecorator && (
                    <DecoratorWrapper position="start">
                        {startDecorator}
                    </DecoratorWrapper>
                )}
                <ButtonContent
                    color={color as string}
                    variant={variant}
                    size={size}
                    loading={Boolean(loading)}
                    horizontalAlign={horizontalAlign}
                    verticalAlign={verticalAlign}
                    textColor={textColor}
                >
                    {children}
                </ButtonContent>
                {endDecorator && (
                    <DecoratorWrapper position="end">
                        {endDecorator}
                    </DecoratorWrapper>
                )}
            </ButtonWrapper>
        );
    },
);

Button.displayName = "Button";

export { Button };

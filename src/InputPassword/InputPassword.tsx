import type { Size, SizeValue } from "@mutualzz/ui-core";
import { resolveResponsiveMerge, useTheme } from "@mutualzz/ui-core";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { DecoratorWrapper } from "../DecoratorWrapper/DecoratorWrapper";
import { InputBase } from "../InputBase/InputBase";
import { InputRoot } from "../InputRoot/InputRoot";
import { resolvePasswordIconStyles } from "./InputPassword.helpers";
import type { InputPasswordProps } from "./InputPassword.types";

interface IconProps {
    size: Size | SizeValue | number;
    strokeColor: string;
}

const ShowPasswordIcon = ({ size, strokeColor }: IconProps) => (
    <svg
        width={size === "sm" ? 14 : size === "md" ? 16 : 20}
        height={size === "sm" ? 14 : size === "md" ? 16 : 20}
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={2}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
        <circle cx={12} cy={12} r={3} />
    </svg>
);

const HidePasswordIcon = ({ size, strokeColor }: IconProps) => (
    <svg
        width={size === "sm" ? 14 : size === "md" ? 16 : 20}
        height={size === "sm" ? 14 : size === "md" ? 16 : 20}
        viewBox="0 0 24 24"
        fill="none"
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a20.3 20.3 0 0 1 5.09-5.91M10.58 10.58A3 3 0 0 0 13.41 13.41M9.88 3.88A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a20.3 20.3 0 0 1-4.38 4.38M1 1l22 22" />
    </svg>
);

/**
 * InputPassword component for entering passwords.
 * It includes a toggle button to show or hide the password.
 * It supports various styles, sizes, and states.
 * The component can display start and end decorators for additional content.
 * The password visibility can be toggled with a button that changes its icon based on the visibility state.
 */
const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
    (
        {
            color = "neutral",
            textColor = "inherit",
            variant = "outlined",
            size = "md",
            startDecorator,
            endDecorator,
            fullWidth = false,
            error = false,
            disabled = false,
            iconVisible = true,
            showPasswordIcon,
            hidePasswordIcon,
            onTogglePassword,
            onShowPassword,
            onHidePassword,
            visible: visibleProp,
            children,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();
        const [visibleInternal, setVisibleInternal] = useState(false);

        const isControlled = visibleProp !== undefined;

        const visible = isControlled ? visibleProp : visibleInternal;

        useEffect(() => {
            if (visible) onShowPassword?.();
            else onHidePassword?.();
        }, [visible]);

        const togglePassword = useCallback(() => {
            if (isControlled) {
                // If controlled, notify parent only
                onTogglePassword?.(!visible);
            } else {
                // If uncontrolled, update internal state and notify parent
                setVisibleInternal((prev) => {
                    const newVisible = !prev;
                    onTogglePassword?.(newVisible);
                    return newVisible;
                });
            }
        }, [isControlled, visible]);

        const showToggleIcon =
            iconVisible && !(endDecorator && !showPasswordIcon);

        let strokeColor = "currentColor";
        const { strokeColor: strokeColorResolved, s: resolvedSize } =
            resolveResponsiveMerge(
                theme,
                { color, variant, size },
                ({ color: c, variant: v, size: s }) => ({
                    strokeColor: resolvePasswordIconStyles(theme, c)[v],
                    s,
                }),
            );
        if (iconVisible && (!showPasswordIcon || !hidePasswordIcon)) {
            strokeColor = strokeColorResolved;
        }

        return (
            <InputRoot
                color={color as string}
                textColor={textColor}
                variant={variant}
                size={size}
                fullWidth={fullWidth}
                error={error}
                disabled={disabled}
            >
                {startDecorator && (
                    <DecoratorWrapper>{startDecorator}</DecoratorWrapper>
                )}

                <InputBase
                    {...props}
                    ref={ref}
                    type={visible ? "text" : "password"}
                />

                {endDecorator ? (
                    <DecoratorWrapper>{endDecorator}</DecoratorWrapper>
                ) : showToggleIcon ? (
                    <DecoratorWrapper
                        onClick={togglePassword}
                        css={{ cursor: "pointer", userSelect: "none" }}
                    >
                        {visible
                            ? (hidePasswordIcon ?? (
                                  <HidePasswordIcon
                                      size={resolvedSize}
                                      strokeColor={strokeColor}
                                  />
                              ))
                            : (showPasswordIcon ?? (
                                  <ShowPasswordIcon
                                      size={resolvedSize}
                                      strokeColor={strokeColor}
                                  />
                              ))}
                    </DecoratorWrapper>
                ) : null}
            </InputRoot>
        );
    },
);

InputPassword.displayName = "InputPassword";

export { InputPassword };

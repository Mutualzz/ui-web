import {
    clamp,
    formatColor,
    resolveResponsiveMerge,
    resolveSize,
} from "@mutualzz/ui-core";
import {
    forwardRef,
    useImperativeHandle,
    useRef,
    type ChangeEvent,
    type ClipboardEvent,
    type FocusEvent,
    type KeyboardEvent,
} from "react";
import { DecoratorWrapper } from "../DecoratorWrapper/DecoratorWrapper";
import { InputBase } from "../InputBase/InputBase";
import { baseSizeMap } from "../InputBase/InputBase.helpers";
import { InputRoot } from "../InputRoot/InputRoot";
import { Stack } from "../Stack/Stack";
import { useTheme } from "../useTheme";
import type { InputNumberProps } from "./InputNumber.types";
import { InputDecoratorWrapper } from "../InputDecoratorWrapper/InputDecoratorWrapper";

const SpinnerButtons = ({
    onIncrement,
    onDecrement,
    disabled,
    size = "md",
}: InputNumberProps) => {
    const { theme } = useTheme();

    const { resolvedSize } = resolveResponsiveMerge(
        theme,
        { size },
        ({ size: s }) => ({
            resolvedSize: resolveSize(theme, s, baseSizeMap),
        }),
    );

    const spinnerHeight = resolvedSize * 1.6;
    const spinnerWidth = resolvedSize * 1.2;
    const fontSize = resolvedSize * 0.8;

    return (
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            height={spinnerHeight}
            width={spinnerWidth}
            flexShrink={0}
            overflow="hidden"
            borderRadius={4}
            css={{
                marginInlineStart: 4,
            }}
        >
            <button
                type="button"
                onClick={onIncrement}
                disabled={disabled}
                aria-label="Increment"
                css={{
                    all: "unset",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "50%",
                    width: "100%",
                    fontSize,
                    lineHeight: 1,
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    "& svg": { width: 12, height: 12 },
                    "&:hover": {
                        backgroundColor: formatColor(theme.colors.surface, {
                            format: "hexa",
                        }),
                    },
                }}
            >
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="18 15 12 9 6 15" />
                </svg>
            </button>
            <button
                type="button"
                onClick={onDecrement}
                disabled={disabled}
                aria-label="Decrement"
                css={{
                    all: "unset",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "50%",
                    width: "100%",
                    fontSize,
                    lineHeight: 1,
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    "& svg": { width: 12, height: 12 },
                    "&:hover": {
                        backgroundColor: formatColor(theme.colors.surface, {
                            format: "hexa",
                        }),
                    },
                }}
            >
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>
        </Stack>
    );
};

SpinnerButtons.displayName = "SpinnerButtons";

/**
 * InputNumber component for entering numeric values.
 * It includes increment and decrement buttons for adjusting the value.
 * It supports various styles, sizes, and states.
 */
const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
    (
        {
            color = "neutral",
            textColor = "inherit",
            variant = "outlined",
            size = "md",
            inputMode = "decimal",
            fullWidth = false,
            error = false,
            disabled = false,
            step = 1,
            min = -Infinity,
            max = Infinity,
            onChange,
            onIncrement,
            onDecrement,
            startDecorator,
            endDecorator,
            children,
            ...props
        },
        ref,
    ) => {
        const inputRef = useRef<HTMLInputElement>(null);
        useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
            const { key, ctrlKey, metaKey, currentTarget } = e;
            const cursorPos = currentTarget.selectionStart ?? 0;
            const { value } = currentTarget;

            const allowedModifierKeys = [
                "Backspace",
                "Delete",
                "Tab",
                "Escape",
                "Enter",
                "ArrowLeft",
                "ArrowRight",
                "ArrowUp",
                "ArrowDown",
                "Home",
                "End",
            ];

            if (key === "ArrowUp") {
                handleStepChange("up");
                e.preventDefault();
                return;
            }

            if (key === "ArrowDown") {
                handleStepChange("down");
                e.preventDefault();
                return;
            }

            if (
                allowedModifierKeys.includes(key) ||
                /^\d$/.test(key) ||
                ((ctrlKey || metaKey) &&
                    ["a", "c", "v", "x"].includes(key.toLowerCase()))
            )
                return;

            if (key === "-" && cursorPos === 0 && !value.includes("-")) return;
            if (key === "." && !value.includes(".")) return;

            e.preventDefault();
        };

        const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
            const input = e.currentTarget;
            const value = input.value;

            // Don't do anything if value is empty or invalid
            if (
                value === "" ||
                value === "-" ||
                value === "." ||
                value === "-."
            )
                return;

            const parsed = parseFloat(value);
            if (isNaN(parsed)) return;

            const clamped = clamp(parsed, min, max);
            if (parsed !== clamped) {
                input.value = String(clamped);
                input.dispatchEvent(new Event("input", { bubbles: true }));
            }
        };

        const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
            const pasted = e.clipboardData.getData("text").trim();
            if (!/^-?\d*\.?\d*$/.test(pasted)) {
                e.preventDefault();
                return;
            }

            const parsed = parseFloat(pasted);
            if (isNaN(parsed)) {
                e.preventDefault();
                return;
            }

            if (!isFinite(parsed) || parsed < min || parsed > max) {
                const clamped = clamp(parsed, min, max);
                inputRef.current!.value = String(clamped);
                e.preventDefault();
                inputRef.current!.dispatchEvent(
                    new Event("input", { bubbles: true }),
                );
            }
        };

        const handleStepChange = (direction: "up" | "down") => {
            if (!inputRef.current) return;
            const input = inputRef.current;
            const current = parseFloat(input.value) || 0;
            const delta = direction === "up" ? step : -step;
            const next = clamp(current + delta, min, max);

            const setter = Object.getOwnPropertyDescriptor(
                HTMLInputElement.prototype,
                "value",
            )?.set;
            setter?.call(input, String(next));
            input.dispatchEvent(new Event("input", { bubbles: true }));
        };

        const handleOnIncrement = () => {
            if (onIncrement) onIncrement();
            handleStepChange("up");
        };

        const handleOnDecrement = () => {
            if (onDecrement) onDecrement();
            handleStepChange("down");
        };

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            onChange?.(e);
        };

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
                    <InputDecoratorWrapper position="start">{startDecorator}</InputDecoratorWrapper>
                )}

                <InputBase
                    ref={inputRef}
                    {...props}
                    type="number"
                    inputMode={inputMode}
                    onChange={handleChange}
                    min={min}
                    max={max}
                    step={step}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    size={size as any}
                    fullWidth={fullWidth}
                    disabled={disabled}
                />

                <InputDecoratorWrapper position="end">
                    {endDecorator ?? (
                        <SpinnerButtons
                            size={size}
                            onIncrement={handleOnIncrement}
                            onDecrement={handleOnDecrement}
                            disabled={disabled}
                        />
                    )}
                </InputDecoratorWrapper>
            </InputRoot>
        );
    },
);

InputNumber.displayName = "InputNumber";

export { InputNumber };

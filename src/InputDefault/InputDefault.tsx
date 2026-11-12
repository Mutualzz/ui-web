import { forwardRef } from "react";
import { InputBase } from "../InputBase/InputBase";
import { InputDecoratorWrapper } from "../InputDecoratorWrapper/InputDecoratorWrapper";
import { InputRoot } from "../InputRoot/InputRoot";
import type { InputRootProps } from "../InputRoot/InputRoot.types";

/**
 * Input component for entering non-custom inputs.
 */
const InputDefault = forwardRef<HTMLInputElement, InputRootProps>(
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
            children,
            type = "text",
            className,
            style,
            ...props
        }: InputRootProps,
        ref,
    ) => (
        <InputRoot
            className={className}
            style={style}
            color={color}
            textColor={textColor}
            variant={variant}
            size={size}
            fullWidth={fullWidth}
            error={error}
            disabled={disabled}
        >
            {startDecorator && (
                <InputDecoratorWrapper position="start">
                    {startDecorator}
                </InputDecoratorWrapper>
            )}

            <InputBase
                {...props}
                size={size}
                fullWidth={fullWidth}
                disabled={disabled}
                aria-invalid={error || undefined}
                ref={ref}
                type={type}
            />

            {endDecorator && (
                <InputDecoratorWrapper position="end">
                    {endDecorator}
                </InputDecoratorWrapper>
            )}
        </InputRoot>
    ),
);

InputDefault.displayName = "InputDefault";

export { InputDefault };

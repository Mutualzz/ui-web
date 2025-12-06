import { forwardRef } from "react";
import { InputBase } from "../InputBase/InputBase";
import { InputRoot } from "../InputRoot/InputRoot";
import type { InputRootProps } from "../InputRoot/InputRoot.types";
import { InputDecoratorWrapper } from "../InputDecoratorWrapper/InputDecoratorWrapper";

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
            ...props
        }: InputRootProps,
        ref,
    ) => (
        <InputRoot
            color={color as string}
            textColor={textColor}
            variant={variant}
            size={size as number}
            fullWidth={fullWidth}
            error={error}
            disabled={disabled}
        >
            {startDecorator && (
                <InputDecoratorWrapper position="start">{startDecorator}</InputDecoratorWrapper>
            )}

            <InputBase
                {...props}
                size={size as any}
                fullWidth={fullWidth}
                ref={ref}
                type={type}
            />

            {endDecorator && (
                <InputDecoratorWrapper position="end">{endDecorator}</InputDecoratorWrapper>
            )}
        </InputRoot>
    ),
);

InputDefault.displayName = "InputDefault";

export { InputDefault };

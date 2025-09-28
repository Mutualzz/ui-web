import { forwardRef } from "react";
import { InputColor } from "../InputColor/InputColor";
import type { InputColorProps } from "../InputColor/InputColor.types";
import { InputDefault } from "../InputDefault/InputDefault";
import { InputNumber } from "../InputNumber/InputNumber";
import type { InputNumberProps } from "../InputNumber/InputNumber.types";
import { InputPassword } from "../InputPassword/InputPassword";
import type { InputPasswordProps } from "../InputPassword/InputPassword.types";
import type { InputRootProps } from "../InputRoot/InputRoot.types";
import type { InputProps } from "./Input.types";

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    switch (props.type) {
        case "color":
            return <InputColor ref={ref} {...(props as InputColorProps)} />;
        case "password":
            return (
                <InputPassword ref={ref} {...(props as InputPasswordProps)} />
            );
        case "number":
            return <InputNumber ref={ref} {...(props as InputNumberProps)} />;
        default:
            return <InputDefault ref={ref} {...(props as InputRootProps)} />;
    }
});

Input.displayName = "Input";

export { Input };

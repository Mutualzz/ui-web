import type { InputColorProps } from "../InputColor/InputColor.types";
import type { InputNumberProps } from "../InputNumber/InputNumber.types";
import type { InputPasswordProps } from "../InputPassword/InputPassword.types";
import type { InputRootProps } from "../InputRoot/InputRoot.types";

export type InputProps =
    | ({ type?: "color" } & InputColorProps)
    | ({ type?: "password" } & InputPasswordProps)
    | ({ type?: "number" } & InputNumberProps)
    | InputRootProps;

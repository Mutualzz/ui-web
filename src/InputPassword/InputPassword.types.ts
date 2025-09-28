import type { ReactNode } from "react";
import type { InputRootProps } from "../InputRoot/InputRoot.types";

export interface InputPasswordProps extends Omit<InputRootProps, "type"> {
    /**
     * The type of the input element.
     * Should always be "password" for password inputs.
     *
     * @readonly
     * @default "password"
     */
    type?: "password";

    /**
     * If true the password will be visible.
     * If false, the password will be hidden.
     *
     * @default false
     */
    visible?: boolean;
    /**
     * If true, the toggle password visibility icon will be shown.
     * If false, the icon will not be displayed.
     *
     * @default true
     */
    iconVisible?: boolean;

    /**
     * Optional icon to show when the password is visible.
     * This icon will be displayed when the password is in plain text.
     */
    showPasswordIcon?: ReactNode;
    /**
     * Optional icon to show when the password is hidden.
     * This icon will be displayed when the password is obscured.
     */
    hidePasswordIcon?: ReactNode;

    /**
     * Callback function to be called when the password visibility is toggled.
     * This function can be used to handle custom logic when the visibility changes.
     */
    onTogglePassword?: (visible?: boolean) => void;
    /**
     * Callback function to be called when the password is shown.
     * This function can be used to handle custom logic when the password is made visible.
     */
    onShowPassword?: (visible?: boolean) => void;
    /**
     * Callback function to be called when the password is hidden.
     * This function can be used to handle custom logic when the password is obscured.
     */
    onHidePassword?: (visible?: boolean) => void;
}

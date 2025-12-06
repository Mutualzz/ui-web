import { resolveResponsiveMerge, styled } from "@mutualzz/ui-core";
import { resolveInputBaseSize } from "./InputBase.helpers";
import type { InputBaseProps } from "./InputBase.props";

const InputBase = styled("input")<InputBaseProps>(
    ({ theme, size, fullWidth }) => ({
        ...resolveResponsiveMerge(
            theme,
            { size, fullWidth },
            ({ size: s, fullWidth: fw }) => ({
                ...resolveInputBaseSize(theme, s, fw),
            }),
        ),

        maxWidth: "100%",
        paddingBlock: 0,
        marginTop: 1,

        color: "inherit",

        border: "none",
        outline: "none",
        background: "transparent",
        display: "block",
        width: fullWidth ? "100%" : "auto",
        minWidth: 0,
        height: "100%",
        boxSizing: "border-box",
        verticalAlign: "middle",

        "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
        },
        "&[type='number']": {
            MozAppearance: "textfield",
        },
    }),
);

InputBase.displayName = "InputBase";

export { InputBase };

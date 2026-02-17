import {
    resolveResponsiveMerge,
    resolveShapeValue,
    styled,
} from "@mutualzz/ui-core";
import { resolveInputBaseSize } from "./InputBase.helpers";
import type { InputBaseProps } from "./InputBase.props";

const InputBase = styled("input")<InputBaseProps>(
    ({ theme, size, fullWidth, shape = "rounded" }) => ({
        ...resolveResponsiveMerge(
            theme,
            { size, fullWidth, shape },
            ({ size: s, fullWidth: fw, shape: sp }) => ({
                ...resolveInputBaseSize(theme, s, fw),
                borderRadius: resolveShapeValue(sp),
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
        width: "100%",
        minWidth: 0,
        height: "100%",
        boxSizing: "border-box",
        verticalAlign: "middle",
        flexGrow: 1,

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

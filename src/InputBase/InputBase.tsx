import { styled } from "@mutualzz/ui-core";

const InputBase = styled("input")({
    flex: 1,
    minWidth: 0,
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "inherit",
    font: "inherit",
    padding: 0,

    "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
        WebkitAppearance: "none",
        margin: 0,
    },
    "&[type='number']": {
        MozAppearance: "textfield",
    },
});

InputBase.displayName = "InputBase";

export { InputBase };

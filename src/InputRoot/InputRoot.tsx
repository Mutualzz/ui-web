import { resolveResponsiveMerge, styled } from "@mutualzz/ui-core";
import { resolveInputRootStyles } from "./InputRoot.helpers";
import type { InputRootProps } from "./InputRoot.types";

const InputRoot = styled("div")<InputRootProps>(
    ({
        theme,
        color = "neutral",
        textColor = "inherit",
        size = "md",
        variant = "outlined",
        error = false,
        fullWidth,
        disabled,
    }) => ({
        ...resolveResponsiveMerge(
            theme,
            { color, textColor, size, variant, fullWidth },
            ({ color: c, textColor: tc, variant: v }) => ({
                ...resolveInputRootStyles(theme, c, tc, error)[v],
            }),
        ),
        ...(disabled && { opacity: 0.5, cursor: "not-allowed" }),

        display: "flex",
        alignItems: "center",
        gap: 4,

        width: fullWidth ? "100%" : "auto",
        minWidth: 0,
        flexShrink: 1,
        flexGrow: fullWidth ? 1 : 0,
        boxSizing: "border-box",
        overflow: "hidden",
        lineHeight: 1,

        borderRadius: 8,
        transition: "all 0.3s ease",
    }),
);

InputRoot.displayName = "InputRoot";

export { InputRoot };

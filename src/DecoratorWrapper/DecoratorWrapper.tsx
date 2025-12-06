import { styled } from "@mutualzz/ui-core";

const DecoratorWrapper = styled("span")<{ position: "start" | "end" }>(
    ({ position }) => ({
        lineHeight: 0,
        fontSize: "inherit",
        color: "inherit",
        display: "flex",
        justifyContent: "center",
        alignItems: position === "start" ? "flex-start" : "flex-end",
        height: "100%",
        flex: "0 0 auto",
    }),
);

DecoratorWrapper.displayName = "DecoratorWrapper";

export { DecoratorWrapper };

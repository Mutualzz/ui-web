import { styled } from "@mutualzz/ui-core";

const InputDecoratorWrapper = styled("span")<{
    position: "start" | "end";
    spacing?: number | string;
}>(({ position, spacing = "0.5em" }) => ({
    lineHeight: 0,
    fontSize: "inherit",
    color: "inherit",
    display: "flex",
    height: "100%",
    flex: "0 0 auto",

    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",

    marginRight: position === "start" ? 0 : spacing,
    marginLeft: position === "end" ? 0 : spacing,
}));

InputDecoratorWrapper.displayName = "InputDecoratorWrapper";

export { InputDecoratorWrapper };

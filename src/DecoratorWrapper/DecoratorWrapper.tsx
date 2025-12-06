import { styled } from "@mutualzz/ui-core";

const DecoratorWrapper = styled("span")(({
    lineHeight: 0,
    fontSize: "inherit",
    color: "inherit",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    height: "100%",
    flex: "0 0 auto",
}));

DecoratorWrapper.displayName = "DecoratorWrapper";

export { DecoratorWrapper };

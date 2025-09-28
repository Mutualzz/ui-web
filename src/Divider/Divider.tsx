import { styled, useTheme } from "@mutualzz/ui-core";
import { forwardRef } from "react";
import { resolveDividerColor, resolveDividerStyles } from "./Divider.helpers";
import type { DividerProps, DividerVariant } from "./Divider.types";

const DividerWrapper = styled("div")<{ isVertical?: boolean }>(
    ({ isVertical }) => ({
        position: "relative",
        display: "flex",
        flexDirection: isVertical ? "column" : "row",
        alignItems: "center",

        ...(isVertical
            ? {
                  width: "auto",
                  height: "100%",
                  flex: "0 0 auto",
              }
            : {
                  width: "100%",
                  height: "1px",
              }),

        margin: isVertical ? "0 8px" : "8px 0",
    }),
);

DividerWrapper.displayName = "DividerWrapper";

const DividerLine = styled("span")<{
    isVertical: boolean;
    lineColor: string;
    variant: DividerVariant;
    grow?: boolean;
}>(({ isVertical, variant, lineColor, grow }) => ({
    flexGrow: grow ? 1 : 0,

    ...(isVertical ? { minHeight: "1rem" } : { minWidth: "1rem" }),
    ...resolveDividerStyles(isVertical, lineColor)[variant],
}));

DividerLine.displayName = "DividerLine";

const DividerText = styled("span")<{
    textColor: string;
    isVertical: boolean;
}>(({ theme, isVertical, textColor }) => ({
    color: textColor,
    padding: isVertical ? "8px 0" : "0 8px",
    whiteSpace: "nowrap",
    fontSize: theme.typography.levels["body-md"].fontSize,
}));

DividerText.displayName = "DividerText";

/**
 * Divider component for separating content.
 * It can be oriented horizontally or vertically.
 * It can also have different visual styles and colors.
 * It supports text content that can be placed in the middle of the divider.
 * The divider can be styled with different variants and colors.
 * The `inset` prop allows for controlling the placement of the text relative to the divider.
 * The `lineColor` and `textColor` props allow for customizing the colors of the divider line and text, respectively.
 * The `variant` prop allows for different visual styles of the divider.
 */
const Divider = forwardRef<HTMLDivElement, DividerProps>(
    (
        {
            orientation = "horizontal",
            inset = "none",
            lineColor = "neutral",
            textColor = "neutral",
            variant = "solid",
            children,
        },
        ref,
    ) => {
        const { theme } = useTheme();

        const isVertical = orientation === "vertical";

        const resolvedLineColor = resolveDividerColor(theme, lineColor);
        const resolvedTextColor = resolveDividerColor(theme, textColor);

        return (
            <DividerWrapper
                ref={ref}
                isVertical={isVertical}
                role="separator"
                aria-orientation={isVertical ? "vertical" : "horizontal"}
                css={{ color: resolvedLineColor }}
            >
                <DividerLine
                    isVertical={isVertical}
                    lineColor={resolvedLineColor}
                    variant={variant}
                    grow={inset !== "start"}
                />

                {children && (
                    <DividerText
                        textColor={resolvedTextColor}
                        isVertical={isVertical}
                    >
                        {children}
                    </DividerText>
                )}

                <DividerLine
                    isVertical={isVertical}
                    lineColor={resolvedLineColor}
                    variant={variant}
                    grow={inset !== "end"}
                />
            </DividerWrapper>
        );
    },
);

Divider.displayName = "Divider";

export { Divider };

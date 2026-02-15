import { type ChangeEvent, forwardRef, useMemo, useRef, useState } from "react";
import type { SwitchProps } from "./Switch.types";
import { resolveResponsiveMerge, styled } from "@mutualzz/ui-core";
import {
    resolveSwitchDimensions,
    resolveSwitchTrackStyles,
} from "./Switch.helpers";

const SwitchWrapper = styled("div")<SwitchProps>(({ disabled }) => ({
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5em",
    cursor: "pointer",
    userSelect: "none",
    ...(disabled && {
        opacity: 0.5,
        pointerEvents: "none",
        cursor: "not-allowed",
    }),
}));

SwitchWrapper.displayName = "SwitchWrapper";

const Track = styled("span")<SwitchProps>(({
    theme,
    color = "neutral",
    variant = "solid",
    size = "md",
    checked,
}) => {
    const dimensions = resolveResponsiveMerge(theme, { size }, ({ size: s }) =>
        resolveSwitchDimensions(theme, s),
    );

    const variantStyles = resolveResponsiveMerge(
        theme,
        {
            color,
            variant,
        },
        ({ color: c, variant: v }) =>
            resolveSwitchTrackStyles(theme, c as any, !!checked)[v],
    );

    const checkedStyles = resolveResponsiveMerge(
        theme,
        { color, variant },
        ({ color: c, variant: v }) =>
            resolveSwitchTrackStyles(theme, c as any, true)[v],
    );

    return {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        width: dimensions.width,
        height: dimensions.height,
        borderRadius: dimensions.height,
        boxSizing: "border-box",
        transition: "all 0.2s ease",
        padding: dimensions.pad,
        ...variantStyles,

        'input[type="checkbox"]:hover + &': checkedStyles,
        'input[type="checkbox"]:active + &': checkedStyles,
        'input[type="checkbox"]:focus-visible + &': {
            outline: "none",
            boxShadow: `0 0 0 3px ${
                (checkedStyles as any).backgroundColor ?? "currentColor"
            }`,
        },
    };
});

Track.displayName = "SwitchTrack";

const Thumb = styled("span")<SwitchProps>(({ theme, size = "md", checked }) => {
    const dimensions = resolveResponsiveMerge(theme, { size }, ({ size: s }) =>
        resolveSwitchDimensions(theme, s),
    );
    const translateX = dimensions.width - dimensions.thumb - dimensions.pad * 2;

    return {
        width: dimensions.thumb,
        height: dimensions.thumb,
        borderRadius: dimensions.thumb,
        backgroundColor: "var(--switch-thumb)",
        transform: checked ? `translateX(${translateX}px)` : "translateX(0)",
        transition: "transform 0.2s ease",
        boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
    };
});

Thumb.displayName = "SwitchThumb";

const HiddenInput = styled("input")({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    margin: 0,
    padding: 0,
    opacity: 0,
    cursor: "pointer",
});

HiddenInput.displayName = "SwitchHiddenInput";

const Label = styled("span")<{ disabled?: boolean }>(({ disabled }) => ({
    ...(disabled && {
        cursor: "not-allowed",
    }),
}));

Label.displayName = "SwitchLabel";

const Decorator = styled("span")({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
});

Decorator.displayName = "SwitchDecorator";

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
    (
        {
            checked: controlledChecked,
            defaultChecked,
            onChange: propOnChange,
            disabled,
            label,
            startDecorator,
            endDecorator,
            color = "neutral",
            variant = "solid",
            size = "md",
            ...props
        },
        ref,
    ) => {
        const [uncontrolledChecked, setUncontrolledChecked] = useState(
            defaultChecked ?? false,
        );
        const inputRef = useRef<HTMLInputElement>(null);

        const isChecked =
            controlledChecked !== undefined
                ? controlledChecked
                : uncontrolledChecked;

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            if (controlledChecked === undefined) {
                setUncontrolledChecked(e.target.checked);
            }
            propOnChange?.(e);
        };

        const handleWrapperClick = () => {
            if (!disabled && inputRef.current) inputRef.current.click();
        };

        const ariaChecked = useMemo(
            () => ({
                role: "switch",
                "aria-checked": isChecked,
            }),
            [isChecked],
        );

        return (
            <SwitchWrapper
                {...ariaChecked}
                tabIndex={disabled ? -1 : 0}
                disabled={disabled}
                onClick={handleWrapperClick}
            >
                {startDecorator && <Decorator>{startDecorator}</Decorator>}

                <span style={{ position: "relative", display: "inline-flex" }}>
                    <HiddenInput
                        {...props}
                        ref={(node) => {
                            inputRef.current = node;
                            if (typeof ref === "function") ref(node);
                            else if (ref) ref.current = node;
                        }}
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleChange}
                        disabled={disabled}
                        css={{ pointerEvents: "none" }}
                    />

                    <Track
                        checked={isChecked}
                        disabled={disabled}
                        color={color as string}
                        variant={variant}
                        size={size}
                    >
                        <Thumb size={size} checked={isChecked} />
                    </Track>
                </span>

                {label && <Label disabled={disabled}>{label}</Label>}

                {endDecorator && <Decorator>{endDecorator}</Decorator>}
            </SwitchWrapper>
        );
    },
);

Switch.displayName = "Switch";

export { Switch };

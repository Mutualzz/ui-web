import { type ColorLike, randomColor, styled } from "@mutualzz/ui-core";
import Color from "color";
import { memo, useState } from "react";
import type { ColorPickerProps } from "./ColorPicker.props";

// const Thumb = memo(function Thumb({
//     x,
//     y,
//     ariaLabel,
// }: {
//     x: number;
//     y: number;
//     ariaLabel: string;
// }) {
//     return (
//         <div
//             aria-label={ariaLabel}
//             css={{ ...styles.thumb, left: x, top: y }}
//         />
//     );
// });

const Thumb = memo(
    styled("div")<{ x: number; y: number }>(({ theme, x, y }) => ({
        position: "absolute",
        width: 16,
        height: 16,
        borderRadius: "50%",
        border: `2px solid ${theme.colors.common.white}`,
        boxShadow: "0 0 0 1px rgba(0,0,0,.35)",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        left: x,
        top: y,
    })),
);

const ColorPicker = ({
    value,
    defaultValue,
    onChange,
    disabled,
    allowAlpha,
}: ColorPickerProps) => {
    const isControlled = value !== undefined;
    const initialHex = isControlled ? value : (defaultValue ?? randomColor());
    const initialAlpha = (() => {
        try {
            const { alpha } = new Color(
                isControlled
                    ? (value ?? initialHex)
                    : (defaultValue ?? initialHex),
            )
                .rgb()
                .object();

            return alpha !== undefined ? alpha : 1;
        } catch {
            return 1;
        }
    })();

    const [hex, setHex] = useState<ColorLike>(initialHex);
    const [alpha, setAlpha] = useState<number>(initialAlpha);

    return <></>;
};

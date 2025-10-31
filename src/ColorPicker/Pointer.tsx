import type { CSSObject } from "@emotion/react";
import { BACKGROUND_IMG } from "@mutualzz/color-picker";
import type { FC, HTMLAttributes } from "react";

interface PointerProps extends HTMLAttributes<HTMLDivElement> {
    color: string;

    css?: CSSObject;
}

const Pointer: FC<PointerProps> = ({ css, color, ...props }) => {
    return (
        <div
            {...props}
            css={{
                height: 28,
                width: 28,
                position: "absolute",
                transform: "translate(-16px, -16px)",
                boxShadow: "0 2px 4px rgb(0 0 0 / 20%)",
                borderRadius: "50%",
                background: `url(${BACKGROUND_IMG})`,
                backgroundColor: "#fff",
                border: "2px solid #fff",
                zIndex: 1,
                ...css,
            }}
        >
            <div
                css={{
                    backgroundColor: color,
                    borderRadius: "50%",
                    width: "100%",
                    height: "100%",
                }}
            />
        </div>
    );
};

Pointer.displayName = "Pointer";

export { Pointer };

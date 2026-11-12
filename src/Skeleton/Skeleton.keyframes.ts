import { keyframes } from "@emotion/react";

export const shimmer = keyframes`
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
`;

export const pulse = keyframes`
    0%, 100% { opacity: 1; }
    50% { opacity: 0.45; }
`;

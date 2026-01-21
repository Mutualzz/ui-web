import type { GradientStop } from "./ColorPicker.types";

export const newStopId = () =>
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const sortStops = (arr: GradientStop[]) =>
    [...arr].sort(
        (a, b) => a.position - b.position || a.id.localeCompare(b.id),
    );

export const distributePositions = <T extends object>(
    arr: T[],
): (T & { position: number })[] => {
    const n = arr.length;
    return arr.map((stop, i) => ({
        ...stop,
        position: n === 1 ? 0 : (i / (n - 1)) * 100,
    }));
};

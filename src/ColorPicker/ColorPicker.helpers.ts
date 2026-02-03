import type { GradientStop } from "./ColorPicker.types";
import { clamp } from "@mutualzz/ui-core";

const MIN_STOP_GAP_PERCENT = 1;

export const newStopId = () =>
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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

export const sortStopsStable = (stops: GradientStop[]): GradientStop[] => {
    return stops
        .map((s, idx) => ({ s, idx }))
        .sort(
            (a, b) =>
                (a.s.position ?? 0) - (b.s.position ?? 0) || a.idx - b.idx,
        )
        .map(({ s }) => s);
};

export const enforceMinGap = (
    stops: GradientStop[],
    activeId: string,
    desiredPos: number,
): number => {
    const sorted = sortStopsStable(stops);
    const i = sorted.findIndex((s) => s.id === activeId);
    if (i === -1) return desiredPos;

    const left = sorted[i - 1];
    const right = sorted[i + 1];

    const min = left ? left.position + MIN_STOP_GAP_PERCENT : 0;
    const max = right ? right.position - MIN_STOP_GAP_PERCENT : 100;

    return clamp(desiredPos, min, max);
};

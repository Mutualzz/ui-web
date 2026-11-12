import {
    type Color,
    type ColorLike,
    getScrollableAncestors,
    resolveResponsiveMerge,
    type Responsive,
    styled,
    useForkRef,
    useOnClickOutside,
    type Variant,
} from "@mutualzz/ui-core";
import {
    Children,
    forwardRef,
    isValidElement,
    type KeyboardEvent,
    type ReactNode,
    useCallback,
    useEffect,
    useId,
    useRef,
    useState,
} from "react";
import type { OptionProps } from "../Option/Option.types";
import { DecoratorWrapper } from "../DecoratorWrapper/DecoratorWrapper";
import { Portal } from "../Portal/Portal";
import { useUiLabels } from "../UiLabels/UiLabels";
import { SelectContext } from "./Select.context";
import {
    resolveSelectContentStyles,
    resolveSelectSize,
    resolveSelectStyles,
} from "./Select.helpers";
import type { SelectProps } from "./Select.types";

const SelectWrapper = styled("div")<SelectProps>(
    ({
        theme,
        color = "neutral",
        size = "md",
        variant = "solid",
        disabled,
    }) => ({
        ...resolveResponsiveMerge(
            theme,
            { color, size, variant },
            ({ color: c, variant: v, size: s }) => ({
                ...resolveSelectSize(theme, s),
                ...resolveSelectStyles(theme, c)[v],
            }),
        ),

        display: "flex",
        alignItems: "center",
        width: "100%",
        overflow: "hidden",
        borderRadius: 6,
        position: "relative",
        cursor: "pointer",
        transition: "all 0.2s ease",

        "&:hover svg": {
            opacity: 1,
        },

        "&:focus-within svg": {
            opacity: 1,
            transform: "scale(1.05)",
        },

        ...(disabled && {
            opacity: 0.5,
            cursor: "not-allowed",
        }),
    }),
);

const SelectPlaceholder = styled("span")<{
    color: Responsive<Color | ColorLike>;
    variant: Responsive<Variant>;
}>(({ theme, color, variant }) => ({
    flex: "1 1 auto",
    textAlign: "left",
    overflow: "hidden",
    textOverflow: "ellipsis",
    background: "transparent",
    whiteSpace: "nowrap",
    minWidth: 0,

    ...resolveResponsiveMerge(
        theme,
        {
            color,
            variant,
        },
        ({ color: c, variant: v }) => ({
            color: resolveSelectContentStyles(theme, c)[v]?.color ?? "inherit",
        }),
    ),
}));

const DropdownIcon = styled("svg")({
    display: "inline-block",
    width: "1.2em",
    height: "1.2em",
    flexShrink: 0,
    opacity: 0.7,
    transition: "opacity 0.2s ease, transform 0.2s ease",
});

const SelectContent = styled("div")<
    SelectProps & {
        isOpen: boolean;
        portalPosition?: {
            top?: number;
            bottom?: number;
            left: number;
            width: number;
        };
        placement?: "top" | "bottom";
    }
>(
    ({
        theme,
        color = "neutral",
        variant = "outlined",
        isOpen,
        portalPosition,
    }) => ({
        ...resolveResponsiveMerge(
            theme,
            { color, variant },
            ({ color: c, variant: v }) => ({
                ...resolveSelectContentStyles(theme, c)[v],
            }),
        ),
        position: "fixed",
        paddingBlock: 4,

        ...(portalPosition?.top !== undefined && { top: portalPosition.top }),
        ...(portalPosition?.bottom !== undefined && {
            bottom: portalPosition.bottom,
        }),
        left: portalPosition?.left ?? 0,
        width: portalPosition?.width ?? 200,

        zIndex: 9999,
        borderRadius: 6,
        maxHeight: "200px",
        overflowY: "auto",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        fontSize: "inherit",

        display: "flex",
        flexDirection: "column",

        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? "visible" : "hidden",
        transition: "all 0.2s ease",
        pointerEvents: isOpen ? "auto" : "none",
    }),
);

type OptionValue = string | number;

interface OptionEntry {
    value: OptionValue;
    disabled: boolean;
    content: ReactNode;
}

interface DropdownPosition {
    top?: number;
    bottom?: number;
    left: number;
    width: number;
}

const dropdownOffset = 5;

const Select = forwardRef<HTMLDivElement, SelectProps>(
    (
        {
            size = "md",
            variant = "solid",
            color = "primary",
            startDecorator,
            endDecorator,
            multiple = false,
            disabled = false,
            required = false,
            autoFocus = false,
            placeholder,
            value,
            defaultValue,
            onValueChange,
            onKeyDown,
            name,
            children,
            closeOnClickOutside = true,
            ...props
        },
        ref,
    ) => {
        const labels = useUiLabels();
        const resolvedPlaceholder = placeholder ?? labels.selectPlaceholder;
        const selectRef = useRef<HTMLDivElement>(null);
        const selectContentRef = useRef<HTMLDivElement>(null);
        const handleRef = useForkRef(selectRef, ref);
        const listboxId = useId();

        const [internalValue, setInternalValue] = useState(
            defaultValue ?? (multiple ? [] : ""),
        );
        const isControlled = value !== undefined;
        const currentValue = isControlled ? value : internalValue;

        const [isOpen, setIsOpen] = useState(false);
        const [highlightedValue, setHighlightedValue] =
            useState<OptionValue | null>(null);
        const [dropdownPosition, setDropdownPosition] =
            useState<DropdownPosition>({ top: 0, left: 0, width: 0 });
        const [placement, setPlacement] = useState<"top" | "bottom">("bottom");

        const optionEntries: OptionEntry[] = Children.toArray(children)
            .filter(isValidElement<OptionProps>)
            .filter((element) => element.props.value !== undefined)
            .map((element) => ({
                value: element.props.value as OptionValue,
                disabled: Boolean(element.props.disabled),
                content: element.props.children ?? element.props.label,
            }));
        const enabledEntries = optionEntries.filter((entry) => !entry.disabled);

        const isValueSelected = (optionValue: OptionValue) =>
            multiple
                ? Array.isArray(currentValue) &&
                  currentValue.includes(optionValue)
                : currentValue === optionValue;

        const getOptionId = useCallback(
            (optionValue: OptionValue) =>
                `${listboxId}-option-${String(optionValue).replace(/\s+/g, "-")}`,
            [listboxId],
        );

        const updateDropdownPosition = useCallback(() => {
            const selectNode = selectRef.current;
            if (!selectNode) return;

            const rect = selectNode.getBoundingClientRect();
            const dropdownHeight =
                selectContentRef.current?.offsetHeight ?? 200;
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            const opensUpward =
                spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;

            setPlacement(opensUpward ? "top" : "bottom");
            setDropdownPosition(
                opensUpward
                    ? {
                          bottom:
                              window.innerHeight - rect.top + dropdownOffset,
                          left: rect.left,
                          width: rect.width,
                      }
                    : {
                          top: rect.bottom + dropdownOffset,
                          left: rect.left,
                          width: rect.width,
                      },
            );
        }, []);

        const closeDropdown = useCallback(() => {
            setIsOpen(false);
            setHighlightedValue(null);
        }, []);

        const openDropdown = (
            highlightFrom: "selected" | "last" = "selected",
        ) => {
            if (disabled) return;
            updateDropdownPosition();
            setIsOpen(true);

            const selectedEntry =
                highlightFrom === "selected"
                    ? enabledEntries.find((entry) =>
                          isValueSelected(entry.value),
                      )
                    : undefined;
            const fallbackEntry =
                highlightFrom === "last"
                    ? enabledEntries[enabledEntries.length - 1]
                    : enabledEntries[0];
            setHighlightedValue(
                selectedEntry?.value ?? fallbackEntry?.value ?? null,
            );
        };

        useEffect(() => {
            if (autoFocus) selectRef.current?.focus();
        }, []);

        useOnClickOutside([selectRef, selectContentRef], () => {
            if (!closeOnClickOutside) return;
            closeDropdown();
        });

        useEffect(() => {
            const selectNode = selectRef.current;
            if (!isOpen || !selectNode) return;

            updateDropdownPosition();

            const handleResize = () => updateDropdownPosition();
            const scrollableAncestors = getScrollableAncestors(selectNode);

            window.addEventListener("resize", handleResize);
            scrollableAncestors.forEach((ancestor) =>
                ancestor.addEventListener("scroll", closeDropdown, {
                    passive: true,
                }),
            );

            return () => {
                window.removeEventListener("resize", handleResize);
                scrollableAncestors.forEach((ancestor) =>
                    ancestor.removeEventListener("scroll", closeDropdown),
                );
            };
        }, [isOpen, updateDropdownPosition, closeDropdown]);

        useEffect(() => {
            if (!isOpen || highlightedValue === null) return;
            document
                .getElementById(getOptionId(highlightedValue))
                ?.scrollIntoView({ block: "nearest" });
        }, [isOpen, highlightedValue, getOptionId]);

        const handleOptionSelect = useCallback(
            (optionValue: OptionValue) => {
                if (disabled) return;

                let nextValue: OptionValue | OptionValue[];
                if (multiple) {
                    const selectedValues = Array.isArray(currentValue)
                        ? currentValue
                        : [];
                    nextValue = selectedValues.includes(optionValue)
                        ? selectedValues.filter(
                              (selectedValue) => selectedValue !== optionValue,
                          )
                        : [...selectedValues, optionValue];
                } else {
                    nextValue = optionValue;
                    closeDropdown();
                }

                if (!isControlled) setInternalValue(nextValue);
                onValueChange?.(nextValue);
            },
            [
                disabled,
                multiple,
                currentValue,
                isControlled,
                onValueChange,
                closeDropdown,
            ],
        );

        const moveHighlight = (direction: 1 | -1) => {
            if (enabledEntries.length === 0) return;
            const currentIndex = enabledEntries.findIndex(
                (entry) => entry.value === highlightedValue,
            );
            const nextIndex =
                currentIndex === -1
                    ? 0
                    : Math.min(
                          Math.max(currentIndex + direction, 0),
                          enabledEntries.length - 1,
                      );
            setHighlightedValue(enabledEntries[nextIndex].value);
        };

        const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
            onKeyDown?.(event);
            if (disabled || event.defaultPrevented) return;

            switch (event.key) {
                case "Enter":
                case " ":
                    event.preventDefault();
                    if (isOpen && highlightedValue !== null) {
                        handleOptionSelect(highlightedValue);
                    } else if (isOpen) {
                        closeDropdown();
                    } else {
                        openDropdown();
                    }
                    break;
                case "Escape":
                    if (!isOpen) break;
                    event.stopPropagation();
                    closeDropdown();
                    break;
                case "Tab":
                    if (isOpen) closeDropdown();
                    break;
                case "ArrowDown":
                    event.preventDefault();
                    if (isOpen) moveHighlight(1);
                    else openDropdown();
                    break;
                case "ArrowUp":
                    event.preventDefault();
                    if (isOpen) moveHighlight(-1);
                    else openDropdown("last");
                    break;
                case "Home":
                    if (!isOpen || enabledEntries.length === 0) break;
                    event.preventDefault();
                    setHighlightedValue(enabledEntries[0].value);
                    break;
                case "End":
                    if (!isOpen || enabledEntries.length === 0) break;
                    event.preventDefault();
                    setHighlightedValue(
                        enabledEntries[enabledEntries.length - 1].value,
                    );
                    break;
            }
        };

        const handleWrapperClick = () => {
            if (disabled) return;
            if (isOpen) closeDropdown();
            else openDropdown();
        };

        const selectedContent = multiple
            ? optionEntries
                  .filter((entry) => isValueSelected(entry.value))
                  .map((entry) => entry.content)
            : (optionEntries.find((entry) => isValueSelected(entry.value))
                  ?.content ?? null);

        const hasValue = multiple
            ? Array.isArray(currentValue) && currentValue.length > 0
            : currentValue !== undefined &&
              currentValue !== null &&
              currentValue !== "";

        const formValues: OptionValue[] = Array.isArray(currentValue)
            ? currentValue
            : hasValue
              ? [currentValue]
              : [];

        return (
            <SelectContext.Provider
                value={{
                    value: currentValue,
                    multiple,
                    onSelect: handleOptionSelect,
                    color,
                    variant,
                    size,
                    disabled,
                    highlightedValue,
                    onHighlight: setHighlightedValue,
                    getOptionId,
                }}
            >
                <SelectWrapper
                    {...props}
                    ref={handleRef}
                    color={color}
                    size={size}
                    variant={variant}
                    disabled={disabled}
                    onClick={handleWrapperClick}
                    onKeyDown={handleKeyDown}
                    tabIndex={disabled ? -1 : 0}
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    aria-controls={isOpen ? listboxId : undefined}
                    aria-activedescendant={
                        isOpen && highlightedValue !== null
                            ? getOptionId(highlightedValue)
                            : undefined
                    }
                    aria-disabled={disabled || undefined}
                    aria-required={required || undefined}
                >
                    {name &&
                        formValues.map((formValue) => (
                            <input
                                key={String(formValue)}
                                type="hidden"
                                name={name}
                                value={String(formValue)}
                                disabled={disabled}
                            />
                        ))}

                    {startDecorator && (
                        <DecoratorWrapper position="start">
                            {startDecorator}
                        </DecoratorWrapper>
                    )}

                    <SelectPlaceholder variant={variant} color={color}>
                        {hasValue && selectedContent
                            ? selectedContent
                            : resolvedPlaceholder}
                    </SelectPlaceholder>

                    <DecoratorWrapper position="end">
                        {endDecorator ?? (
                            <DropdownIcon
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden
                            >
                                <path d="m12 5.83 2.46 2.46c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L12.7 3.7a.9959.9959 0 0 0-1.41 0L8.12 6.88c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 5.83zm0 12.34-2.46-2.46a.9959.9959 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41l3.17 3.18c.39.39 1.02.39 1.41 0l3.17-3.17c.39-.39.39-1.02 0-1.41a.9959.9959 0 0 0-1.41 0L12 18.17z"></path>
                            </DropdownIcon>
                        )}
                    </DecoratorWrapper>

                    {isOpen && (
                        <Portal>
                            <SelectContent
                                placement={placement}
                                ref={selectContentRef}
                                id={listboxId}
                                color={color}
                                variant="outlined"
                                isOpen={isOpen}
                                role="listbox"
                                aria-multiselectable={multiple || undefined}
                                portalPosition={dropdownPosition}
                            >
                                {children}
                            </SelectContent>
                        </Portal>
                    )}
                </SelectWrapper>
            </SelectContext.Provider>
        );
    },
);

Select.displayName = "Select";

export { Select };

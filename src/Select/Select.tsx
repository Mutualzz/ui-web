import {
    getScrollableAncestors,
    resolveResponsiveMerge,
    styled,
    useOnClickOutside,
    type Color,
    type ColorLike,
    type Responsive,
    type Variant,
} from "@mutualzz/ui-core";
import {
    forwardRef,
    useCallback,
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type FocusEvent,
} from "react";
import { DecoratorWrapper } from "../DecoratorWrapper/DecoratorWrapper";
import { Portal } from "../Portal/Portal";
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

const HiddenSelect = styled("select")<SelectProps>({
    flex: 1,
    minWidth: 0,
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "inherit",
    font: "inherit",
    padding: 0,
    position: "absolute",
    inset: 0,
    height: "100%",
    cursor: "pointer",
    margin: 0,
    opacity: 0,

    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",

    pointerEvents: "none",

    "&:focus": {
        outline: "none",
        boxShadow: "none",
    },

    "&:hover, &:active": {
        outline: "none",
    },

    "&::-ms-expand": {
        display: "none",
    },
});

const SelectPlaceholder = styled("span")<{
    color: Responsive<Color | ColorLike>;
    variant: Responsive<Variant>;
}>(({ theme, color, variant }) => ({
    flex: 1,
    textAlign: "left",
    overflow: "hidden",
    textOverflow: "ellipsis",
    background: "transparent",
    whiteSpace: "nowrap",

    ...resolveResponsiveMerge(
        theme,
        {
            color,
            variant,
        },
        ({ color: c, variant: v }) => ({
            color:
                resolveSelectContentStyles(theme, c)[v as Variant]?.color ??
                "inherit",
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

const Select = forwardRef<HTMLSelectElement, SelectProps>(
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
            placeholder = "Select an option",
            value,
            defaultValue,
            onChange,
            onValueChange,
            onFocus,
            onBlur,
            children,
            closeOnClickOutside = true,
            ...props
        },
        ref,
    ) => {
        const selectRef = useRef<HTMLDivElement>(null);
        const selectContentRef = useRef<HTMLDivElement>(null);

        const [internalValue, setInternalValue] = useState(
            defaultValue ?? (multiple ? [] : ""),
        );
        const isControlled = value !== undefined;
        const [focusedIndex, setFocusedIndex] = useState(-1);
        const [dropdownPosition, setDropdownPosition] = useState({
            top: 0,
            left: 0,
            width: 0,
        });
        const [placement, setPlacement] = useState<"top" | "bottom">("bottom");

        const currentValue = isControlled ? value : internalValue;
        const [isOpen, setIsOpen] = useState(false);

        const updateDropdownPosition = useCallback(() => {
            if (selectRef.current) {
                const rect = selectRef.current.getBoundingClientRect();
                const dropdownHeight =
                    selectContentRef.current?.offsetHeight ?? 200; // fallback height
                const spaceBelow = window.innerHeight - rect.bottom;
                const spaceAbove = rect.top;

                const offset = 5;
                let positionStyles: any = {
                    left: rect.left + window.scrollX,
                    width: rect.width,
                };
                let newPlacement: "top" | "bottom" = "bottom";

                if (
                    spaceBelow < dropdownHeight &&
                    spaceAbove > dropdownHeight
                ) {
                    // Place the dropdown just above the select, with a small gap
                    positionStyles = {
                        ...positionStyles,
                        bottom:
                            window.innerHeight -
                            rect.top +
                            offset +
                            window.scrollY,
                    };
                    newPlacement = "top";
                } else {
                    positionStyles = {
                        ...positionStyles,
                        top: rect.bottom + window.scrollY + offset,
                    };
                }

                setDropdownPosition(positionStyles);
                setPlacement(newPlacement);
            }
        }, []);

        useEffect(() => {
            updateDropdownPosition();
        }, []);

        useOnClickOutside(selectRef as any, () => {
            if (!closeOnClickOutside) return;
            setIsOpen(false);
            setFocusedIndex(-1);
        });

        useEffect(() => {
            if (isOpen && selectRef.current) {
                updateDropdownPosition();

                const handleResize = () => updateDropdownPosition();
                const handleScroll = () => {
                    setIsOpen(false);
                    setFocusedIndex(-1);
                };

                window.addEventListener("resize", handleResize);

                const scrollableAncestors = getScrollableAncestors(
                    selectRef.current,
                );
                scrollableAncestors.forEach((ancestor) =>
                    ancestor.addEventListener("scroll", handleScroll, {
                        passive: true,
                    }),
                );

                return () => {
                    window.removeEventListener("resize", handleResize);
                    scrollableAncestors.forEach((ancestor) =>
                        ancestor.removeEventListener("scroll", handleScroll),
                    );
                };
            }
        }, [isOpen]);

        useEffect(() => {
            if (!isOpen) setFocusedIndex(-1);
        }, [isOpen]);

        const getOptions = useCallback(() => {
            if (!selectContentRef.current) return [];
            const optionElements =
                selectContentRef.current.querySelectorAll('[role="option"]');
            return Array.from(optionElements);
        }, []);

        const navigateToOption = useCallback(
            (index: number) => {
                const options = getOptions();
                if (options.length === 0) return;

                const clampedIndex = Math.max(
                    0,
                    Math.min(index, options.length - 1),
                );
                setFocusedIndex(clampedIndex);

                // Scroll focused option into view
                const focusedOption = options[clampedIndex] as
                    | HTMLElement
                    | undefined;
                focusedOption?.scrollIntoView({
                    block: "nearest",
                    behavior: "smooth",
                });

                // Add visual focus state
                options.forEach((option, i) => {
                    (option as HTMLElement).setAttribute(
                        "data-focused",
                        i === clampedIndex ? "true" : "false",
                    );
                });
            },
            [getOptions],
        );

        const handleChange = useCallback(
            (e: ChangeEvent<HTMLSelectElement>) => {
                const newValue = multiple
                    ? Array.from(
                          e.target.selectedOptions,
                          (option) => option.value,
                      )
                    : e.target.value;

                if (!isControlled) setInternalValue(newValue);

                // Only call the native onChange if provided
                onChange?.(e);

                // Call your custom handler
                onValueChange?.(newValue);
            },
            [isControlled, multiple, onValueChange, onChange],
        );

        const handleWrapperClick = useCallback(() => {
            if (disabled) return;
            updateDropdownPosition();
            setIsOpen((prev) => !prev);
        }, [disabled]);

        const handleFocus = useCallback(
            (event: React.FocusEvent<HTMLSelectElement>) => {
                setIsOpen(true);
                onFocus?.(event);
            },
            [onFocus],
        );

        const handleBlur = useCallback(
            (event: FocusEvent<HTMLSelectElement>) => {
                setIsOpen(false);
                onBlur?.(event);
            },
            [onBlur],
        );

        const handleKeyDown = useCallback(
            (event: React.KeyboardEvent) => {
                if (disabled) return;

                switch (event.key) {
                    case "Enter":
                    case " ":
                        event.preventDefault();
                        if (isOpen && focusedIndex >= 0) {
                            const options = getOptions();
                            const focusedOption = options[focusedIndex] as
                                | HTMLElement
                                | undefined;
                            if (focusedOption) {
                                focusedOption.click();
                            }
                        } else {
                            setIsOpen((prev) => !prev);
                        }
                        break;
                    case "Escape":
                        setIsOpen(false);
                        setFocusedIndex(-1);
                        break;
                    case "ArrowDown":
                        event.preventDefault();
                        if (!isOpen) {
                            setIsOpen(true);
                            setFocusedIndex(0);
                        } else {
                            navigateToOption(focusedIndex + 1);
                        }
                        break;
                    case "ArrowUp":
                        event.preventDefault();
                        if (!isOpen) {
                            setIsOpen(true);
                            const options = getOptions();
                            setFocusedIndex(Math.max(0, options.length - 1));
                        } else {
                            navigateToOption(focusedIndex - 1);
                        }
                        break;
                }
            },
            [disabled, isOpen, focusedIndex, getOptions, navigateToOption],
        );

        const getSelectedOptionContent = () => {
            const opts = Array.isArray(children) ? children : [children];
            if (multiple && Array.isArray(currentValue)) {
                // For multiple selection, return array of children
                return opts
                    .filter(
                        (opt: any) =>
                            opt?.props?.value &&
                            currentValue.includes(opt.props.value),
                    )
                    .map((opt: any) => opt.props.children);
            }

            const selected = opts.find(
                (opt: any) => opt?.props?.value === currentValue,
            );
            return selected ? selected.props.children : null;
        };

        const displayValue = getSelectedOptionContent() ?? placeholder;
        const hasValue = multiple
            ? Array.isArray(currentValue) && currentValue.length > 0
            : Boolean(currentValue);

        const handleOptionSelect = useCallback(
            (optionValue: string | number) => {
                if (disabled) return;
                let newValue: any;
                if (multiple) {
                    const arr = Array.isArray(currentValue) ? currentValue : [];
                    newValue = arr.includes(optionValue)
                        ? arr.filter((v) => v !== optionValue)
                        : [...arr, optionValue];
                } else {
                    newValue = optionValue;
                    setIsOpen(false);
                }
                if (!isControlled) setInternalValue(newValue);
                onValueChange?.(newValue);
            },
            [disabled, multiple, currentValue, isControlled, onValueChange],
        );

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
                }}
            >
                <SelectWrapper
                    ref={selectRef}
                    color={color as string}
                    size={size}
                    variant={variant}
                    disabled={disabled}
                    onClick={handleWrapperClick}
                    onKeyDown={handleKeyDown}
                    tabIndex={disabled ? -1 : 0}
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                >
                    <HiddenSelect
                        ref={ref}
                        value={
                            multiple
                                ? (currentValue as string[])
                                : (currentValue as string)
                        }
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        disabled={disabled}
                        required={required}
                        autoFocus={autoFocus}
                        multiple={multiple}
                        tabIndex={-1}
                        {...props}
                    />
                    {startDecorator && (
                        <DecoratorWrapper>{startDecorator}</DecoratorWrapper>
                    )}

                    <SelectPlaceholder
                        variant={variant}
                        color={color as string}
                    >
                        {hasValue ? displayValue : placeholder}
                    </SelectPlaceholder>

                    <DecoratorWrapper>
                        {endDecorator ?? (
                            <DropdownIcon
                                fill="currentColor"
                                viewBox="0 0 24 24"
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
                                color={color as string}
                                variant={variant}
                                isOpen={isOpen}
                                role="listbox"
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

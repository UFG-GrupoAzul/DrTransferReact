import React, { useState, useRef, useEffect } from 'react';
import './styles.css';

interface AutoCompleteSelectProps<T> {
    label: string;
    name: string;
    value: T | null;
    onChange: (value: T | null) => void;
    options: T[];
    field: keyof T;
    filterBy?: (keyof T)[];
    required?: boolean;
    disabled?: boolean;
    renderOption?: (option: T) => string;
}

export function AutoCompleteSelect<T>({
    label,
    name,
    value,
    onChange,
    options,
    field,
    filterBy,
    required,
    disabled,
    renderOption
}: AutoCompleteSelectProps<T>) {
    const [inputValue, setInputValue] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState<T[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (value) {
            setInputValue(renderOption ? renderOption(value) : String(value[field]));
        } else {
            setInputValue('');
        }
    }, [value, field, renderOption]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setInputValue(query);
        setShowOptions(true);

        if (query) {
            const filtered = options.filter(option => {
                if (filterBy) {
                    return filterBy.some(key => {
                        const value = renderOption ? renderOption(option) : String(option[key]);
                        return value.toLowerCase().includes(query.toLowerCase());
                    });
                }
                const value = renderOption ? renderOption(option) : String(option[field]);
                return value.toLowerCase().includes(query.toLowerCase());
            });
            setFilteredOptions(filtered);
        } else {
            setFilteredOptions(options);
        }
    };

    const handleOptionClick = (option: T) => {
        onChange(option);
        setShowOptions(false);
    };

    const handleFocus = () => {
        setIsFocused(true);
        setShowOptions(true);
        setFilteredOptions(options);
    };

    const handleBlur = () => {
        setIsFocused(false);
        // Delay to allow click event on options
        setTimeout(() => {
            if (!value) {
                setInputValue('');
            }
        }, 200);
    };

    const containerClasses = [
        'autocomplete-select',
        isFocused ? 'focused' : '',
        value || inputValue ? 'has-value' : ''
    ].filter(Boolean).join(' ');

    return (
        <div ref={containerRef} className={containerClasses}>
            <label className="autocomplete-label">
                {label}
                {required && <span className="required">*</span>}
            </label>
            <div className="autocomplete-container">
                <input
                    type="text"
                    name={name}
                    className="autocomplete-input"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={disabled}
                    required={required}
                    autoComplete="off"
                />
                {showOptions && (
                    <ul className="options-list">
                        {filteredOptions.map((option, index) => (
                            <li
                                key={index}
                                className={`option-item ${value === option ? 'selected' : ''}`}
                                onClick={() => handleOptionClick(option)}
                            >
                                {renderOption ? renderOption(option) : String(option[field])}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
} 
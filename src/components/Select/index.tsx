import React from 'react'
import { SelectHTMLAttributes } from 'react';
import './styles.css'

export interface Options {
     value: string
     label: string 
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>{
    name: string;
    label: string;
    value: string;
    options: Options [];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    placeholder?: string;
}

export const Select = ({ label, options, placeholder = "Selecione...", ...rest }: SelectProps) => {
    return (
        <div className="form-floating-select">     
            <select {...rest}>
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <label htmlFor={rest.name}>{label}</label>
        </div>
    )
}



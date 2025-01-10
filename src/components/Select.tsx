import React from 'react'
import { SelectHTMLAttributes } from 'react';


export interface Options {
     value: string
     label: string 
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>{
    name: string;
    label: string; // Texto do label
    value: string; // Valor atual do campo
    options: Options []; // Opções do select
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Função chamada ao mudar o valor
  }
  


export const Select = ({ label, options, ...rest }: SelectProps) => {

    return (
        <>     
         <label htmlFor={rest.name}>{label}</label>
                <select {...rest} >
                {options.map((option)=> (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </>

    )
}



import React from 'react'

export interface Options {
     value: string
     label: string 
}

interface SelectProps {
    name: string;
    label: string; // Texto do label
    value: string; // Valor atual do campo
    options: Options []; // Opções do select
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Função chamada ao mudar o valor
  }
  


export const Select = ({ label, name, value, options, onChange }) => {

    return (
        <>     
         <label htmlFor={name}>{label}</label>
                <select id={name} name={name} value={value} onChange={onChange} >
                {options.map((option)=> (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </>

    )
}



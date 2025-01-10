import React, { ChangeEvent } from 'react'
import { InputHTMLAttributes } from 'react'

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement>{
   // Já herda type, name, placeholder, value, onChange, etc. do InputHTMLAttributes
   // adicionado o label

   label?: string;

}


export const InputText: React.FC<InputTextProps> = ({ label, ...rest }) => {
    return (
      <div> 
        {label && ( 
          <label htmlFor={rest.name}>{label}</label>
        )}
        <input {...rest} />
      </div>
    );
  };
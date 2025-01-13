import React, { ChangeEvent } from 'react'
import { InputHTMLAttributes } from 'react'
import './styles.css'

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement>{
   label?: string;
}

export const InputText: React.FC<InputTextProps> = ({ label, ...rest }) => {
    return (
      <div className="form-floating"> 
        <input {...rest} placeholder=" " />
        {label && ( 
          <label htmlFor={rest.name}>{label}</label>
        )}
      </div>
    );
  };
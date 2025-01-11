import React from 'react';
import {Patient} from '../pages/Patient';
import { Options } from './Select';

interface PatientListProps{
    patients: Patient[]
    onDelete: (id: string) => void
    genders: Options[]


}


const ListEntity: React.FC<PatientListProps> = ({
    patients, onDelete, genders}) => {

        if (!patients || patients.length===0){
            return <p>Nenhum paciente encontrado</p>
        }


    return (

        <div>
            <h2>Pacientes:</h2>
            <ul>
                {patients.map((patient)=>(
                    <li key={patient.id}>
                        <span>
                            Nome: {patient.person.name}
                            CPF: {patient.person.cpf}
                            Gênero: {genders.find((gender)=> gender.value === patient.person.gender)?.label || 'Gênero desconhecido'}
                        </span>

                        <button onClick = { () => onDelete(patient.id)}>
                            Remover
                        </button>
                    </li>
                ))}
            </ul>
        </div>
            

    )}


export default ListEntity
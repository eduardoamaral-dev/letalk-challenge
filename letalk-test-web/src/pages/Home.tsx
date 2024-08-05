import {ChangeEvent, useEffect, useState} from "react";
import SimulationResultValue from "../components/SimulationResultValue";
import Simulation from "../dtos/Simulation";
import SimulationRequest from "../dtos/SimulationRequest";
import { toast } from 'react-toastify';
import SimulationService from "../services/SimulationService";

export default function Home() {
    const [simulation, setSimulation] = useState<Simulation>();
    const [formData, setFormData] = useState<SimulationRequest>({
        cpf: '',
        uf: '',
        bornDate: '',
        value: '',
        monthlyPayment: ''
    });

    useEffect(() => {
        console.info(formData)
    }, [formData])

    function handleChange(e: any) {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    async function simulate() {
        await SimulationService.simulate(formData).then(() => {
            toast("Success")
        }).catch((e: any) => {
            toast("error")
        })
    }

    return (
        <>
            <h1>Simule e solicite o seu empréstimo</h1>
            <h3>Preencha o formulário abaixo para simular</h3>
            <form action="">
                <input
                    name={"cpf"}
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder={"CPF"}
                    type="text"/>
                <input
                    name={"uf"}
                    value={formData.uf}
                    onChange={handleChange}
                    placeholder={"UF"}
                    maxLength={2}
                    type="text"/>
                <input
                    name={"bornDate"}
                    value={formData.bornDate}
                    onChange={handleChange}
                    placeholder={"DATA DE NASCIMENTO"}
                    type="date"/>
                <input
                    name={"value"}
                    value={formData.value}
                    onChange={handleChange}
                    placeholder={"QUAL O VALOR DO EMPRÉSTIMO"}
                    type="number"/>
                <input
                    name={"monthlyPayment"}
                    value={formData.monthlyPayment}
                    onChange={handleChange}
                    placeholder={"QUAL VALOR DESEJA PARAR POR MÊS?"}
                    type="number"/>
                <button
                    id={"simulate-button"}
                    type={"button"}
                    onClick={simulate}
                >SIMULAR
                </button>
            </form>
            {simulation && <>
                <SimulationResultValue title={"VALOR REQUERIDO:"} value={simulation.value}></SimulationResultValue>
                <SimulationResultValue title={"TAXA DE JUROS:"}
                                       value={simulation.monthlyInterestRate}></SimulationResultValue>
                <SimulationResultValue title={"VALOR QUE DESEJA PAGAR POR MÊS:"}
                                       value={simulation.monthlyValue}></SimulationResultValue>
                <SimulationResultValue title={"TOTAL DE MESES PARA QUITAR:"}
                                       value={simulation.monthCount}></SimulationResultValue>
                <SimulationResultValue title={"TOTAL DE JUROS:"}
                                       value={simulation.totalInterest}></SimulationResultValue>
                <SimulationResultValue title={"TOTAL A PAGAR:"} value={simulation.totalCost}></SimulationResultValue>
            </>}
        </>
    )
}
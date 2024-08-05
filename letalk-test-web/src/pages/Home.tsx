import React, {useEffect, useState} from "react";
import SimulationResultValue from "../components/SimulationResultValue";
import Simulation from "../dtos/Simulation";
import SimulationService from "../services/SimulationService";
import {Toaster, toast} from 'sonner'


export default function Home() {
    const [simulation, setSimulation] = useState<Simulation>();
    const [formData, setFormData] = useState({
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
        let request = mapFormDataToSimulationRequest();
        await SimulationService.simulate(request).then((response) => {
            let result = response.data
            result.monthlyInterestRate = convertDecimalToPercentage(+result.monthlyInterestRate) // e.g: 0.01 to "1%"
            result.monthCount = result.monthCount + 1 // because of index 0
            setSimulation(result)
        }).catch((e: any) => {
            console.log(e)
            toast.error(e.response.data)
        })
    }

    async function saveSimulation() {
        let payload = simulation!;
        payload.monthlyInterestRate = +payload.monthlyInterestRate.toString().replace(/\D/g, '')/100;
        await SimulationService.saveSimulation(simulation!).then(() => {
            toast.success("Empréstimo salvo com sucesso!")
            setTimeout(function() {
                window.location.reload();
            }, 2000);
        }).catch((e: any) => {
            toast.error("Não foi possível salvar o empréstimo")
        })
    }


    function mapFormDataToSimulationRequest() {
        return {
            value: +formData.value,
            uf: formData.uf,
            monthlyPayment: +formData.monthlyPayment,
            bornDate: formData.bornDate,
            cpf: formData.cpf
        }
    }

    function convertDecimalToPercentage(number: number): string {
        return (number * 100) + "%"
    }

    function formatDate(stringDate: string) {
        let date = new Date(stringDate)
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    return (
        <main>
            <Toaster position="top-left" richColors></Toaster>
            <h1 id={"page-title"}>Simule e solicite o seu empréstimo</h1>
            <h3 className={"subtitle"}>Preencha o formulário abaixo para simular</h3>
            <form className={"white-box"} action="">
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
                    placeholder="DATA DE NASCIMENTO"
                    type="text"
                    onFocus={event => event.target.type = "date"}
                />

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
                <h3 className={"subtitle"}>Veja a simulação para o seu empréstimo antes de efetivar</h3>
                <div className={"white-box"}>

                    <div className={"result-box"}>
                        <SimulationResultValue
                            type={"money"}
                            title={"VALOR REQUERIDO:"}

                            value={simulation.value}></SimulationResultValue>
                        <SimulationResultValue
                            type={"text"} title={"TAXA DE JUROS:"}
                            value={simulation.monthlyInterestRate}
                            suffix={" ao mês"}
                        ></SimulationResultValue>
                        <SimulationResultValue
                            type={"money"}
                            title={"VALOR QUE DESEJA PAGAR POR MÊS:"}
                            value={simulation.monthlyValue}></SimulationResultValue>
                        <SimulationResultValue
                            type={"text"}
                            title={"TOTAL DE MESES PARA QUITAR:"}
                            value={simulation.monthCount}
                            suffix={" meses"}
                        ></SimulationResultValue>
                        <SimulationResultValue
                            type={"money"} title={"TOTAL DE JUROS:"}
                            value={simulation.totalInterest}></SimulationResultValue>
                        <SimulationResultValue
                            type={"money"} title={"TOTAL A PAGAR:"}
                            value={simulation.totalCost}></SimulationResultValue>
                    </div>
                    <h4>PROJEÇÃO DAS PARCELAS:</h4>
                    <table>
                        <thead>
                        <tr>
                            <th>SALDO DEVEDOR</th>
                            <th>JUROS</th>
                            <th>SALDO DEVEDOR AJUSTADO</th>
                            <th>VALOR DA PARCELA</th>
                            <th>VENCIMENTO</th>
                        </tr>
                        </thead>
                        {
                            simulation.installments?.map((installment) => {
                                if (installment.installmentValue > 0)
                                return (<>
                                    <tr>
                                        <td>{installment.balanceDue.toLocaleString('pt-br', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}</td>
                                        <td>{installment.installmentValue.toLocaleString('pt-br', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}</td>
                                        <td>{installment.newBalanceDue.toLocaleString('pt-br', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}</td>
                                        <td>{installment.installmentValue.toLocaleString('pt-br', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}</td>
                                        <td>{formatDate(installment.expiration)}</td>
                                    </tr>
                                </>)
                            })
                        }
                    </table>
                    <button onClick={saveSimulation} id={"loan-button"}>EFETIVAR EMPRÉSTIMO →</button>
                </div>
            </>
            }
        </main>
    )
}
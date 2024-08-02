import Installment from "./Installment";

export default interface SimulationResponse {
    value: number
    monthlyInterestRate: number
    monthlyValue: number
    monthCount: number
    totalInterest: number
    installments: Installment[]
}


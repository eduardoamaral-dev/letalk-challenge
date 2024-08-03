import Installment from "../models/Installment";

export default interface Simulation {
    value: number
    monthlyInterestRate: number
    monthlyValue: number
    monthCount: number
    totalInterest: number
    installments: Installment[]
    totalCost: number
}


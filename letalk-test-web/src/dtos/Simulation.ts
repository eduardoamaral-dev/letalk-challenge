import Installment from "./Installments";


export default interface Simulation {
    value: number
    monthlyInterestRate: string | number
    monthlyValue: number
    monthCount: number
    totalInterest: number
    totalCost: number
    installments?: Installment[]
}


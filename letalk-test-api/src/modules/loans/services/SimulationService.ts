import SimulationRequest from "../dtos/SimulationRequest"
import Simulation from "../dtos/Simulation"
import Installment from "../models/Installment"
import InterestRateService from "./InterestRateService";
import SimulationRepository from "../repositories/SimulationRepository";

export default class SimulationService {
    static simulate(simulationRequest: SimulationRequest): Simulation {
        if (simulationRequest.monthlyPayment < (simulationRequest.value / 100)) {
            throw new Error("O valor da parcela deve ser maior ou igual a 1% do valor do empréstimo.")
        }
        if (simulationRequest.value < 50000) {
            throw new Error("O valor mínimo para empréstimos é de R$ 50.000,00")
        }
        if (simulationRequest.value < simulationRequest.monthlyPayment) {
            throw new Error("O valor do empréstimo não pode ser menor do que o valor da parcela")
        }
        let monthlyInterestRate = InterestRateService.getInterestRate(simulationRequest.uf)
        let installments: Installment[] = [];
        this.calculateInstallments(installments, simulationRequest.value, simulationRequest.monthlyPayment, monthlyInterestRate)
        let totalInterest = this.calculateTotalInterest(installments);
        let totalCost = totalInterest + simulationRequest.value;

        return {
            value: +(simulationRequest.value).toFixed(2),
            monthlyInterestRate,
            monthlyValue: +simulationRequest.monthlyPayment.toFixed(2),
            monthCount: installments.length,
            totalInterest: +totalInterest.toFixed(2),
            installments: installments,
            totalCost: +totalCost.toFixed(2)
        };
    }

    static saveSimulation(simulation: Simulation): Promise<void> {
        return SimulationRepository.saveSimulation(simulation)
    }

    static async getSimulations(includeInstallments: boolean) {
        let simulations: Simulation[] = [];
        await SimulationRepository.getAllLoans().then(result => {
            simulations = result.map(s => {
                return {
                    value: s.value,
                    monthlyInterestRate: s.monthlyInterest,
                    installments: [],
                    monthCount: s.monthCount,
                    monthlyValue: s.monthlyValue,
                    totalCost: s.totalCost,
                    totalInterest: s.totalInterest
                }
            })
        }).catch((e: any) => {
            console.error(e)
        })

        if (includeInstallments) {
            simulations.forEach(simulation => {
                let installments: Installment[] = [];
                this.calculateInstallments(installments, simulation.value, simulation.monthlyValue, simulation.monthlyInterestRate)
                simulation.installments = installments;
            })
        }
        return simulations;
    }

    private static calculateInstallments(installmentList: Installment[], simulationValue: number, monthlyPayment: number, interestRate: number, iterationCount: number = 0) {
        const MAX_ITERATIONS = 10000;
        let balanceDue = simulationValue
        let expiration: Date = new Date()

        if (installmentList.length > 0) {
            let lastInstallment: Installment | null = installmentList[installmentList.length - 1]
            balanceDue = lastInstallment.newBalanceDue - lastInstallment.installmentValue
            expiration = new Date(lastInstallment.expiration)
        }

        let interestValue = balanceDue * interestRate
        let newBalanceDue = balanceDue + interestValue
        let installmentValue = newBalanceDue > monthlyPayment ? monthlyPayment : newBalanceDue

        expiration.setMonth(expiration.getMonth() + 1)
        installmentList.push({
            balanceDue: +balanceDue.toFixed(2),
            expiration,
            interestValue: +interestValue.toFixed(2),
            newBalanceDue: +newBalanceDue.toFixed(2),
            installmentValue: +installmentValue.toFixed(2)
        })
        let newInstallment: Installment | null = installmentList[installmentList.length - 1]
        if (newInstallment!.newBalanceDue > 0 && installmentValue > 0) {
            const tolerance = 0.01;
            if (newInstallment!.newBalanceDue > tolerance) {
                this.calculateInstallments(installmentList, simulationValue, monthlyPayment, interestRate);
            }
        }
    }

    private static calculateTotalInterest(installment: Installment[]): number {
        let result = 0;
        installment.forEach(installment => {
            result += installment.interestValue
        })
        return result
    }

    private static addMissingInstallments(lastInstallment: Installment, pendingInstallments: number) {
        if (lastInstallment.balanceDue > 0) pendingInstallments++
    }

}
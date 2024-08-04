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

        let monthCount = Math.ceil(simulationRequest.value / simulationRequest.monthlyPayment)
        let monthlyInterestRate = InterestRateService.getInterestRate(simulationRequest.uf)
        let installments = this.calculateInstallments(simulationRequest.value, simulationRequest.monthlyPayment, monthCount, monthlyInterestRate)
        let totalInterest = this.calculateTotalInterest(installments);
        let totalCost = totalInterest + simulationRequest.value;

        return {
            value: +simulationRequest.value.toFixed(2),
            monthlyInterestRate,
            monthlyValue: +simulationRequest.monthlyPayment.toFixed(2),
            monthCount: +monthCount.toFixed(2),
            totalInterest: +totalInterest.toFixed(2),
            installments: installments,
            totalCost
        };
    }

    static saveSimulation(simulation: Simulation) {
        SimulationRepository.saveSimulation(simulation).then(r => {
            console.info("Simulation saved successfully")
        })
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

        if (includeInstallments){
            simulations.forEach(simulation => {
                simulation.installments = this.calculateInstallments(simulation.value, simulation.monthlyValue, simulation.monthCount, simulation.monthlyInterestRate)
            })
        }
        return simulations;
    }

    private static calculateInstallments(simulationValue: number, monthlyPayment: number, monthCount: number, interestRate: number): Installment[] {
        let installmentList: Installment[] = []
        for (let i = 0; i <= monthCount; i++) {
            let balanceDue = simulationValue
            let expiration: Date = new Date()

            if (installmentList.length > 0) {
                let lastInstallment = installmentList[installmentList.length - 1]
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
        }
        return installmentList
    }

    private static calculateTotalInterest(installment: Installment[]): number {
        let result = 0;
        installment.forEach(installment => {
            result += installment.interestValue
        })
        return result
    }

}
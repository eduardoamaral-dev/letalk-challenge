import SimulationRequest from "../dtos/SimulationRequest"
import SimulationResponse from "../dtos/SimulationResponse"
import Installment from "../dtos/Installment"

export default class SimulationService {
    static simulate(simulationRequest: SimulationRequest): SimulationResponse {
        let result: SimulationResponse

        let installments = this.calculateInstallments(simulationRequest)

        return result;
    }

    static calculateInstallments(simulationRequest: SimulationRequest): Installment[] {
        let monthCount = Math.ceil(simulationRequest.value / simulationRequest.monthlyPayment)

        let installmentList: Installment[] = []
        for (let i = 0; i < monthCount; i++) {
            let balanceDue = simulationRequest.value;

            if (installmentList.length > 0) {
                let lastInstallment = installmentList[installmentList.length - 1];
                balanceDue = lastInstallment.newBalanceDue - lastInstallment.installmentValue
            }

            let interestValue = balanceDue / 100
            let newBalanceDue = balanceDue + interestValue;
            let installmentValue = newBalanceDue > simulationRequest.monthlyPayment ? simulationRequest.monthlyPayment : newBalanceDue
            let expiration: Date = new Date()
            expiration.setMonth(expiration.getMonth() + 1)

            installmentList.push({
                balanceDue,
                expiration,
                interestValue,
                newBalanceDue,
                installmentValue
            })
        }
        return installmentList
    }

}
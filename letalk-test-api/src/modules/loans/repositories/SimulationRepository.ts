import {PrismaClient} from '@prisma/client';
import Simulation from "../dtos/Simulation";

const prisma = new PrismaClient();

export default class SimulationRepository {
    static async getAllLoans() {
        return prisma.simulation.findMany();
    }

    static async saveSimulation(simulation: Simulation) {
        const loan = await prisma.simulation.create({
            data: {
                value: simulation.value,
                monthlyInterest: simulation.monthlyInterestRate,
                monthlyValue: simulation.monthlyValue,
                totalInterest: simulation.totalInterest,
                monthCount: simulation.monthCount,
                totalCost: simulation.totalCost
            }
        });
    }
}

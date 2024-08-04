import {Request, Response} from 'express'
import SimulationRequest from "./dtos/SimulationRequest";
import Simulation from "./dtos/Simulation";
import SimulationService from "./services/SimulationService";
export default class LoanController {
    static simulate(req: Request<SimulationRequest>, res: Response<Simulation>) {
        try{
            let result = SimulationService.simulate(req.body)
            res.status(200).json(result);
        } catch (e: any) {
            res.status(400).json(e.message);
        }
    }

    static saveSimulation(req: Request<Simulation>, res: Response) {
        try{
            SimulationService.saveSimulation(req.body)
            res.status(200).json("Simulation saved successfully");
        } catch (e: any) {
            res.status(400).json(e.message);
        }
    }

    static async getAllLoans(req: Request, res: Response) {
        try{
            let includeInstallments = Boolean(req.query.includeInstallments)
            let result = await SimulationService.getSimulations(includeInstallments)
            res.status(200).json(result);
        } catch (e: any) {
            res.status(400).json(e.message);
        }
    }




}
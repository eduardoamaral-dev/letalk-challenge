import {Request, Response} from 'express'
import SimulationRequest from "./dtos/SimulationRequest";
import SimulationResponse from "./dtos/SimulationResponse";
export default class LoanController {
    static simulate(req: Request<SimulationRequest>, res: Response<SimulationResponse>) {
        try{
            // simulate
        } catch (e: any) {

        }
    }
}
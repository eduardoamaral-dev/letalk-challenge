import SimulationRequest from "../dtos/SimulationRequest";
import axios from "axios";
import Simulation from "../dtos/Simulation";

export default class SimulationService {
    public static async simulate(requestBody: SimulationRequest) {
        return axios.post<Simulation>("http://54.94.155.16:8080/simulation", requestBody)
    }

    public static async saveSimulation(simulation: Simulation) {
        let result;
        await axios.post<Simulation>("http://54.94.155.16:8080/simulation/save", simulation)
            .then(response => {
                result = response.data
            }).catch(error => {
                console.error(error)
            })
        return result;
    }
}
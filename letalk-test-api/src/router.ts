import { Router, Request, Response } from 'express';
import LoanController from "./modules/loans/LoanController";
export const router = Router();

router.get('/healthCheck', (req: Request, res: Response) => {
    res.send('UP');
});
router.get('/simulation', LoanController.getAllLoans);
router.post('/simulation', LoanController.simulate)
router.post('/simulation/save', LoanController.saveSimulation)

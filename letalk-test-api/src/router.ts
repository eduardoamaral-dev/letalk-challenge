import { Router, Request, Response } from 'express';
import LoanController from "./modules/loans/LoanController";
export const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Test');
});

router.post('/simulation', LoanController.simulate)

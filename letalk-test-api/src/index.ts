import express, { Request, Response } from 'express';
import path from 'path';
import { router } from './router';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server running at port: ${PORT}`);
});

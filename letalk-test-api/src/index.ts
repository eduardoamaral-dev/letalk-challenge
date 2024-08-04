import express from 'express';
import path from 'path';
import { router } from './router';
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use('/', router);
app.use(cors());


app.listen(PORT, () => {
    console.log(`Server running at port: ${PORT}`);
});

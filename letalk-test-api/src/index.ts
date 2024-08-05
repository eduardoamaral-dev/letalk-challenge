import express from 'express';
import path from 'path';
import { router } from './router';
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use('/', router);



app.listen(PORT, () => {
    console.log(`Server running at port: ${PORT}`);
});

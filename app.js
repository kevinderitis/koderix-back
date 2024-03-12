import express from 'express';
import cookieParser from 'cookie-parser';
import gptRouter from './src/routes/gptRouter.js';

const app = express();
const PORT = 8080;

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/gpt', gptRouter);

const server = app.listen(PORT, () => console.log(`Server running on port: ${server.address().port}`))
import dotenv from 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import categoriaRouter from './Routes/categoriaRoute.js'
import usuarioRouter from './Routes/usuarioRoute.js'
import lancacamentoRouter from './Routes/lancamentoRoute.js'
import loginRouter from './Routes/loginRoute.js'

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: "http://localhost:3000", credentials:true}))
const PORT = process.env.PORT


app.use('/login', loginRouter);
app.use('/categoria', categoriaRouter);
app.use('/usuario', usuarioRouter);
app.use('/lancamento', lancacamentoRouter);

app.listen(PORT, function(){
    console.log(`backend em execução na porta ${PORT}`);
})
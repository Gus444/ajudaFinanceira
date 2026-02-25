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

app.use('/login', loginRouter);
app.use('/categoria', categoriaRouter);
app.use('/usuario', usuarioRouter);
app.use('/lancamento', lancacamentoRouter);

app.listen(5000, function(){
    console.log("backend em execução");
})
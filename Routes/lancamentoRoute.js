import express from 'express'
import LancamentoController from '../Controller/lancamentoController.js';
import Autenticar from '../middleware/autenticar.js';

let router = express.Router();
let ctrl = new LancamentoController();
let auth = new Autenticar()

router.post('/', auth.validar, (req,res) =>{
    ctrl.cadastrarLancamento(req,res);
});

export default router
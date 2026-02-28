import express from 'express'
import LancamentoController from '../Controller/lancamentoController.js';
import Autenticar from '../middleware/autenticar.js';

let router = express.Router();
let ctrl = new LancamentoController();
let auth = new Autenticar()

router.post('/', auth.validar, (req,res) =>{
    ctrl.cadastrarLancamento(req,res);
});
router.get('/:id', auth.validar,(req,res) =>{
    ctrl.listarLancamentoPorUsuario(req,res);
});
router.delete('/:id/:usuario', auth.validar, (req,res) =>{
    ctrl.excluirLancamentoPorUsuario(req,res);
})

export default router
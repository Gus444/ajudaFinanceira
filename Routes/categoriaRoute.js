import express from 'express'
import categoriaController from '../Controller/categoriaController.js'
import Autenticar from '../middleware/autenticar.js'

let router = express.Router();

let auth = new Autenticar();
let ctrl = new categoriaController();

router.get('/', auth.validar,(req,res) =>{
    ctrl.listarCategoria(req,res);
})

router.post('/', auth.validar,(req,res) =>{
    ctrl.cadastrarCategoria(req,res);
})
router.get('/:id', auth.validar,(req,res) => {
    ctrl.listarCategoriaPorUsuario(req,res);
})

export default router
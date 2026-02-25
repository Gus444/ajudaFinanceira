import express from 'express'
import UsuarioController from '../Controller/usuarioController.js'
import Autenticar from '../middleware/autenticar.js';

let router = express.Router();

let ctrl = new UsuarioController()
let auth = new Autenticar()

router.get('/obter/:id', auth.validar,(req,res) => {
    ctrl.obterUsuario(req,res);
});
router.post('/', (req,res) => {
    ctrl.cadastrarUsuario(req,res);
});

export default router;
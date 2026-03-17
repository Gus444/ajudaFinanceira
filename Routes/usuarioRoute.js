import express from 'express'
import UsuarioController from '../Controller/usuarioController.js'
import Autenticar from '../middleware/autenticar.js';
import Criptografia from '../middleware/criptografia.js';

let router = express.Router();

let ctrl = new UsuarioController();
let auth = new Autenticar();
let cripto = new Criptografia();

router.get('/obter/:id', auth.validar,(req,res) => {
    ctrl.obterUsuario(req,res);
});
router.post('/', cripto.criptografar,(req,res) => {
    ctrl.cadastrarUsuario(req,res);
});

export default router;
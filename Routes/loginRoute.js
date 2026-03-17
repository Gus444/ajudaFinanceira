import express from 'express'
import LoginController from '../Controller/login.js';
import Criptografia from '../middleware/criptografia.js';

let router = express.Router();

let ctrl = new LoginController();
let cripto = new Criptografia();

router.post('/', cripto.comparar,(req,res) =>{
    ctrl.autenticar(req,res);
});
router.get('/', (req,res) =>{
    ctrl.logout(req,res);
})
router.post('/recuperacao',(req,res) =>{
    ctrl.enviarEmail(req,res);
});
router.patch('/redefinirSenha', cripto.criptografarNovaSenha,(req,res)=>{
    ctrl.redefinirSenha(req,res);
})

export default router;
import express from 'express'
import LoginController from '../Controller/login.js';

let router = express.Router();

let ctrl = new LoginController();

router.post('/',(req,res) =>{
    ctrl.autenticar(req,res);
});
router.get('/', (req,res) =>{
    ctrl.logout(req,res);
})

export default router;
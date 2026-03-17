import LoginModel from "../Model/loginModel.js";
import UsuarioModel from "../Model/usuarioModel.js";
import Autenticar from "../middleware/autenticar.js";
import nodemailer from "nodemailer"


export default class LoginController {

    async autenticar(req, res) {
        try{
            if(req.body) {
                let { usuEmail, usuSenha} = req.body;
                let loginModel = new LoginModel(usuEmail, usuSenha)
                if(await loginModel.autenticar()) {

                        let usuario = new UsuarioModel();
                        usuario = await usuario.obterPorEmailSenha(usuEmail, usuSenha);
                        usuario.usuSenha = "";
                        let auth = new Autenticar();
                        let token = auth.gerarToken(usuario.toJSON())
                        
                        res.cookie("jwt", token, {
                            httpOnly: true
                        })

                        res.status(200).json({tokenAcesso: token, usuario: usuario});
                        
                }
                else {
                    res.status(404).json({msg: "Usuário/senha inválidos"});
                }
            }
            else {
                res.status(400).json({msg: "Usuário e senha não informados"});
            } 
        }
        catch(ex) {
            res.status(500).json({msg: "Erro interno de servidor"});
        }
        
    }

    async logout(req,res){
        try {
            res.clearCookie("jwt", {
                httpOnly:true,
                secure:true,
                sameSite:'strict'
            })
            res.status(200).json({msg: "Logout realizado"})
        } catch (error) {
            res.status(500).json({msg: "Erro ao Deslogar"})
        }

    }

    async enviarEmail(req,res){
        try {

            if(req.body){

                let {usuEmail} = req.body;
                if(usuEmail != ""){
                    let usuario = new UsuarioModel();
                    let result = await usuario.obterPorEmail(usuEmail);

                    if(!result){
                        return res.status(404).json({msg: "Usuario não encontrado"});
                    }

                    let auth = new Autenticar();
                    let token = auth.gerarTokenRecuperacao(result);
                    let link = `http://localhost:3000/redefinir-senha?token=${token}`;

                    let enviarEmail = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASS
                        }
                    })

                    let conteudoEmail = {
                        from: process.env.EMAIL_USER,
                        to: usuEmail,
                        subject: "Recuperação de senha",
                        text: `Clique no link para redefinir sua senha: ${link}`
                    }

                    await enviarEmail.sendMail(conteudoEmail);
                
                    res.status(200).json({msg: "Email de recuperação enviado"});
                }
                else{
                    res.status(400).json({msg: "Informe o email"});
                }
            }
        } catch (error) {
            res.status(500).json({msg: "Erro interno de servidor"});
        }
    }

    async redefinirSenha(req,res){
        try{

            let { token, novaSenha } = req.body;

            let auth = new Autenticar();
            let dados = auth.validarTokenRecuperacao(token);

            let usuarioModel = new UsuarioModel();
            await usuarioModel.redefinirSenha(dados.usuId, novaSenha);

            res.status(200).json({msg: "Senha alterada com sucesso"});

        }
        catch(error){
            res.status(500).json({msg: "Token inválido ou expirado"});
        }
    }
}
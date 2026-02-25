import UsuarioModel from "../Model/usuarioModel.js";


export default class UsuarioController{

    async cadastrarUsuario(req,res){
        try {
            if(req.body){
                let {usuNome, usuEmail, usuSenha} = req.body;
                if(usuNome != "" && usuEmail != "", usuSenha != ""){
                    let usuario = new UsuarioModel();
                    usuario.usuId = 0;
                    usuario.usuNome = usuNome;
                    usuario.usuEmail = usuEmail;
                    usuario.usuSenha = usuSenha;

                    let result = await usuario.gravarUsuario();

                    if(result){
                        res.status(200).json({msg: "Usuario cadastrado com sucesso!"});
                    }
                    else{
                        res.status(500).json({msg: "Erro interno de servidor"});
                    }
                }
                else{
                    res.status(400).json({msg: "informe todos os dados"});
                }
            }
            else{
                res.status(400).json({msg: "informe seus dados"});
            }
        } catch (error) {
            res.status(500).json({msg: "Erro interno de servidor", detalhe: error.message});
        }
    }

    async obterUsuario(req,res){
        try {
            let { id } = req.params;
            let usuario = new UsuarioModel()
            let dadosUsuario = await usuario.obter(id);

            if(dadosUsuario != null){
                res.status(200).json(dadosUsuario);
            }
            else{
                res.status(404).json({msg: "Usuario não encontrado"});
            }
            
        } catch (error) {
            res.status(500).json({msg: "Erro interno de servidor", detalhe: error.message});
        }
    }
}
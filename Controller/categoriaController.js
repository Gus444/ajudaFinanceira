import CategoriaModel from "../Model/categoriaModel.js";
import UsuarioModel from "../Model/usuarioModel.js";


export default class categoriaController {

    async listarCategoria(req,res){
        try {
            
            let categoria = new CategoriaModel();
            let listaCategoria = await categoria.listar();
            res.status(200).json(listaCategoria);

        } catch (error) {
            res.status(500).json({msg: "Erro ao listar categoria", detalhe: error.message});
        }
    }

    async cadastrarCategoria(req,res){
        try {
            if(req.body){
                let{ catNome, catUsuId } = req.body;
                if(catNome != "" && catUsuId > 0){
                    let categoria = new CategoriaModel();
                    categoria.catId = 0;
                    categoria.catNome = catNome;
                    categoria.catUsuId = catUsuId; 

                    let result = await categoria.gravar()
                    if(result){
                        res.status(201).json({msg: "Categoria cadastrada com sucesso", result})
                    }
                    else{
                        res.status(500).json({msg: "Erro interno de servidor"})
                    }
                }   
            }
            else{
                res.status(400).json({msg: "Informe os dados da categoria"})
            }
        } catch (error) {
            res.status(500).json({msg: "Erro interno de servidor", detalhe: error.message})
        }
    }

    async listarCategoriaPorUsuario(req,res){

        try {
            let {id} = req.params;
            let categoria = new CategoriaModel();
            let listaCategoria = await categoria.listarPorUsuario(id);

            res.status(200).json(listaCategoria)
        } catch (error) {
            res.status(500).json({msg: "Erro de servidor", detalhes: error.message})
        }

    }

}
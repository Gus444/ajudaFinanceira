import CategoriaModel from "../Model/categoriaModel.js";
import LancamentoModel from "../Model/lancamentoModel.js";


export default class LancamentoController{

    async cadastrarLancamento(req,res){
        try {
            if(req.body){
              let {lanUsuId, lanCatId,lanDescricao, lanValor, lanData, lanTipo, lanFormPgm} = req.body;
              if(lanDescricao != "" && lanValor != "" && lanData != "" && lanTipo != "" && lanFormPgm != "" && lanUsuId != "" && lanCatId != ""){

                let verCat = new CategoriaModel();
                let categoriaValida = await verCat.consultaUsuario(lanUsuId, lanCatId);

                if(categoriaValida){
                    let lancamento = new LancamentoModel();
                    lancamento.lanId = 0;
                    lancamento.lanUsuId = lanUsuId;
                    lancamento.lanCatId = lanCatId;
                    lancamento.lanDescricao = lanDescricao;
                    lancamento.lanValor = lanValor;
                    lancamento.lanData = lanData;
                    lancamento.lanTipo = lanTipo;
                    lancamento.lanFormPgm = lanFormPgm;

                    let result = await lancamento.gravarLancamento();
                    if(result){
                        res.status(200).json({msg: "Lançamento incluido"});
                    }
                    else{
                        res.status(500).json({msg: "Erro interno de servidor"})
                    }
                }
                else{
                    res.status(400).json({msg: "Categoria invalida"})
                }
              }
              else{
                res.status(400).json({msg: "Informe todos os dados"});
              }  
            }
            

        } catch (error) {
            res.status(500).json({msg: "Erro interno de servidor", detalhe: error.message})
        }
    }

}
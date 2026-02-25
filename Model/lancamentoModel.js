import Database from "../db/database.js"

const banco = new Database()

export default class LancamentoModel{

    #lanId
    #lanUsuId //id que vem do usuario
    #lanCatId //id que vem da categoria
    #lanTipo //entrada ou saida
    #lanValor
    #lanData
    #lanDescricao
    #lanFormPgm //debito ou credito

    get lanId() {return this.#lanId;}
    set lanId(lanId) {this.#lanId = lanId;}

    get lanUsuId() {return this.#lanUsuId;}
    set lanUsuId(lanUsuId) {this.#lanUsuId = lanUsuId;}

    get lanCatId() {return this.#lanCatId;}
    set lanCatId(lanCatId) {this.#lanCatId = lanCatId;}

    get lanTipo() {return this.#lanTipo;}
    set lanTipo(lanTipo) {this.#lanTipo = lanTipo;}

    get lanValor() {return this.#lanValor;}
    set lanValor(lanValor) {this.#lanValor = lanValor;}

    get lanData() {return this.#lanData;}
    set lanData(lanData) {this.#lanData = lanData;}

    get lanDescricao() {return this.#lanDescricao;}
    set lanDescricao(lanDescricao) {this.#lanDescricao = lanDescricao;}

    get lanFormPgm() {return this.#lanFormPgm;}
    set lanFormPgm(lanFormPgm) {this.#lanFormPgm = lanFormPgm;}

    constructor(lanId, lanUsuId, lanCatId, lanTipo, lanValor, lanData, lanDescricao, lanFormPgm){
        this.#lanId = lanId;
        this.#lanUsuId = lanUsuId;
        this.#lanCatId = lanCatId;
        this.#lanTipo = lanTipo;
        this.#lanValor = lanValor;
        this.#lanData = lanData;
        this.#lanDescricao = lanDescricao;
        this.#lanFormPgm = lanFormPgm;
    }

    toJSON() {
        return {
            "lanId": this.#lanId,
            "lanUsuId": this.#lanUsuId,
            "lanCatId": this.#lanCatId,
            "lanTipo": this.#lanTipo,
            "lanValor": this.#lanValor,
            "lanData": this.#lanData,
            "lanDescricao": this.#lanDescricao,
            "lanFormPgm": this.#lanFormPgm
        }
    }

    async gravarLancamento(){

        let sql = "";
        let valores = "";
        
        if(this.#lanId == 0){
            sql = "insert into tb_lancamento(lan_usu_Id, lan_cat_id, lan_tipo, lan_valor, lan_data, lan_descricao, lan_formpgm) values (?,?,?,?,?,?,?)"

            valores = [this.#lanUsuId, this.#lanCatId, this.#lanTipo, this.#lanValor, this.#lanData, this.#lanDescricao, this.#lanFormPgm];
        }
        else{//alterar
            
        }

        let result = await banco.ExecutaComandoLastInserted(sql, valores);

        return result;
    }
}
import Database from "../db/database.js"

const banco = new Database()

export default class LancamentoModel{

    #lanId
    #lanUsuId //id que vem do usuario
    #lanCatId //id que vem da categoria
    #lanCatNome
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

    get lanCatNome() {return this.#lanCatNome;}
    set lanCatNome(lanCatNome) {this.#lanCatNome = lanCatNome;}

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

    constructor(lanId, lanUsuId, lanCatId, lanCatNome,lanTipo, lanValor, lanData, lanDescricao, lanFormPgm){
        this.#lanId = lanId;
        this.#lanUsuId = lanUsuId;
        this.#lanCatId = lanCatId;
        this.#lanCatNome = lanCatNome;
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
            "lanCatNome": this.#lanCatNome,
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

    async listarPorUsuario(usuId){
        let lista = [];
        let sql = `SELECT 
                    l.lan_id,
                    l.lan_usu_id,
                    l.lan_cat_id,
                    c.cat_nome,
                    l.lan_tipo,
                    l.lan_valor,
                    l.lan_data,
                    l.lan_descricao,
                    l.lan_formpgm
                FROM tb_lancamento l
                INNER JOIN tb_categoria c 
                    ON l.lan_cat_id = c.cat_id
                WHERE l.lan_usu_id = ?
                ORDER BY l.lan_data DESC`

        let valores = [usuId];

        let rows = await banco.ExecutaComando(sql,valores)

        for(let i = 0; i< rows.length; i++ ){
            let row = rows[i]
            lista.push(new LancamentoModel(row["lan_id"], row["lan_usu_id"],row["lan_cat_id"],row["cat_nome"],row["lan_tipo"], row["lan_valor"], row["lan_data"], row["lan_descricao"], row["lan_formpgm"]));
        }

        return lista;
    }

    async verificaLancamento(id, usuario){
        let sql = "select * from tb_lancamento where lan_id = ? and lan_usu_id = ?";
        let valores = [id, usuario];

        let row = await banco.ExecutaComando(sql,valores);

        if(row.length > 0){
            return new LancamentoModel(row["lan_id"], row["lan_usu_id"],row["lan_cat_id"],row["cat_nome"],row["lan_tipo"], row["lan_valor"], row["lan_data"], row["lan_descricao"], row["lan_formpgm"])
        }

        return null;
    };

    async deletarLancamento(id, usuario){
        let sql = "delete from tb_lancamento where lan_id = ? and lan_usu_id = ?";
        let valores = [id, usuario];

        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result
    }
}
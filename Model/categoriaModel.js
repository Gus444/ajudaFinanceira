import Database from "../db/database.js"

const banco = new Database()

export default class CategoriaModel{

    #catId
    #catUsuId
    #catNome

    get catId() {
        return this.#catId;
    }
    set catId(catId) {
        this.#catId = catId;
    }

    get catUsuId() {
        return this.#catUsuId;
    }
    set catUsuId(catUsuId) {
        this.#catUsuId = catUsuId;
    }

    get catNome() {
        return this.#catNome;
    }
    set catNome(catNome) {
        this.#catNome = catNome;
    }

    constructor(catId, catUsuId, catNome){
        this.#catId = catId
        this.#catUsuId = catUsuId
        this.#catNome = catNome
    }

    toJSON() {
        return {
            "catId": this.#catId,
            "catUsuId": this.#catUsuId,
            "catNome": this.#catNome
        }
    }

    async listar(){
        let lista = [];
        let sql = "select * from tb_categoria"

        let rows = await banco.ExecutaComando(sql) 

        for(let i = 0; i<rows.length; i++){
            let row = rows[i]
            lista.push(new CategoriaModel(row["cat_id"], row["cat_usu_id"], row["cat_nome"]))
        }

        return lista
    }

    async gravar(){
        let sql = "";
        let valores = "";

        if(this.#catId == 0){
            sql = "insert into tb_categoria (cat_nome, cat_usu_id) values (?,?)"

            valores = [this.#catNome, this.#catUsuId]
        }
        else{//alterar

        }

        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result
    }

    async consultaUsuario(usuId, catId){
        let sql = "select * from tb_categoria where cat_usu_id = ? and cat_id = ?;"
      
        let valores = [usuId, catId];

        let rows = await banco.ExecutaComando(sql, valores);

        return rows.length > 0;
    }

    async listarPorUsuario(usuId){
        let lista = [];
        let sql = "select * from tb_categoria where cat_usu_id = ?"

        let valores = [usuId];

        let rows = await banco.ExecutaComando(sql,valores)

        for(let i = 0; i< rows.length; i++ ){
            let row = rows[i]
            lista.push(new CategoriaModel(row["cat_id"], row["cat_usu_id"],row["cat_nome"]));
        }

        return lista;
    }
}
import Database from "../db/database.js"

const banco = new Database()

export default class UsuarioModel{

    #usuId
    #usuNome
    #usuEmail
    #usuSenha

    get usuId() {
        return this.#usuId;
    }
    set usuId(usuId) {
        this.#usuId = usuId;
    }

    get usuNome() {
        return this.#usuNome;
    }
    set usuNome(usuNome) {
        this.#usuNome = usuNome;
    }

    get usuEmail() {
        return this.#usuEmail;
    }
    set usuEmail(usuEmail) {
        this.#usuEmail = usuEmail;
    }

    get usuSenha() {
        return this.#usuSenha;
    }
    set usuSenha(usuSenha) {
        this.#usuSenha = usuSenha;
    }

    constructor(usuId, usuNome, usuEmail, usuSenha){
        this.#usuId = usuId;
        this.#usuNome = usuNome;
        this.#usuEmail = usuEmail;
        this.#usuSenha = usuSenha;
    }    

    toJSON() {
        return {
            "usuId": this.#usuId,
            "usuNome": this.#usuNome,
            "usuEmail": this.#usuEmail,
            "usuSenha": this.#usuSenha
        }
    }

    async gravarUsuario(){

        let sql = "";
        let valores = "";

        if(this.#usuId == 0){
            sql = "insert into tb_usuario (usu_Nome, usu_Email, usu_Senha) values (?,?,?)"

            valores = [this.#usuNome, this.#usuEmail, this.#usuSenha];
        }
        else{//alterar

        }

        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result;
    }

    async obter(id){
        let sql = "select * from tb_usuario where usu_id = ?";
        let valores = [id];

        let row = await banco.ExecutaComando(sql,valores)

        if(row.length > 0){
            return new UsuarioModel(row[0]["usu_id"], row[0]["usu_nome"], row[0]["usu_email"], row[0]["usu_senha"])
        }

        return null;
    }

    async obterPorEmailSenha(email,senha){
        let sql = "select * from tb_usuario where usu_email = ? and usu_senha = ?";
        let valores = [email,senha];

        let row = await banco.ExecutaComando(sql, valores);

        if(row.length > 0) {
            return new UsuarioModel(row[0]["usu_id"], row[0]["usu_nome"],row[0]["usu_email"], row[0]["usu_senha"])
        }

        return null;
    }
}
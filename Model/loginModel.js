import Database from "../db/database.js";

const banco = new Database();

export default class LoginModel{

        #email;
    #senha;

    get email() {
        return this.#email;
    }
    set email(email) {
        this.#email = email;
    }
    get senha() {
        return this.#senha;
    }
    set senha(senha) {
        this.#senha = senha;
    }

    constructor(email, senha) {
        this.#email = email;
        this.#senha = senha;
    }

    async autenticar() {

        let sql = "select usu_id from tb_usuario where usu_email = ? and usu_senha = ?";

        let valores = [this.#email, this.#senha];

        let rows = await banco.ExecutaComando(sql, valores);

        return rows.length > 0;
    }

    toJSON() {
        return {
            "usuEmail": this.#email,
            "usuSenha": this.#senha
        }
    }

}
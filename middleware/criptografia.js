import bcrypt from "bcrypt"
import Database from "../db/database.js";
import UsuarioModel from "../Model/usuarioModel.js";

const banco = new Database();

export default class Criptografia {

	async criptografar(req, res, next) {
		try {
			const saltRounds = 10;
			if (req.body && req.body.usuSenha && req.body.usuSenha != "") {
				const hashedPassword = await bcrypt.hash(req.body.usuSenha, saltRounds);
				req.body.usuSenha = hashedPassword;
				next();
			}
			else {
				return res.status(400).json({ msg: "Senha não informada." });
			};

		} catch (error) {
			return res.status(500).json({ msg: "Erro interno do Servidor no middleware de criptografia" });
		};
	};

	async comparar(req, res, next) {
		try {
			if (req.body) {
				const { usuEmail, usuSenha } = req.body;
				if (usuEmail && usuSenha) {
					let usuarioModel = new UsuarioModel();
					const usuario = await usuarioModel.obterPorEmail(usuEmail);
					if (usuario) {
						const hash = usuario.usuSenha;
						const match = await bcrypt.compare(usuSenha, hash);
						if (match) {
							req.body.usuSenha = hash;
							next();
						}
						else {
							return res.status(401).json({ msg: "Usuário ou senha inválidos" });
						};
					}
					else {
						return res.status(401).json({ ok: false, msg: "Usuário ou senha inválidos" });
					};
				}
				else {
					return res.status(400).json({ ok: false, msg: "Verifique se os dados foram preenchidos corretamente" });
				};
			}
			else {
				return res.status(400).json({ ok: false, msg: "Verifique se os dados foram preenchidos corretamente" });
			};

		} catch (error) {
			return res.status(500).json({ ok: false, msg: "Erro interno do Servidor no middleware de criptografia de comparação" });
		};
	};

	async criptografarToken(token) {
		try {
			const saltRounds = 12;
			return await bcrypt.hash(token, saltRounds);
		} catch (error) {
			return res.status(500).json({ msg: "Erro interno do Servidor  ao criptografar o token" });
		}
	}

	async criptografarNovaSenha(req,res,next){
		try {
			const saltRounds = 10;
			if (req.body && req.body.novaSenha && req.body.novaSenha != "") {
				const hashedPassword = await bcrypt.hash(req.body.novaSenha, saltRounds);
				req.body.novaSenha = hashedPassword;
				next();
			}
			else {
				return res.status(400).json({ msg: "Senha não informada." });
			};

		} catch (error) {
			return res.status(500).json({ msg: "Erro interno do Servidor no middleware de criptografia" });
		};
	}

};

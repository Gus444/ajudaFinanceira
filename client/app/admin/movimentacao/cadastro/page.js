'use client'
import { useEffect, useRef, useState, useContext} from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import UserContext from "@/app/context/userContext"

export default function cadastroMovimentacaoAdmin(){

    let router = useRouter()
    let { user, setUser } = useContext(UserContext);

    let categoria = useRef("");
    let tipo = useRef("");
    let valor = useRef("");
    let data = useRef("");
    let descricao = useRef("");
    let formPgm = useRef("");

    return(
        <div className="container mt-4 d-flex justify-content-center">
            <div className="card mt-4 p-4 shadow" style={{ width: '800px', maxWidth: '95%' }}>
                
                <h3 className="card-title mb-4">Cadastro de Despesa</h3>
                
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="categoria" className="form-label">Categoria *</label>
                        <input 
                            ref={categoria} 
                            type="text" 
                            className="form-control" 
                            placeholder="Digite a categoria"
                        />
                        {/* {erroCNPJ && <small className="text-danger">CNPJ é obrigatório</small>} */}
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="tipo" className="form-label">Tipo *</label>
                        <input 
                            ref={tipo} 
                            type="text" 
                            className="form-control" 
                            maxLength="15" 
                            placeholder="Digite o tipo"
                        />
                        {/* {erroTelefone && <small className="text-danger">Telefone é obrigatório</small>} */}
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="valor" className="form-label">Valor *</label>
                        <input 
                            ref={valor} 
                            type="number" 
                            className="form-control" 
                            step="0.01"
                            placeholder="0,00"
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="data" className="form-label">Data *</label>
                        <input 
                            ref={data} 
                            type="date" 
                            className="form-control" 
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12 mb-3">
                        <label htmlFor="descricao" className="form-label">Descrição</label>
                        <textarea 
                            ref={descricao} 
                            className="form-control" 
                            rows="3"
                            placeholder="Digite uma descrição para a despesa"
                        ></textarea>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="formPgm" className="form-label">Forma de Pagamento *</label>
                        <select ref={formPgm} className="form-select">
                            <option value="">Selecione...</option>
                            <option value="dinheiro">Dinheiro</option>
                            <option value="cartao">Cartão de Crédito</option>
                            <option value="debito">Cartão de Débito</option>
                            <option value="pix">PIX</option>
                            <option value="boleto">Boleto</option>
                        </select>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-md-12 d-flex justify-content-end gap-2">
                        <button className="btn btn-secondary" onClick={() => router.back()}>
                            Cancelar
                        </button>
                        <button className="btn btn-primary">
                            Salvar Despesa
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
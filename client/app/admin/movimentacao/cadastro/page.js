'use client'
import { useEffect, useRef, useState, useContext} from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import UserContext from "@/app/context/userContext"

export default function cadastroMovimentacaoAdmin(){

    let router = useRouter();
    let msgRef = useRef(null);
    let timeoutId
    let { user, setUser } = useContext(UserContext);

    let categoria = useRef(null);
    let tipo = useRef(null);
    let valor = useRef(null);
    let data = useRef(null);
    let descricao = useRef(null);
    let formPgm = useRef(null);

    let [listaCategoria, setListaCategoria] = useState([]);
    let [selecionarCategoria, setSelecionarCategoria] = useState(null);
    let [categoriaSelecionadaTitulo, setCategoriaSelecionadaTitulo] = useState("");

    console.log()


    //carregar categorias
    function carregarCategoria() {
        fetch(`http://localhost:5000/categoria/${user.usuId}`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        })
        .then(r=> {
            return r.json()
        })
        .then(r=> {
            setListaCategoria(r);
        })
    }

    useEffect(() => {
        carregarCategoria();

        // Limpa o timeout quando o componente desmonta
        return () => {
            clearTimeout(timeoutId);
        };
    }, []);
    //end carregar categorias

    function handleSelectCategoria(categoria) {
        setSelecionarCategoria(categoria.catId);
    }

    function confirmCategoria() {
        if (selecionarCategoria) {
            const categoriaObj = listaCategoria.find(
                c => c.catId === selecionarCategoria
            );

            // Atualiza o título para exibição
            setCategoriaSelecionadaTitulo(categoriaObj.catNome);
            
            // CORREÇÃO: Agora o ref está associado a um input, então pode receber .value
            if (categoria.current) {
                categoria.current.value = categoriaObj.catId;
            }
            
            closePopup2();
        } else {
            alert("Selecione uma categoria.");
        }
    }

    let [showPopup2, setShowPopup2] = useState(false);

    let openPopup2 = () => {
        setShowPopup2(true);
    };

    let closePopup2 = () => {
        setShowPopup2(false);
    };

    function gravarLancamento() {

        let ok = true;

        if(ok){
            let movimentacao = {
                lanUsuId: user.usuId,
                lanCatId: categoria.current?.value || "",  // Usando optional chaining
                lanTipo: tipo.current?.value || "",
                lanValor: valor.current?.value || "",
                lanData: data.current?.value || "",
                lanDescricao: descricao.current?.value || "",
                lanFormPgm: formPgm.current?.value || "",
            }

            console.log("Dados completos:", movimentacao);
            
            fetch('http://localhost:5000/lancamento', {
                mode: 'cors',
                credentials: 'include',
                method: "POST",
                headers:{
                    "Content-type": "application/json",
                },
                body: JSON.stringify(movimentacao)
            })
            .then(r => {
                ok = r.status == 201;
                return r.json();
            })
            .then(r=> {
                if(ok) {
                    router.push("/admin/movimentacao");
                }
                else {
                    console.log("Erro na resposta:", r)
                }
            })
        }
        else
        {
            console.log("erro na validação")
        }
    }


    return(
        <div className="container-fluid py-4 px-4" style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <div className="row justify-content-center">
                <div className="col-12 col-lg-10 col-xl-8">
                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        
                        
                        {/* Header do Card com gradiente */}
                        <div className="card-header bg-gradient-primary text-white p-4 border-0" 
                             style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <div className="d-flex align-items-center">
                                <div className="rounded-circle bg-white bg-opacity-25 p-3 me-3">
                                    <i className="fas fa-exchange-alt fa-2x text-white"></i>
                                </div>
                                <div>
                                    <h3 className="mb-1 fw-bold">Nova Movimentação</h3>
                                    <p className="mb-0 opacity-75">Preencha os dados da despesa abaixo</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Corpo do Card */}
                        <div className="card-body p-4 p-lg-5">
                            
                            {/* Linha: Categoria e Tipo */}
                            <div className="row g-4 mb-4">
                                <div className="col-md-5">
                                    <label className="form-label fw-semibold text-dark">
                                        <i className="fas fa-tag me-2 text-primary"></i>
                                        Categoria <span className="text-danger">*</span>
                                    </label>
                                    <div className="position-relative">
                                        <button 
                                            className="btn btn-light border w-100 text-start d-flex justify-content-between align-items-center p-3 rounded-3 shadow-sm" 
                                            onClick={openPopup2}
                                            style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}
                                        >
                                            <span className={categoriaSelecionadaTitulo ? "text-dark" : "text-secondary"}>
                                                {categoriaSelecionadaTitulo || "Selecionar Categoria"}
                                            </span>
                                            <i className="fas fa-chevron-down text-primary"></i>
                                        </button>
                                        
                                        {/* Input oculto que armazena o ID - AGORA ASSOCIADO AO REF */}
                                        <input 
                                            type="hidden" 
                                            ref={categoria}
                                        />
                                    </div>
                                    {categoriaSelecionadaTitulo && (
                                        <div className="mt-2">
                                            <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                                                <i className="fas fa-check-circle me-1"></i>
                                                {categoriaSelecionadaTitulo}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                
                                <div className="col-md-5">
                                    <label htmlFor="tipo" className="form-label fw-semibold text-dark">
                                        <i className="fas fa-credit-card me-2 text-primary"></i>
                                        Tipo <span className="text-danger">*</span>
                                    </label>
                                    <select 
                                        ref={tipo} 
                                        className="form-select form-select-lg rounded-3 border-2 shadow-sm" 
                                        style={{ borderColor: '#e2e8f0', background: '#f8fafc' }}
                                    >
                                        <option value="">Selecione o tipo</option>
                                        <option value="1" className="py-2">Saida</option>
                                        <option value="2" className="py-2">Entrada</option>
                                    </select>
                                </div>
                            
                            </div>

                            {/* Linha: Valor e Data */}
                            <div className="row g-4 mb-4">
                                <div className="col-md-6">
                                    <label htmlFor="valor" className="form-label fw-semibold text-dark">
                                        <i className="fas fa-dollar-sign me-2 text-primary"></i>
                                        Valor <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-2 rounded-start-3" 
                                              style={{ borderColor: '#e2e8f0' }}>
                                            R$
                                        </span>
                                        <input 
                                            ref={valor} 
                                            type="number" 
                                            className="form-control form-control-lg border-2 shadow-sm rounded-end-3" 
                                            style={{ borderColor: '#e2e8f0', background: '#f8fafc' }}
                                            step="0.01"
                                            placeholder="0,00"
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label htmlFor="data" className="form-label fw-semibold text-dark">
                                        <i className="fas fa-calendar-alt me-2 text-primary"></i>
                                        Data <span className="text-danger">*</span>
                                    </label>
                                    <input 
                                        ref={data} 
                                        type="date" 
                                        className="form-control form-control-lg rounded-3 border-2 shadow-sm" 
                                        style={{ borderColor: '#e2e8f0', background: '#f8fafc' }}
                                    />
                                </div>
                            </div>

                            {/* Linha: Descrição */}
                            <div className="row g-4 mb-4">
                                <div className="col-12">
                                    <label htmlFor="descricao" className="form-label fw-semibold text-dark">
                                        <i className="fas fa-align-left me-2 text-primary"></i>
                                        Descrição
                                    </label>
                                    <textarea 
                                        ref={descricao} 
                                        className="form-control rounded-3 border-2 shadow-sm" 
                                        style={{ borderColor: '#e2e8f0', background: '#f8fafc' }}
                                        rows="4"
                                        placeholder="Digite uma descrição detalhada para a movimentação..."
                                    ></textarea>
                                </div>
                            </div>

                            {/* Linha: Forma de Pagamento */}
                            <div className="row g-4 mb-5">
                                <div className="col-md-8">
                                    <label htmlFor="formPgm" className="form-label fw-semibold text-dark">
                                        <i className="fas fa-credit-card me-2 text-primary"></i>
                                        Forma de Pagamento <span className="text-danger">*</span>
                                    </label>
                                    <select 
                                        ref={formPgm} 
                                        className="form-select form-select-lg rounded-3 border-2 shadow-sm" 
                                        style={{ borderColor: '#e2e8f0', background: '#f8fafc' }}
                                    >
                                        <option value="">Selecione uma forma de pagamento</option>
                                        <option value="Dinheiro" className="py-2">Dinheiro</option>
                                        <option value="Cartao" className="py-2">Cartão de Crédito</option>
                                        <option value="Debito" className="py-2">Cartão de Débito</option>
                                        <option value="Pix" className="py-2">PIX</option>
                                        <option value="Boleto" className="py-2">Boleto</option>
                                    </select>
                                </div>
                            </div>

                            {/* Botões */}
                            <div className="row mt-5">
                                <div className="col-12 d-flex justify-content-end gap-3">
                                    <button 
                                        className="btn btn-outline-secondary px-5 py-3 rounded-3 fw-semibold" 
                                        onClick={() => router.back()}
                                        style={{ borderWidth: '2px' }}
                                    >
                                        <i className="fas fa-times me-2"></i>
                                        Cancelar
                                    </button>
                                    <button 
                                        className="btn btn-primary px-5 py-3 rounded-3 fw-semibold shadow-sm"
                                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                                        onClick={gravarLancamento}
                                    >
                                        <i className="fas fa-save me-2"></i>
                                        Salvar
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Popup */}
            {showPopup2 && (
                <div className="popup-overlay2">
                    <div className="popup2">
                        <aside ref={msgRef}></aside>
                        <div className="popup-title2">Selecione a categoria</div>
                        <div className="popup-content2">
                            {listaCategoria.length === 0 ? (
                                <p className="text-center">Nenhum registro disponível.</p>
                            ) : (
                                <ul className="protocol-list">
                                    {listaCategoria.map((categoriaItem, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleSelectCategoria(categoriaItem)}
                                            className={`protocol-item ${selecionarCategoria === categoriaItem.catId ? "selected" : ""}`}
                                        >
                                            {categoriaItem.catNome}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="popup-buttons2">
                            <button className="btn btn-danger" onClick={closePopup2}>Cancelar</button>
                            <button className="btn btn-primary" onClick={confirmCategoria}>Confirmar</button>
                        </div>
                    </div>    
                </div>
            )}
        </div>
    )
}
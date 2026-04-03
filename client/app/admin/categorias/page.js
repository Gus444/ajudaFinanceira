'use client'
import Link from "next/link";
import { useEffect, useRef, useState, useContext } from "react"
import UserContext from "../../context/userContext.js"
import MontaTabelaTD from "@/app/components/montaTabelaTD.js";

export default function categoriaAdmin(){

    let msgRef = useRef(null);
    let msgRefPopUp = useRef(null);
    let nomeRef = useRef(null);
    let {user, setUser} = useContext(UserContext);
    let [listaCategoria, setListaCategoria] = useState([])
    let [erroNome, setErroNome] = useState(false);
   
    //para identificar se a popup esta no modo cadastro ou alteracao
    let [editando, setEditando] = useState(false);
    let [idEdicao, setIdEdicao] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const openPopup = (modo = 'cadastrar', id = null) => {
        // Limpar mensagens anteriores
        if (msgRefPopUp.current) {
            msgRefPopUp.current.innerHTML = '';
            msgRefPopUp.current.className = '';
        }
        
        // Se for edição, carregar os dados da categoria
        if (modo === 'editar' && id) {
            const categoria = listaCategoria.find(c => c.catId === id);
            if (categoria && nomeRef.current) {
                nomeRef.current.value = categoria.catNome;
            }
            setIdEdicao(id);
        } else {
            // Se for cadastro, limpar o campo
            if (nomeRef.current) {
                nomeRef.current.value = '';
            }
            setIdEdicao(null);
        }
        
        setErroNome(false);
        setEditando(modo === 'editar');
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        // Limpar campo e mensagens ao fechar
        if (nomeRef.current) {
            nomeRef.current.value = '';
        }
        if (msgRefPopUp.current) {
            msgRefPopUp.current.innerHTML = '';
            msgRefPopUp.current.className = '';
        }
        setErroNome(false);
    };

    function carregarCategoria() {
        if (!user?.usuId) return;
        
        fetch(`http://localhost:5000/categoria/${user.usuId}`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        })
        .then(r => r.json())
        .then(r => {
            setListaCategoria(r);
        })
        .catch(error => {
            console.error("Erro ao carregar categorias:", error);
        });
    }

    function excluirCategoria(catId) {
        if (!confirm("Tem certeza que deseja excluir esta categoria?")) {
            return;
        }

        fetch(`http://localhost:5000/categoria/${catId}/${user.usuId}`, {
            mode: 'cors',
            credentials: 'include',
            method: 'DELETE',
        })
        .then(async (response) => {
            const data = await response.json();

            if (msgRef.current) {
                if (response.status !== 200) {
                    msgRef.current.className = "msgError";
                } else {
                    msgRef.current.className = "msgSucess";
                }

                msgRef.current.innerHTML = data.msg;
            }

            if (response.status === 200) {
                carregarCategoria();
            }
        })
        .catch(error => {
            console.error("Erro ao excluir:", error);
            if (msgRef.current) {
                msgRef.current.className = "msgError";
                msgRef.current.innerHTML = "Erro ao excluir categoria";
            }
        });
    }

    function cadastrarCategoria(){
        let nomeValue = nomeRef.current?.value?.trim();

        if (!nomeValue) {
            setErroNome(true);
            if (msgRefPopUp.current) {
                msgRefPopUp.current.className = 'popup-message error';
                msgRefPopUp.current.innerHTML = '<i class="fas fa-exclamation-circle"></i> Preencha o nome da categoria';
            }
            return;
        }

        let dados = {
            catNome: nomeValue,
            catUsuId: user.usuId
        };

        // Limpar mensagem anterior
        if (msgRefPopUp.current) {
            msgRefPopUp.current.className = '';
            msgRefPopUp.current.innerHTML = '';
        }

        setErroNome(false);
        
        // Determinar se é cadastro ou alteração
        let url = 'http://localhost:5000/categoria';
        let method = "POST";
        
        if (editando && idEdicao) {
            url = `http://localhost:5000/categoria/${idEdicao}`;
            method = "PUT";
        }

        fetch(url, {
            mode: 'cors',
            credentials: 'include',
            method: method,
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(dados)
        })
        .then(r => r.json())
        .then(r => { 
            if (!r.erro) {
                closePopup();
                carregarCategoria();
                if (msgRef.current) {
                    msgRef.current.className = "msgSucess";
                    msgRef.current.innerHTML = r.msg || (editando ? "Categoria alterada com sucesso!" : "Categoria cadastrada com sucesso!");
                }
            } else {
                if (msgRefPopUp.current) {
                    msgRefPopUp.current.className = "popup-message error";
                    msgRefPopUp.current.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${r.msg || "Erro ao salvar categoria"}`;
                }
            }
        })
        .catch(error => {
            console.error("Erro:", error);
            if (msgRefPopUp.current) {
                msgRefPopUp.current.className = "popup-message error";
                msgRefPopUp.current.innerHTML = '<i class="fas fa-exclamation-circle"></i> Erro ao conectar com o servidor';
            }
        });
    }

    function alterarCategoria(id) {
        openPopup('editar', id);
    }

    useEffect(() => {
        if (user?.usuId) {
            carregarCategoria();
        }
    }, [user]);

    return(
        <div className="container-fluid py-4">
            {/* Mensagem global */}
            <div ref={msgRef} className="mb-3"></div>

            {/* Header com título e botão */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 fw-bold">Categorias Cadastradas</h1>
                <button 
                    onClick={() => openPopup('cadastrar')} 
                    className="btn btn-primary"
                >
                    <i className="fas fa-plus me-2"></i>
                    Nova Categoria
                </button>
            </div>

            {/* Popup de cadastro/edição */}
            {showPopup && (
                <div className="popup-overlay2" onClick={closePopup}>
                    <div className="popup2" onClick={(e) => e.stopPropagation()}>
                        
                        {/* Botão de fechar */}
                        <button className="popup-close" onClick={closePopup}>✕</button>

                        {/* Título */}
                        <div className="popup-title2">
                            {editando ? 'Editar Categoria' : 'Nova Categoria'}
                        </div>
                        
                        {/* Subtítulo */}
                        <div className="popup-subtitle">
                            {editando ? 'Altere os dados da categoria' : 'Preencha os dados da nova categoria'}
                        </div>

                        {/* Área de mensagem da popup */}
                        <div ref={msgRefPopUp} className="popup-message"></div>

                        {/* Conteúdo */}
                        <div className="popup-content2">
                            <div className="popup-content-inner">
                                <div className="popup-input-group">
                                    <label className="popup-label">
                                        <i className="fas fa-tag me-2" style={{ color: '#3b82f6' }}></i>
                                        Nome da Categoria *
                                    </label>
                                    <input 
                                        className={`popup-input ${erroNome ? 'is-invalid' : ''}`}
                                        onChange={() => setErroNome(false)} 
                                        type="text" 
                                        ref={nomeRef}  
                                        id="nome" 
                                        placeholder="Digite o nome da categoria (ex: Alimentação, Transporte...)" 
                                    />
                                    {erroNome && (
                                        <small className="text-danger mt-1 d-block">
                                            <i className="fas fa-exclamation-circle me-1"></i>
                                            O nome da categoria é obrigatório
                                        </small>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Divisor decorativo */}
                        <div className="popup-divider"></div>

                        {/* Botões */}
                        <div className="popup-buttons2">
                            <button 
                                className="btn-secondary" 
                                onClick={closePopup}
                            >
                                <i className="fas fa-times me-2"></i>
                                Cancelar
                            </button>
                            <button 
                                className="btn-primary" 
                                onClick={cadastrarCategoria}
                            >
                                <i className={`fas ${editando ? 'fa-save' : 'fa-check'} me-2`}></i>
                                {editando ? 'Salvar Alterações' : 'Confirmar'}
                            </button>
                        </div>
                    </div>    
                </div>
            )}

            {/* Tabela de categorias */}
            <div className="mt-4">
                <MontaTabelaTD 
                    lista={listaCategoria} 
                    exclusao={excluirCategoria} 
                    alteracao={alterarCategoria}
                    cabecalhos={["Categoria"]} 
                    propriedades={['catNome']} 
                    idPropriedade='catId'>
                </MontaTabelaTD>        
            </div>
        </div>
    )
}
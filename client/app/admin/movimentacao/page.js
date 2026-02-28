'use client'
import Link from "next/link";
import { useEffect, useRef, useState, useContext } from "react"
import UserContext from "../../context/userContext.js"
import MontaTabelaTD from "@/app/components/montaTabelaTD.js";

export default function lancamentoAdmin(){

    let msgRef = useRef(null);
    let usuarioLogado
    let {user, setUser} = useContext(UserContext);
    let [listaLancamento, setListaLancamento] = useState([])
    let [erroNome, setErroNome] = useState(false);
   
    //funcao pra formatar a data
    let formatarData = (dataISO) =>{
        if(!dataISO) return "";
        let data = new Date(dataISO);
        return data.toLocaleDateString('pt-BR')
    }

    //funcao pra formatar valor
    let formatarValor = (valor) => {
        if (!valor) return "R$ 0,00";
        let numValor = parseFloat(valor);
        return numValor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    //funcao pra formatar tipo
    let formatarTipo = (tipo) => {
        if (tipo === "1" || tipo === "saida") return "Saída";
        if (tipo === "2" || tipo === "entrada") return "Entrada";
        return tipo;
    };

    function carregarLancamento() {
        fetch(`http://localhost:5000/lancamento/${user.usuId}`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        })
        .then(r=> {
            return r.json()
        })
        .then(r=> {

            let lancamentosFormatados = r.map(item => ({
                ...item,
                lanData: formatarData(item.lanData),
                lanValor: formatarValor(item.lanValor),
                lanTipo: formatarTipo(item.lanTipo)
            }));
            setListaLancamento(lancamentosFormatados);
        })
    }

    function excluirLancamento(id){

        //incluir aqui delecao apenas quando usuario estiver logado
        //colocar um confirm pra o usuario ter certeza
        
        fetch(`http://localhost:5000/lancamento/${id}/${user.usuId}`, {
            mode: 'cors',
            credentials: 'include',
            method: "DELETE",
        })
        .then(r => {
            return r.json()
        })
        .then(r =>{
            carregarLancamento()
        })
        .catch(erro => {
            console.error("Erro ao excluir:", erro);
            alert("Erro ao excluir lançamento. Tente novamente.");
        });
    }

    let timeoutId
    useEffect(() => {
        carregarLancamento();

        // Limpa o timeout quando o componente desmonta
        return () => {
            clearTimeout(timeoutId);
        };
    }, []);


    console.log(listaLancamento)

    return(

        <div>
            <h1>Ultimos lançamentos</h1>
            <button>
                
            </button>

            <div>
                    <MontaTabelaTD lista={listaLancamento} exclusao={excluirLancamento} cabecalhos={["Titulo", "Categoria", 'Tipo', 'Valor', 'Data']} propriedades={['lanId', 'lanCatNome', 'lanTipo', 'lanValor', 'lanData']} ></MontaTabelaTD>
            </div>
        </div>
    )


}
'use client'
import Link from "next/link";
import { useEffect, useRef, useState, useContext } from "react"
import UserContext from "../../context/userContext.js"
import MontaTabelaTD from "@/app/components/montaTabelaTD.js";

export default function categoriaAdmin(){

    let msgRef = useRef(null);
    let {user, setUser} = useContext(UserContext);
    let [listaCategoria, setListaCategoria] = useState([])
    let [erroNome, setErroNome] = useState(false);
   

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

    console.log(listaCategoria)

    return(

        <div>
            <h1>Categorias cadastradas</h1>

            <div>
                    <MontaTabelaTD lista={listaCategoria} cabecalhos={["Titulo"]} propriedades={['catNome']} ></MontaTabelaTD>
            </div>
        </div>
    )


}
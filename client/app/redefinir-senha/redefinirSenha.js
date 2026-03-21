"use client"

import { useSearchParams } from "next/navigation"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation";

export default function RedefinirSenha(){

    let router = useRouter();
    const searchParams = useSearchParams()
    const token = searchParams.get("token");

    let senhaDefinida = useRef("")

    const [msg, setMsg] = useState("")
    const [msgClass, setMsgClass] = useState("")

    async function redefinirSenha(){
        let ok
        let senha = senhaDefinida.current.value

        fetch("http://localhost:5000/login/redefinirSenha", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: token,
                novaSenha: senha
            })
        })
        .then(r =>{
            ok = r.status == 200;
            return r.json();
        })
        .then(r =>{
            if(ok){
                    setMsgClass("msgSucess")
                    setMsg(r.msg)

                    setTimeout(() =>{
                        router.push("/")
                    },2500)
                }
                else{
                    setMsgClass("msgError")
                    setMsg(r.msg)
                }
        })
    }

    return (
        <div className="background">
            <div className="Meucontainer">
                <h2 className="form-title">Redefinir senha</h2>

                {msg && (
                    <div className={msgClass}>
                        {msg}
                    </div>
                )}

                <div className="form">
                    <div className="input-group">
                        <input
                        className="input-field"
                        type="password"
                        placeholder="Digite sua nova senha"
                        ref={senhaDefinida}
                        />
                    </div>

                    <button className="buttonLogin" onClick={redefinirSenha}>
                        <span>Alterar senha</span>
                    </button>
                </div>   
                
            </div>
        </div>
    )
}
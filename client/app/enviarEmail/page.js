"use client"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation";

export default function EnviarEmail(){

    let email = useRef("");

    const [msg, setMsg] = useState("")
    const [msgClass, setMsgClass] = useState("")

    let router = useRouter();

    function enviarEmail(){

        let ok
        let usuEmail=email.current.value

        fetch("http://localhost:5000/login/recuperacao", {
            method: "POST",
            mode: 'cors',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuEmail: usuEmail
            })
        })
        .then(r =>{
           ok = r.status == 200;
           return r.json();
        })
        .then(r =>{
            if(ok){
                    setMsgClass("msgSucess")
                    setMsg("Email de recuperação enviado")

                    setTimeout(() =>{
                        router.push("/")
                    },3500)
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
                <h2 className="form-title">Recuperar senha</h2>
                <p className="form-subtitle">Informe seu email para redefinir senha!</p>

                {msg && (
                    <div className={msgClass}>
                        {msg}
                    </div>
                )}

                <div className="form">
                    <div className="input-group">
                        <input
                            className="input-field"
                            type="email"
                            placeholder="Digite seu email"
                            ref={email}
                            />
                    </div>

                    <button className="buttonLogin" onClick={enviarEmail}><span>Enviar email de recuperação</span></button>
                </div>

            </div>
        </div>
    )
}
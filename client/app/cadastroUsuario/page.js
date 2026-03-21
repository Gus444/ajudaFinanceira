
'use client'
import { useContext, useRef, useState } from "react"
import { useRouter } from "next/navigation";
import UserContext from "../context/userContext";


export default function PaginacadastrarUsuario(){

    let nome = useRef("");
    let email = useRef("");
    let senha = useRef("");
    let msgRef = useRef(null);

    let router = useRouter();

    const [msg, setMsg] = useState("")
    const [msgClass, setMsgClass] = useState("")

    function validar(){

        let emailValue = email.current.value;
        let senhaValue = senha.current.value;
        let nomeValue = nome.current.value;
        let ok = false

        let dados = {
            usuEmail: emailValue,
            usuSenha: senhaValue,
            usuNome: nomeValue
        }

        if(emailValue != "" && senhaValue != ""){
            fetch('http://localhost:5000/usuario', {
                mode: 'cors',
                credentials: 'include',
                method: "POST",
                headers:{
                    "Content-type": "application/json",
                },
                body: JSON.stringify(dados)
            }).then(resposta =>{
                ok = resposta.status == 200;
                return resposta.json();
            }).then(resposta =>{
                if(ok){
                    setMsgClass("msgSucess")
                    setMsg("Conta criada com sucesso! Redirecionando para o login...")

                    setTimeout(() =>{
                        router.push("/")
                    },2500)
                }
                else{
                    setMsgClass("msgError")
                    setMsg(resposta.msg)
                }
            })
        }
        else{
            setMsgClass("msgError")
            setMsg("Preencha os dados corretamente")
        }
        
    }

    return(
       <div className="background">
        <div className="Meucontainer" style={{ maxWidth: '500px' }}>

            <h2 className="form-title">Criar Nova Conta</h2>
            <p className="form-subtitle">Preencha seus dados para se cadastrar</p>

           <div className={msgClass}>
                {msg}
           </div>

            <form className="form">
                {/* Campo Nome */}
                <div className="input-group">
                    <div style={{ position: 'relative', width: '100%' }}>
                        <i className="fa-solid fa-user" style={{
                            position: 'absolute',
                            left: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#117180',
                            fontSize: '18px',
                            zIndex: 1
                        }}></i>
                        <input 
                            ref={nome} 
                            type="text" 
                            className="input-field" 
                            placeholder="Digite seu nome completo"
                            style={{ paddingLeft: '45px' }}
                        />
                    </div>
                </div>
                
                {/* Campo Email */}
                <div className="input-group">
                    <div style={{ position: 'relative', width: '100%' }}>
                        <i className="fa-solid fa-envelope" style={{
                            position: 'absolute',
                            left: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#117180',
                            fontSize: '18px',
                            zIndex: 1
                        }}></i>
                        <input 
                            ref={email} 
                            type="email" 
                            className="input-field" 
                            placeholder="Digite seu e-mail"
                            style={{ paddingLeft: '45px' }}
                        />
                    </div>
                </div>
                
                {/* Campo Senha */}
                <div className="input-group">
                    <div style={{ position: 'relative', width: '100%' }}>
                        <i className="fa-solid fa-lock" style={{
                            position: 'absolute',
                            left: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#117180',
                            fontSize: '18px',
                            zIndex: 1
                        }}></i>
                        <input 
                            ref={senha} 
                            type="password" 
                            className="input-field" 
                            placeholder="Digite sua senha (mínimo 6 caracteres)"
                            style={{ paddingLeft: '45px' }}
                        />
                    </div>
                </div>

                
                <button className="buttonLogin" type="button" onClick={validar}>
                    <span>CADASTRAR</span>
                </button>

                
                <div className="forgot-password" style={{ marginTop: '15px' }}>
                    <a href="/">Já tem uma conta? Faça login</a>
                </div>
            </form>
        </div>
    </div>
    )
}
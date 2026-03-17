
'use client'
import { useContext, useRef } from "react"
import { useRouter } from "next/navigation";
import UserContext from "./context/userContext.js";

export default function Login() {

    let email = useRef("");
    let senha = useRef("");
    let msgRef = useRef(null)

    let router = useRouter();

    let { user, setUser } = useContext(UserContext);
    
    function validar(){

        let emailValue = email.current.value
        let senhaValue = senha.current.value
        let ok = false

        let dados = {
            usuEmail: emailValue,
            usuSenha: senhaValue
        }

        msgRef.current.className = ''
        msgRef.current.innerHTML = ''

        if(emailValue != "" && senhaValue != ""){
            fetch('http://localhost:5000/login', {
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
                    router.push("/admin");
                    setUser(resposta.usuario);
                    localStorage.setItem("usuario", JSON.stringify(resposta.usuario));
                }
                else{
                    msgRef.current.className = "msgError";
                    msgRef.current.innerHTML = resposta.msg;
                }
            })
        }
        else{
            msgRef.current.className = 'msgError'
            msgRef.current.innerHTML = 'Preencha os dados corretamente'
        }
        
    }

    return (
        <div className="background">
            <div className="Meucontainer">

                <h2 className="form-title">Bem-vindo de volta!</h2>
                <p className="form-subtitle">Faça login para acessar sua conta</p>

                <div ref={msgRef}></div>

                <form className="form">
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
                                placeholder="Digite sua senha"
                                style={{ paddingLeft: '45px' }}
                            />
                        </div>
                    </div>

                    <button className="buttonLogin" type="button" onClick={validar}>
                        <span>ENTRAR</span>
                    </button>

                    <div className="forgot-password">
                        <a href="/enviarEmail">Esqueceu sua senha?</a>
                    </div>
                    <div className="forgot-password">
                        <a href="/cadastroUsuario">Criar conta</a>
                    </div>
                </form>
            </div>
        </div>
    )
}
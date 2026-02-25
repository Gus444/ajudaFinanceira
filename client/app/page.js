
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
                <div className="img-form">
                    <img src="/img/primus.png" className="img-format"></img>
                </div>

                <div ref={msgRef}>

                </div>

                <div>
                    
                    <form className="form">
                        
                        <div className="form-label p-2">
                            <i className="fa-solid fa-envelope fa-xl" style={{color: "#ffffff"}}></i>
                            <input ref={email} type="email" className="form-control form-control-lg" style={{fontSize:'1rem', width: '320px'}} placeholder="digite seu email"></input>
                        </div>
                        
                        
                        <div className="form-label p-2 pb-5">
                            <i className="fa-solid fa-lock fa-xl" style={{color: "#ffffff"}}></i>
                            <input ref={senha} type="password" className="form-control form-control-lg" style={{fontSize:'1rem', width: '320px'}} placeholder="digite sua senha"></input>
                        </div>

                        <button className="buttonLogin" type="button" onClick={validar}>
                            <span>LOGIN</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
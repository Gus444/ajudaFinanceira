'use client';

import { useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from "next/navigation";
import UserContext from "../context/userContext.js";
import Link from 'next/link';
import NaoAutorizado from '../components/naoAutorizado.js';
import Loading from '../components/loading.js';

export default function LayoutAdmin({ children }) {

  const router = useRouter();

  //config para aparecer o nome das paginas
  const pathName = usePathname();
  const parte = pathName.split("/");
  const paginaBase = parte[2]
  const nomesPaginas = {
    dashboard: "Dashboard",
    lancamentos: "Lançamentos",
    categorias: "Categorias",
    movimentacao: "Movimentação"
  }
  const titulo = nomesPaginas[paginaBase] || "Dashboard";
  //////////////////////////////////////////

  const { user, setUser } = useContext(UserContext);
  const [isClient, setIsClient] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // 👇 NOVO ESTADO PARA O MENU MOBILE
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Carregar usuário do localStorage
    const localUser = localStorage.getItem('usuario');
    if (localUser) {
      setUser(JSON.parse(localUser));
    }

    setLoading(false);
  }, [setUser]);

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  const handleLogout = () => {
        // Remover usuário e empresa do localStorage
        fetch('http://localhost:5000/login/logout', {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
            headers: {
                "Content-type": "application/json",
            },
        }).then(r => r.json());

        localStorage.removeItem('usuario');
        // Atualizar o contexto para remover as informações de user e emp
        setUser(null);
        // Redirecionar o usuário para a página de login ou outra página pública
        router.push('/');
    };

  if (loading) {
        return <Loading/>;
  }

  if (isClient && user == null) {
        return <NaoAutorizado/>
  }

  return (
    <div className="admin-layout">
      {/* 👇 HEADER MOBILE - SÓ APARECE EM CELULAR */}
      <div className="mobile-header d-md-none">
        <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <i className="fas fa-bars"></i>
        </button>
        <div className="mobile-logo">Flux</div>
        <div style={{ width: 40 }}></div>
      </div>

      {/* 👇 OVERLAY PARA FECHAR MENU AO CLICAR FORA */}
      <div className={`sidebar-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>

      {/* Sidebar - ADICIONEI A CLASSE 'open' PARA MOBILE */}
      <aside className={`sidebar ${isMinimized ? 'minimized' : ''} ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          {!isMinimized && (
            <div className="logo-section">
              <Link href="/admin" className="logo-wrapper">
                <div className="logo-icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 2L2 9L16 16L30 9L16 2Z" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 16L16 23L30 16" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 23L16 30L30 23" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="gradient" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#667eea"/>
                        <stop offset="1" stopColor="#764ba2"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="logo-text-modern">Flux</span>
              </Link>
              
              {/* Dropdown do usuário melhorado */}
              <div className="dropdown">
                <button 
                  className="btn btn-link nav-link dropdown-toggle d-flex align-items-center" 
                  id="userDropdown" 
                  type="button"
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                  style={{ 
                    background: 'transparent', 
                    border: 'none',
                    color: 'white',
                    padding: '0.5rem 1rem'
                  }}
                >
                  <i className="fa-solid fa-user-circle fa-lg me-2"></i>
                  <span className="user-name">
                    {user != null && isClient ? user.usuNome : "Carregando..."}
                  </span>
                </button>
                
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <Link href="/admin/perfil" className="dropdown-item">
                      <i className="fa-solid fa-user me-2"></i>
                      Meu Perfil
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/configuracoes" className="dropdown-item">
                      <i className="fa-solid fa-gear me-2"></i>
                      Configurações
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="fa-solid fa-sign-out-alt me-2"></i>
                      Sair
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
          
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isMinimized ? '→' : '←'}
          </button>
        </div>

        
        
        {/* Navegação */}
        <nav className={`sidebarNav ${isMinimized ? 'minimized' : ''}`}>
           {!isMinimized && (
          <ul>
            <li>
              <Link href="/admin" className="nav-link">
               <i className="fa-solid fa-chart-column"></i>
                {!isMinimized && <span className="nav-label">Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link href="/admin/movimentacao" className="nav-link">
                <span className="fa-solid fa-clipboard-list"></span>
                {!isMinimized && <span className="nav-label">Movimentação</span>}
              </Link>
            </li>
            <li>
              <Link href="/admin/categorias" className="nav-link">
                <span className="fa-regular fa-rectangle-list"></span>
                {!isMinimized && <span className="nav-label">Categorias</span>}
              </Link>
            </li>
          </ul>
           )}
        </nav>

        {/* Footer com botão de logout */}
        <div className={`sidebar-footer ${isMinimized ? 'minimized' : ''}`}>
          {!isMinimized && (
          <button className="logout-btn" onClick={handleLogout}>
            <span className="fa-solid fa-right-from-bracket"></span>
            {!isMinimized && <span>Sair</span>}
          </button>
          )}
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="main-content">
        <header className="content-header">
          <div className="header-left">
            <h1 className="page-title">{titulo}</h1>
            <nav className="breadcrumb">
              <span>Admin</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-active">{titulo}</span>
            </nav>
          </div>          
        </header>

        <div className="content-container">
          {children}
        </div>
      </main>
    </div>
  );
}
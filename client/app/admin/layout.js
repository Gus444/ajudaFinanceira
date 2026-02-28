'use client';

import { useContext, useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import UserContext from "../context/userContext.js";
import Link from 'next/link';
import NaoAutorizado from '../components/naoAutorizado.js';

export default function LayoutAdmin({ children }) {
  const router = useRouter();

  const { user, setUser } = useContext(UserContext);
  const [isClient, setIsClient] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Carregar usuário do localStorage
    const localUser = localStorage.getItem('usuario');
    if (localUser) {
      setUser(JSON.parse(localUser));
    }
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

  if (isClient && user == null) {
        return <NaoAutorizado/>
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
        <div className="sidebar-header">
          {!isMinimized && (
            <div className="logo-section">
              <Link href="/admin" className="logo-text text-decoration-none">
                FinanSystem
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
                <span className="nav-icon">📊</span>
                {!isMinimized && <span className="nav-label">Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link href="/admin/movimentacao" className="nav-link">
                <span className="nav-icon">💰</span>
                {!isMinimized && <span className="nav-label">Movimentação</span>}
              </Link>
            </li>
            <li>
              <Link href="/admin/gastos" className="nav-link">
                <span className="nav-icon">💳</span>
                {!isMinimized && <span className="nav-label">Gastos</span>}
              </Link>
            </li>
            <li>
              <Link href="/admin/categorias" className="nav-link">
                <span className="nav-icon">🐎</span>
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
            <span className="logout-icon">🚪</span>
            {!isMinimized && <span>Sair</span>}
          </button>
          )}
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="main-content">
        <header className="content-header">
          <div className="header-left">
            <h1 className="page-title">Dashboard</h1>
            <nav className="breadcrumb">
              <span>Admin</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-active">Dashboard</span>
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
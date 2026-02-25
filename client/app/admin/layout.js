'use client';

import { useContext, useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import UserContext from "../context/userContext.js";
import Link from 'next/link';

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

  const isAdmin = user && user.usuNivel === 0;

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    setUser(null);
    router.push('/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
        <div className="sidebar-header">
          {!isMinimized && (
            <div className="logo-section">
              <Link href="/admin" className="logo-text">
                FinanSystem
              </Link>
            </div>
          )}
          
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isMinimized ? '→' : '←'}
          </button>
        </div>

        
        
        {/* Navegação */}
        <nav className="sidebar-nav">
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
            {isAdmin && !isMinimized && (
              <>
                <li>
                  <Link href="/admin/usuarios" className="nav-link">
                    <span className="nav-icon">👥</span>
                    <span className="nav-label">Usuários</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Footer com botão de logout */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            {!isMinimized && <span>Sair</span>}
          </button>
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
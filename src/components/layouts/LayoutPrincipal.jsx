// layouts/LayoutPrincipal.jsx
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../layouts/SideBar';
import Navbar from '../layouts/Navbar';

export default function LayoutPrincipal() {
  // Inicializar estado directamente desde localStorage (lazy initialization)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState !== null ? JSON.parse(savedState) : false;
  });

  // Escuchar cambios en el sidebar
  useEffect(() => {
    const handleSidebarChange = (e) => {
      setSidebarCollapsed(e.detail.collapsed);
    };
    
    window.addEventListener('sidebarCollapsed', handleSidebarChange);
    
    return () => window.removeEventListener('sidebarCollapsed', handleSidebarChange);
  }, []); // Sin dependencias, solo se ejecuta una vez

  // Calcular el margen izquierdo según el estado del sidebar
  const sidebarWidth = sidebarCollapsed ? 'ml-20' : 'ml-64';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <Navbar />
      
      <main className={`
        ${sidebarWidth} 
        pt-16 
        p-4 sm:p-6 
        transition-all duration-300 ease-in-out
        min-h-screen
      `}>
        <div className="max-w-7xl mx-auto">
          {/* Contenido principal con animación suave */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
          
          {/* Footer opcional */}
          <footer className="mt-8 text-center text-xs text-gray-400">
            <p>LAB UTM - Sistema de Trazabilidad de Análisis de Laboratorio</p>
            <p className="mt-1">© {new Date().getFullYear()} - Todos los derechos reservados</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
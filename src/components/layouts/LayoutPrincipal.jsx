// layouts/LayoutPrincipal.jsx
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/layouts/SideBar';
import Navbar from '../../components/layouts/Navbar';

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
  }, []);

  // Calcular el margen izquierdo según el estado del sidebar
  const sidebarWidth = sidebarCollapsed ? 'ml-20' : 'ml-64';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
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
          
          {/* Footer con identidad CABA UTM */}
          <footer className="mt-8 pt-6 text-center text-xs border-t" style={{ borderColor: '#E5E5E5' }}>
            <p style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>
              CABA UTM - Centro de Análisis Biológico y Agroalimentario
            </p>
            <p className="mt-1" style={{ color: '#999999' }}>
              Sistema de Trazabilidad de Análisis de Laboratorio
            </p>
            <p className="mt-2" style={{ color: '#CCCCCC' }}>
              © {new Date().getFullYear()} - Universidad Técnica de Manabí
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
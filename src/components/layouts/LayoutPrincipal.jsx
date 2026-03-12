// layouts/LayoutPrincipal.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../layouts/SideBar';
import Navbar from '../layouts/Navbar';

export default function LayoutPrincipal() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      
      <main className="ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
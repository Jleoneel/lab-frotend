// store/authStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (userData, token) => {
        // Guardar en localStorage también para axios
        localStorage.setItem('token', token);
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
        }
        
        set({
          user: userData,
          token: token,
          isAuthenticated: true
        });
      },
      
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
      },
      
      // Método para verificar autenticación
      checkAuth: () => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({
              user,
              token,
              isAuthenticated: true
            });
            return true;
          } catch (e) {
            // Error parseando usuario del localStorage
          }
        }
        
        set({ isAuthenticated: false });
        return false;
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Solo persistir estos campos
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
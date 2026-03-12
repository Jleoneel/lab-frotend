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
        console.log('📝 Store login - guardando:', { userData, token });
        
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
        
        // Verificar que se guardó
        setTimeout(() => {
          const state = get();
          console.log('✅ Store después de login:', state);
        }, 0);
      },
      
      logout: () => {
        console.log('📝 Store logout');
        
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
        
        console.log('🔍 checkAuth - token:', token ? 'presente' : 'ausente');
        
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
            console.error('Error parsing user:', e);
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
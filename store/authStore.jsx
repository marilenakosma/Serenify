import { create } from "zustand";
import { getItem, removeItem, setItem } from "./storage";

export const useAuthStore = create((set,get) => ({
    //STATE
  isAuthenticated: false,
  accessToken:null,
  refreshToken:null,
  user:null,
  accessTokenExpiration:null,
  isLoading: false,
  // Serenify-specific state
    hasCompletedQuestionnaire: false,
    questionnaireResults: null,

  setIsAuthenticated: isAuthenticated => set({ isAuthenticated }),

  login: async(email,password) => {
    set({ isLoading: true }); 

     try {
            // Mock login for development - replace with your API
            const mockLogin = async () => {
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
                
                // Mock successful response
                return {
                    id: '1',
                    email: email,
                    username: email.split('@')[0], // Extract username from email
                    accessToken: 'mock-access-token',
                    refreshToken: 'mock-refresh-token',
                };
            };

  const data = await mockLogin();

  const authData = {
    isAuthenticated: true,
    accessToken: data.accessToken,
    refreshToken:data.refreshToken,
    user: {
                    id: data.id,
                    email: data.email,
                    username: data.username,
                },
    accessTokenExpiration:Date.now() + (60*60 * 1000), //1 hour
    isLoading: false,
  };
   
  //save in MMKV
  setItem("authData",authData)
  
  //save in Zustand
  set(authData);
  return {success:true};

} catch(error) {
    console.error('Login error:', error);
    set({ isLoading: false });
    return { success: false, error: error.message || 'Login failed' };
}
  },
  register: async (name, email, password) => {
        set({ isLoading: true });
        
        try {
            // Mock registration - replace with your API
            const mockRegister = async () => {
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                return {
                    id: Date.now().toString(),
                    email: email,
                    username: name.toLowerCase().replace(/\s+/g, ''), // Convert "John Doe" to "johndoe"
                    accessToken: 'mock-access-token',
                    refreshToken: 'mock-refresh-token',
                };
            };

            const data = await mockRegister();
            
            const authData = {
                isAuthenticated: true,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                user: {
                    id: data.id,
                    email: data.email,
                    username: data.username,
                },
                accessTokenExpiration: Date.now() + (60 * 60 * 1000),
                isLoading: false,
                hasCompletedQuestionnaire: false, // New users need questionnaire
            };

            setItem("authData", authData);
            set(authData);
            
            return { success: true };

        } catch (error) {
            console.error('Register error:', error);
            set({ isLoading: false });
            return { success: false, error: error.message || 'Registration failed' };
        }
    },
  logout: async () => {
        try {
            // Optional: Call logout API endpoint here
            
            // Clear MMKV storage
            removeItem("authData");
            
            // Reset Zustand state
            set({
                isAuthenticated: false,
                accessToken: null,
                refreshToken: null,
                user: null,
                accessTokenExpiration: null,
                isLoading: false,
                hasCompletedQuestionnaire: false,
                questionnaireResults: null,
            });
            
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    },

    completeQuestionnaire: (results) => {
        const updatedData = {
          hasCompletedQuestionnaire: true,
          questionnaireResults:results,
        };

        const currentAuthData = getItem("authData");
        if(currentAuthData) {
            setItem("authData",{...currentAuthData,...updatedData});
        }

        set(updatedData)
    },

  checkAuth: async () => {
        try {
            const authData = getItem("authData");
            if (authData) {
                // Check if token is still valid
                if (authData.accessTokenExpiration && Date.now() < authData.accessTokenExpiration) {
                    set(authData);
                    return true;
                } else {
                    // Token expired, clear auth
                    removeItem("authData");
                    return false;
                }
            }
            return false;
        } catch (error) {
            console.error('Auth check error:', error);
            return false;
        }
    },

  // Helper getters - using username instead of fullName
    getDisplayName: () => {
        const state = get();
        return state.user?.username || 'User';
    },

    getUserEmail: () => {
        const state = get();
        return state.user?.email || '';
    },

    isTokenValid: () => {
        const state = get();
        return state.accessTokenExpiration && Date.now() < state.accessTokenExpiration;
    },

    canAccessDashboard: () => {
        const state = get();
        return state.isAuthenticated && state.hasCompletedQuestionnaire && state.isTokenValid();
    },

    // Development helper
    resetAuth: () => {
        removeItem("authData");
        set({
            isAuthenticated: false,
            accessToken: null,
            refreshToken: null,
            user: null,
            accessTokenExpiration: null,
            isLoading: false,
            hasCompletedQuestionnaire: false,
            questionnaireResults: null,
        });
    },
}))

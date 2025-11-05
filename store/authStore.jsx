import { create } from "zustand";
import { getItem, removeItem, setItem } from "./storage";
import { persist, createJSONStorage } from 'zustand/middleware'

export const useAuthStore = create((set,get) => ({
    //STATE
  isAuthenticated: false,
  accessToken:null,
  refreshToken:null,
  user:null,
  accessTokenExpiration:null,
  isLoading: false,
  // Questionnaire specific state
  hasCompletedQuestionnaire: false,
  questionnaireResults: null,

  userHabits: [],
  habitCompletions: {}, // { habitId: { '2024-11-02': true } }

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
   
  // Check if this user has completed questionnaire before  
  const existingQuestionnaire = getItem(`questionnaire_${data.id}`);

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
    hasCompletedQuestionnaire: !!existingQuestionnaire, //existingQuestionnaire ? true : false,
    questionnaireResults: existingQuestionnaire?.results || null,
    isRetakingQuestionnaire: false, 
    showingResults: false,
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
                isRetakingQuestionnaire: false,
                userHabits:[],
                habitCompletions: {},
            });
            
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    },

    completeQuestionnaire: (results) => {
        const state = get();
        const userId = state.user?.id;

        if(userId) {
            setItem(`questionnaire_${userId}`, {
                completed:true,
                timestamp:Date.now(),
                results:results
            })
        }

        const updatedData = {
          hasCompletedQuestionnaire: true,
          questionnaireResults:results,
          isRetakingQuestionnaire: false, 
          showingResults: true,
        };

        const currentAuthData = getItem("authData");
        if(currentAuthData) {
            setItem("authData",{...currentAuthData,...updatedData});
        }

        set(updatedData)
    },
    finishShowingResults: () => {
        set({ showingResults: false }); 
    },

    retakeQuestionnaire:() => {
        const state = get();
        const userId = state.user?.id;

        if (userId) {
            // Clear user's questionnaire data
            removeItem(`questionnaire_${userId}`);
            
            // Update current session to show questionnaire incomplete
            const updatedData = {
                hasCompletedQuestionnaire: false,
                questionnaireResults: null,
                isRetakingQuestionnaire: true,
            };
            
            // Update session storage
            const currentAuthData = getItem("authData");
            if (currentAuthData) {
                setItem("authData", { ...currentAuthData, ...updatedData });
            }
            
            set(updatedData);
        }
    },

    addHabits: (newHabits) => {
     const currentState = get();
     const updatedHabits = [...currentState.userHabits,...newHabits];
     
     // Update Zustand (in-memory)
     set({userHabits:updatedHabits})

     // Update MMKV (persistent storage)
     const currentAuthData = getItem("authData");
        if (currentAuthData) {
            setItem("authData", { ...currentAuthData, userHabits: updatedHabits });
        }
    },

    removeHabit:(habitId) => {
     const currentState = get();
     const filteredHabits = currentState.userHabits.filter(h => h.id !== habitId);
    
     set({userHabits:filteredHabits});

     const currentAuthData = getItem("authData");
        if (currentAuthData) {
            setItem("authData", { ...currentAuthData, userHabits: filteredHabits });
        }
    },

    toggleHabitCompletion: (habitId,date = null) => {
     const today = date || new Date().toISOString().split('T')[0]; //2025-11-04T00:00:00.000Z -> 2025-11-04
     const currentState = get();

     const completions = {...currentState.habitCompletions};
     /* completions = {
        "morning-run": {
          "2025-11-01": true,
          "2025-11-02": false,
          "2025-11-03": true,
          "2025-11-04": true
        },
        "meditation": {
        "2025-11-04": false
       }
     }
    */

     //Initialize habit tracking
     if(!completions[habitId]) {
        completions[habitId] = {};
     }

     const isCurrentlyCompleted = completions[habitId][today] || false; // completions["morning-run"]["2025-11-04"]  
        completions[habitId][today] = !isCurrentlyCompleted;

     const updatedHabits = currentState.userHabits.map(habit => {
      if(habit.id === habitId) {
        return {
          ...habit,
          streak:calculateStreak(habitId,completions),
          lastCompleted: !isCurrentlyCompleted ? today : habit.lastCompleted
        };
      }
      return habit;
     })

     set({
        habitCompletions:completions,
        userHabits:updatedHabits
     })

     const currentAuthData = getItem("authData");
        if (currentAuthData) {
            setItem("authData", { 
                ...currentAuthData, 
                habitCompletions: completions,
                userHabits: updatedHabits 
            });
        }

    },

    getHabitCompletion: (habitId, date = null) => {
        const today = date || new Date().toISOString().split('T')[0];
        const state = get();
        return state.habitCompletions[habitId]?.[today] || false;
    },

    updateUser: (userData) => {
        //Partially update user data(update data from quiz results)
        const currentState = get(); //το χρειαζόμαστε γιατι χωρίς αυτο το set updated User 
        // θα αντικαταστούσε το αντικείμενο(με μονο την ανάλυση των απαντήσεων) αντι να κάνει overwrite την αντίστοιχη ιδιότητα
        const updatedUser= {...currentState.user, ...userData};
        
        // Update Zustand (in-memory)
        set({user:updatedUser})
        
        // Update MMKV (persistent storage)
        const currentAuthData = getItem("authData");
        if (currentAuthData) {
            setItem("authData", { ...currentAuthData, user: updatedUser });
        }
    },

  checkAuth: async () => {
        try {
            const authData = getItem("authData");
            if (authData) {
                // Check if token is still valid
                if (authData.accessTokenExpiration && Date.now() < authData.accessTokenExpiration) {
                    set({
                        ...authData,
                        userHabits: authData.userHabits || [],
                        habitCompletions: authData.habitCompletions || {}
                    });
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
            isRetakingQuestionnaire: false, 
            userHabits:[],
            habitCompletions: {},
        });
    },
}))

const calculateStreak = (habitId, completions) => {
    if (!completions[habitId]) return 0;
    
    const habitCompletions = completions[habitId];
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        
        if (habitCompletions[dateStr]) {
            streak++;
        } else {
            break;
        }
    }
    
    return streak;
};

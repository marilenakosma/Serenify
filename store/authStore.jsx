import { create } from "zustand";
import { getItem, removeItem, setItem } from "./storage";
import { Alert } from "react-native";
import { shouldTrackHabitOnDate,
         isHabitCompleteForPeriod,getCompletionsThisWeek,
         calculateFrequencyAwareStreak,
         getRequiredCompletionsPerWeek} from "../constants/habitFrequency";


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

  todayMood:null,
  moodHistory:{},

  kindnessCompletions:{},

  reflections:[],

  worryEntries: [],

  points: 0,
  level: 1,
  pointsHistory: [],

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

    setTodayMood: async(moodData) => {
        try {
         const today = new Date().toDateString();
         const moodEntry = {
            ...moodData,
            date:today,
            timestamp: new Date().toISOString()
         };

         // Save to storage
         await setItem(`mood_${today}`, moodEntry);
      
        // Update history
        const currentHistory = get().moodHistory;
        const updatedHistory = {
        ...currentHistory,
        [today]: moodEntry
        };

        await setItem('mood_history', updatedHistory);
      
        set({ 
          todayMood: moodEntry,
          moodHistory: updatedHistory
        });

        console.log('Mood saved successfully');
        return { success: true };
        } catch(error) {
          console.error('Error saving mood:', error);
          return { success: false, error: error.message };
        }
    },

    loadTodayMood: async () => {
     try {
        const today = new Date().toDateString();
        const todayMood = await getItem(`mood_${today}`);
        const moodHistory = await getItem('mood_history') || {};
      
        set({ 
          todayMood,
          moodHistory 
        });
      
        return todayMood;

     } catch(error) {
        console.error('Error loading mood:', error);
        return null;
     }
    },

    getMoodHistory: () => {
        return get().moodHistory;
    },

    clearMoodData: async () => {
    try {
      await removeItem('mood_history');
      // Remove today's mood
      const today = new Date().toDateString();
      await removeItem(`mood_${today}`);
      
      set({ 
        todayMood: null,
        moodHistory: {} 
      });
      
      console.log('Mood data cleared');
      return { success: true };
    } catch (error) {
      console.error(' Error clearing mood data:', error);
      return { success: false, error: error.message };
    }
  },

    addHabits: async (newHabits) => {
      try {
        const currentState = get();
      
     //Single habit / array of habits
        const habitsToAdd = Array.isArray(newHabits) ? newHabits : [newHabits];
     
        const existingIds = currentState.userHabits.map(h => h.id);
        const uniqueHabits = habitsToAdd.filter(habit => !existingIds.includes(habit.id));

        if(uniqueHabits.length === 0) {
          console.log('All habits already exist');
          return { success: false, error: 'Habits already exist'};
        }

        const updatedHabits = [...currentState.userHabits,...uniqueHabits];
     
        // Update Zustand (in-memory)
        set({userHabits:updatedHabits})

     // Update MMKV (persistent storage)
        try {
            const currentAuthData = await getItem("authData");
            if (currentAuthData) {
                await setItem("authData", { ...currentAuthData, userHabits: updatedHabits });
            }
        } catch (storageError) {
            console.warn('Storage update failed:', storageError);
            // Don't fail the whole operation for storage errors
        }

        console.log('Habits added successfully:', uniqueHabits.length);
        return { success:true, added: uniqueHabits.length };
      } catch (error) {
        console.error(' Error in addHabits:', error);
        return { success: false, error: error.message };
      }
    },

  removeHabit: (habitId) => {
  console.log('removeHabit called with ID:', habitId);
  
  const currentState = get();
  console.log('Current habits before removal:', currentState.userHabits);
  
  // Check if habit exists
  const habitToRemove = currentState.userHabits.find(h => h.id === habitId);
  if (!habitToRemove) {
    console.log('Habit not found with ID:', habitId);
    return;
  }
  
  console.log('Found habit to remove:', habitToRemove);
  
  const filteredHabits = currentState.userHabits.filter(h => h.id !== habitId);
  
  // Remove completion data for this habit
  const updatedCompletions = { ...currentState.habitCompletions };
  delete updatedCompletions[habitId];

  console.log('Filtered habits:', filteredHabits);

  // Update store 
  set({ 
    userHabits: filteredHabits,
    habitCompletions: updatedCompletions 
  });

  // Persist to storage
  try {
    const currentAuthData = getItem("authData");
    if (currentAuthData) {
      setItem("authData", { 
        ...currentAuthData, 
        userHabits: filteredHabits,
        habitCompletions: updatedCompletions 
      });
      console.log('Successfully persisted habit removal');
    }
  } catch (error) {
    console.error('Error persisting habit removal:', error);
  }
},

   addPoints: (amount,source) => {
     const currentState = get();
     const newPoints = (currentState.points || 0) + amount;
     
     // 100 points = 1 level
     const newLevel = Math.floor(newPoints / 100) + 1;

     const pointEntry = {
       amount,
       source, //'habit-completed', 'activity-finished'
       timestamp: new Date().toISOString(),
       totalPoints: newPoints,
     };

     const updatedHistory = [...(currentState.pointsHistory || []),pointEntry];

     set({
      points:newPoints,
      level:newLevel,
      pointsHistory: updatedHistory
     });

    const currentAuthData = getItem("authData");
    if (currentAuthData) {
      setItem("authData", { 
        ...currentAuthData, 
        points: newPoints,
        level: newLevel,
        pointsHistory: updatedHistory
     });
    }

    console.log(`+${amount} points from ${source}! Total: ${newPoints} (Level ${newLevel})`);
    return { newPoints, newLevel };
    
    
   },

   getPoints: () => {
     return get().points || 0;
   },

   getLevel: () => {
    return get().level || 1;
   },

   getPointsForNextLevel: () => {
    const currentPoints = get().points || 0;
    const currentLevel = get().level || 1;
    const pointsForNextLevel = currentLevel * 100;
    const pointsNeeded = pointsForNextLevel - currentPoints;
    return { pointsForNextLevel, pointsNeeded };
   },

   getLevelName: () => {
     const level = get().level || 1;
  
     if (level >= 10) return 'Master';
     if (level >= 7) return 'Expert';
     if (level >= 5) return 'Advanced';
     if (level >= 3) return 'Intermediate';
     return 'Beginner';
    },

    toggleHabitCompletion: (habitId,date = null) => {
     //const today = date || new Date().toISOString().split('T')[0]; //2025-11-04T00:00:00.000Z -> 2025-11-04
     const currentState = get();

     const habit = currentState.userHabits.find(h => h.id === habitId);

     if(!habit) return;

     const targetDate = date ? new Date(date) : new Date();
     const dateStr = targetDate.toISOString().split('T')[0];

     if (!shouldTrackHabitOnDate(habit.frequency, targetDate)) {
    Alert.alert(
      'Not Trackable',
      `This habit (${habit.frequency}) cannot be completed on this day.`
    );
    return;
  }

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

     const isCurrentlyCompleted = completions[habitId][dateStr] || false; 
     // completions["morning-run"]["2025-11-04"]  

    completions[habitId][dateStr] = !isCurrentlyCompleted;

    const today = new Date();
     
    const newStreak = calculateFrequencyAwareStreak(habit.frequency, completions[habitId], today);
     
     const updatedHabits = currentState.userHabits.map(habit => {
      if(habit.id === habitId) {
        return {
          ...habit,
          streak:newStreak,
          lastCompleted: !isCurrentlyCompleted ? dateStr : null
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

      if (!isCurrentlyCompleted) {
       const pointsToAward = habit.points || 10; // Use habit's points or default to 10
       get().addPoints(pointsToAward, `habit-${habitId}`);
      }

    },

    updateHabit:(habitId,updatedHabit) => {
     const currentState = get();

     const currentHabit = currentState.userHabits.find(h => h.id === habitId);
     if(!currentHabit) return;

     const habitToUpdate = {
        ...updatedHabit,
        streak:currentHabit.streak,
        lastCompleted: currentHabit.lastCompleted,
        dateAdded:currentHabit.dateAdded,
     }

     const updatedHabits = currentState.userHabits.map(habit => 
        habit.id === habitId ? habitToUpdate : habit 
     );

     set({userHabits:updatedHabits});

     const currentAuthData = getItem("authData");
  if (currentAuthData) {
    setItem("authData", { 
      ...currentAuthData, 
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
    
    if (!authData) {
      return false;
    }

    // Check token expiration
    if (authData.accessTokenExpiration && Date.now() < authData.accessTokenExpiration) {
      set({
        ...authData,
        userHabits: authData.userHabits || [],
        habitCompletions: authData.habitCompletions || {},
        points: authData.points || 0,
        level: authData.level || 1,
        pointsHistory: authData.pointsHistory || [],
      });
      return true;
    } else {
      // Token expired, clear auth
      removeItem("authData");
      return false;
    }
  } catch (error) {
    console.error('Error in checkAuth:', error);
    return false;
  }
},
refreshHabitTranslations: (t, getExtraGoals) => {
  const { getAvailableHabits } = require('../constants/availableHabits');
  const currentState = get();
  
  // Get fresh translations from availableHabits
  const allAvailableHabits = getAvailableHabits(t);
  const allHabitsMap = {};
  
  // Create a map of habit ID to fresh habit data
  Object.values(allAvailableHabits).flat().forEach(habit => {
    allHabitsMap[habit.id] = habit;
  });
  
  // Also include goals from goalIdeas 
  if (getExtraGoals) {
    getExtraGoals(t).forEach(goal => {
      allHabitsMap[goal.id] = goal;
    });
  }
  
  // Update userHabits with fresh translations
  const updatedHabits = currentState.userHabits.map(userHabit => {
    const freshHabit = allHabitsMap[userHabit.id];
    
    if (freshHabit) {
      // R translatable fields -> fresh translations
      return {
        ...userHabit,
        title: freshHabit.title,
        text: freshHabit.title,
        category: freshHabit.category,
        duration: freshHabit.duration,
        description: freshHabit.description,
        difficulty: freshHabit.difficulty,
      };
    }
    
    return userHabit; //custom habits 
  });
  
  set({ userHabits: updatedHabits });
  
  const currentAuthData = getItem("authData");
  if (currentAuthData) {
    setItem("authData", { ...currentAuthData, userHabits: updatedHabits });
  }
},

    toggleKindnessAct:(actId,date=null) => {
      const currentState = get();

      const targetDate = date ? 
      new Date(date).toDateString() :  
      new Date().toDateString();

      const completions = {...currentState.kindnessCompletions };

      if(!completions[targetDate]) {
        completions[targetDate] = [];
      }

      const actIndex = completions[targetDate].indexOf(actId);

      if(actIndex > -1) {
        completions[targetDate] = completions[targetDate].filter(id => id !== actId);
      } else {
        completions[targetDate] = [...completions[targetDate],actId]
      }

      set({ kindnessCompletions: completions });

      const currentAuthData = getItem("authData");
      if (currentAuthData) {
        setItem("authData", { 
        ...currentAuthData, 
        kindnessCompletions: completions 
      });
    }
     
     console.log('Kindness act completed!');
    },
  
    getTodayKindnessCount: () => {
     const state = get();
     const today = new Date().toDateString();
     const todayActs = state.kindnessCompletions[today] || [];
     return todayActs.length;
   },

   getKindnessCompletions: (date = null) => {
    const targetDate = date ? new Date(date).toDateString() : new Date().toDateString();
    const state = get();
    return state.kindnessCompletions[targetDate] || [];
  },
  
  getTotalKindnessActs: () => {
    const state = get();
    return Object.values(state.kindnessCompletions)
      .flat()
      .length;
  },

  saveReflection: (text) => {
    const state = get();
    const today = new Date().toDateString();
    const newEntry = { text, date: today };
    const updated = [newEntry, ...(state.reflections || [])];

    set({ reflections: updated });
  
    const currentAuthData = getItem("authData");
       if (currentAuthData) {
         setItem("authData", { 
         ...currentAuthData, 
         reflections: updated
       });

      }
  },

  getReflections: () => {
    const state = get();
    return state.reflections || [];
  },
  
  getWorryEntries: () => {
    return get().worryEntries || [];
  },

  addWorryEntry: (entry) => {
    try {
    const state = get();
    //const today = new Date().toDateString();
    //const newEntry = { text, date: today };
    const updated = [entry, ...(state.worryEntries || [])];

    set({ worryEntries: updated });
  
    const currentAuthData = getItem("authData");
       if (currentAuthData) {
         setItem("authData", { 
         ...currentAuthData, 
         worryEntries: updated
       });

      }
    } catch (error) {
      console.error('Error adding worry entry:', error);
      return { success: false, error };
    }
  },

  loadWorryEntries: async () => {
    try {
      const userId = get().user?.id;
      if (!userId) return;

      const stored = await getItem(`worryEntries_${userId}`);
      if (stored) {
        set({ worryEntries: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Error loading worry entries:', error);
    }
  },

  deleteWorryEntry: (entryId) => {
    try {
      const currentEntries = get().worryEntries || [];
      const updatedEntries = currentEntries.filter(entry => entry.id !== entryId);
      
      set({ worryEntries: updatedEntries });

      const currentAuthData = getItem("authData");
       if (currentAuthData) {
         setItem("authData", { 
         ...currentAuthData, 
         worryEntries: updatedEntries
       });
       }

      return { success: true };
    } catch (error) {
      console.error('Error deleting worry entry:', error);
      return { success: false, error };
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
            todayMood:null,
            moodHistory:{},
            kindnessCompletions:{},
            reflections:[],
            worryEntries: [],
            points:0,
            level:1,
            pointsHistory:[],
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

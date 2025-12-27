import { create } from "zustand";
import { getItem, removeItem, setItem } from "./storage";
import { Alert } from "react-native";
import { useTranslation } from '../constants/translations';
import { 
  shouldTrackHabitOnDate,
  isHabitCompleteForPeriod,
  getCompletionsThisWeek,
  calculateFrequencyAwareStreak,
  getRequiredCompletionsPerWeek,
  hasPointsBeenAwarded,
  markPointsAwarded,
  clearPointsAwarded,
  canToggleHabitCompletion,
  detectStreakBreak
  } from "../constants/habitFrequency";
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getUserData,
  updateUserData,
  saveHabits,
  saveHabitCompletions,
  updatePoints,
  saveMood,
  getMoodHistory,
  saveReflection as saveReflectionToFirebase,
  getReflections as getReflectionsFromFirebase,
  saveWorryEntry as saveWorryToFirebase,
  getWorryEntries as getWorriesFromFirebase,
  deleteWorryEntry as deleteWorryFromFirebase,
  signInWithGoogle 
} from '../app/services/firebaseService';

const removeUndefined = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  );
};

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
  
  //Firebase User ID
  userId: null,
  

  setIsAuthenticated: isAuthenticated => set({ isAuthenticated }),
  
  // ==================== LOGIN ====================
  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const result = await loginUser(email, password);

      if (result.success) {
        const user = result.user;

        // Fetch user data with error handling
        const userDataResult = await getUserData(user.uid);

        const userData = userDataResult.success ? userDataResult.data : {
          username: user.email.split('@')[0],
          displayName: user.displayName || user.email.split('@')[0],
          hasCompletedQuestionnaire: false,
          points: 0,
          level: 1,
        };

        // Fetch subcollections 
        const [moodResult, reflectionsResult, worriesResult] = await Promise.allSettled([
          getMoodHistory(user.uid),
          getReflectionsFromFirebase(user.uid),
          getWorriesFromFirebase(user.uid)
        ]);

        const authData = {
          isAuthenticated: true,
          userId: user.uid,
          user: {
            id: user.uid,
            email: user.email,
            username: userData.username,
            displayName: userData.displayName,
            focusArea: userData.focusArea,
          },
          isLoading: false,
          hasCompletedQuestionnaire: userData.hasCompletedQuestionnaire || false,
          questionnaireResults: userData.questionnaireResults || null,
          userHabits: userData.userHabits || [],
          habitCompletions: userData.habitCompletions || {},
          points: userData.points || 0,
          level: userData.level || 1,
          pointsHistory: userData.pointsHistory || [],
          todayMood: userData.todayMood || null,
          moodHistory: moodResult.status === 'fulfilled' && moodResult.value?.success 
            ? moodResult.value.data : {},
          kindnessCompletions: userData.kindnessCompletions || {},
          reflections: reflectionsResult.status === 'fulfilled' && reflectionsResult.value?.success 
            ? reflectionsResult.value.data : [],
          worryEntries: worriesResult.status === 'fulfilled' && worriesResult.value?.success 
            ? worriesResult.value.data : [],
        };

        setItem("authData", authData);
        set(authData);

        return { success: true };
      }

      set({ isLoading: false });
      return result;

    } catch (error) {
      console.error('Login error:', error);
      set({ isLoading: false });
      return { success: false, error: error.message || 'Login failed' };
    }
  },

  // ==================== GOOGLE SIGN-IN ====================
loginWithGoogle: async (idToken) => {
  set({ isLoading: true });

  try {
    const result = await signInWithGoogle(idToken);

    if (result.success) {
      const user = result.user;
      const isNewUser = result.isNewUser;

      // Fetch user data
      const userDataResult = await getUserData(user.uid);

      const userData = userDataResult.success ? userDataResult.data : {
        username: user.email.split('@')[0],
        displayName: user.displayName || user.email.split('@')[0],
        hasCompletedQuestionnaire: false,
        points: 0,
        level: 1,
      };

      // Fetch subcollections
      const [moodResult, reflectionsResult, worriesResult] = await Promise.allSettled([
        getMoodHistory(user.uid),
        getReflectionsFromFirebase(user.uid),
        getWorriesFromFirebase(user.uid)
      ]);

      const moodHistory = moodResult.status === 'fulfilled' && moodResult.value.success 
        ? moodResult.value.data 
        : {};

      const reflections = reflectionsResult.status === 'fulfilled' && reflectionsResult.value.success
        ? reflectionsResult.value.data
        : [];

      const worryEntries = worriesResult.status === 'fulfilled' && worriesResult.value.success
        ? worriesResult.value.data
        : [];

      const authData = {
        isAuthenticated: true,
        userId: user.uid,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: userData.displayName,
          username: userData.username,
          photoURL: user.photoURL,
          hasCompletedQuestionnaire: userData.hasCompletedQuestionnaire || false,
          focusArea: userData.focusArea || null,
        },
        hasCompletedQuestionnaire: userData.hasCompletedQuestionnaire || false,
        questionnaireResults: userData.questionnaireResults || null,
        userHabits: userData.userHabits || [],
        habitCompletions: userData.habitCompletions || {},
        kindnessCompletions: userData.kindnessCompletions || {},
        points: userData.points || 0,
        level: userData.level || 1,
        pointsHistory: userData.pointsHistory || [],
        todayMood: userData.todayMood || null,
        moodHistory: moodHistory,
        reflections: reflections,
        worryEntries: worryEntries,
        isLoading: false,
      };

      setItem("authData", authData);

      set(authData);

      return { success: true, isNewUser };
    } else {
      set({ isLoading: false });
      return result;
    }
  } catch (error) {
    console.error('Google login error in store:', error);
    set({ isLoading: false });
    return { 
      success: false, 
      error: error.message,
      errorKey: 'errors.unknownError'
    };
  }
},

  // ==================== REGISTER ====================
  register: async (name, email, password) => {
  set({ isLoading: true });
  
  try {
    const result = await registerUser(name, email, password);
    
    if (result.success) {
      const user = result.user;
      
      // Create auth data immediately (don't wait for Firestore reads)
      const authData = {
        isAuthenticated: true,
        userId: user.uid,
        user: {
          id: user.uid,
          email: user.email,
          username: name.toLowerCase().replace(/\s+/g, ''),
          displayName: name,
        },
        isLoading: false,
        hasCompletedQuestionnaire: false,
        questionnaireResults: null,
        userHabits: [],
        habitCompletions: {},
        points: 0,
        level: 1,
        pointsHistory: [],
        todayMood: null,
        moodHistory: {},
        kindnessCompletions: {},
        reflections: [],
        worryEntries: [],
      };

      // Save to MMKV cache
      setItem("authData", authData);
      
      // Update state (this triggers navigation)
      set(authData);
      
      //console.log('Auth state updated:', { 
      //  isAuthenticated: true, 
      //  hasCompletedQuestionnaire: false 
     // });
      
      return { success: true };
    }

    set({ isLoading: false });
    return result;

  } catch (error) {
    console.error('Register error:', error);
    set({ isLoading: false });
    return { success: false, error: error.message };
  }
},

logout: async () => {
    set({ isLoading: true });

    try {
      await logoutUser();

      removeItem("authData");

      set({
        isAuthenticated: false,
        userId: null,
        user: null,
        isLoading: false,
        hasCompletedQuestionnaire: false,
        questionnaireResults: null,
        userHabits: [],
        habitCompletions: {},
        points: 0,
        level: 1,
        pointsHistory: [],
        todayMood: null,
        moodHistory: {},
        kindnessCompletions: {},
        reflections: [],
        worryEntries: [],
      });

      return { success: true };

    } catch (error) {
      console.error('Logout error:', error);
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // ==================== COMPLETE QUESTIONNAIRE ====================
    completeQuestionnaire: async (results) => {
    const currentState = get();
    
    set({
      hasCompletedQuestionnaire: true,
      questionnaireResults: results,
      user: { ...currentState.user, 
      focusArea: results.focusArea }
    });

    // Save to Firebase
    if (currentState.userId) {
      await updateUserData(currentState.userId,removeUndefined({
        hasCompletedQuestionnaire: true,
        questionnaireResults: results,
        focusArea: results.focusArea
      }));
    }

    // Update MMKV cache
    const currentAuthData = getItem("authData");
    if (currentAuthData) {
      setItem("authData", {
        ...currentAuthData,
        hasCompletedQuestionnaire: true,
        questionnaireResults: results,
        user: { 
          ...currentAuthData.user, 
          focusArea: results.focusArea }
      });
    }
  },
    finishShowingResults: () => {
    set({ questionnaireResults: null });
  },

    retakeQuestionnaire: async () => {
    const currentState = get();
    
    set({ 
      hasCompletedQuestionnaire: false, 
      questionnaireResults: null,
      user: { ...currentState.user, focusArea: null }
    });

    // Update Firebase
    if (currentState.userId) {
      await updateUserData(currentState.userId, {
        hasCompletedQuestionnaire: false,
        questionnaireResults: null,
        focusArea: null
      });
    }

    // Update MMKV cache
    const currentAuthData = getItem("authData");
    if (currentAuthData) {
      setItem("authData", {
        ...currentAuthData,
        hasCompletedQuestionnaire: false,
        questionnaireResults: null,
        user: { ...currentAuthData.user, focusArea: null }
      });
    }
  },

  // ==================== MOOD TRACKING ====================
    setTodayMood: async (moodData) => {
  const currentState = get();
  const today = new Date().toISOString().split('T')[0];
  
  const updatedMoodHistory = {
    ...currentState.moodHistory,
    [today]: moodData
  };

  set({ 
    todayMood: moodData,
    moodHistory: updatedMoodHistory 
  });

  // Update MMKV cache first (instant)
  const currentAuthData = getItem("authData");
  if (currentAuthData) {
    setItem("authData", {
      ...currentAuthData,
      todayMood: moodData,
      moodHistory: updatedMoodHistory
    });
  }

  // Save to Firebase (background)
  if (currentState.userId) {
    try {
      await saveMood(currentState.userId, moodData);
      await updateUserData(currentState.userId, { todayMood: moodData });
      
      return { success: true }; //  Return success
    } catch (error) {
      console.error('Error saving mood to Firebase:', error);
      return { success: false, error: error.message }; // Return error
    }
  }

  return { success: true }; // Return success even if no userId
},

    loadTodayMood: async () => {
    const currentState = get();
    const today = new Date().toISOString().split('T')[0];
    
    if (currentState.moodHistory[today]) {
      set({ todayMood: currentState.moodHistory[today] });
    } else {
      set({ todayMood: null });
    }
  },

    getMoodHistory: () => {
        return get().moodHistory;
    },

    clearMoodData: async () => {
    const currentState = get();
    
    set({ 
      todayMood: null,
      moodHistory: {} 
    });

    // Update Firebase
    if (currentState.userId) {
      await updateUserData(currentState.userId, {
        todayMood: null,
        moodHistory: {}
      });
    }

    // Update MMKV cache
    const currentAuthData = getItem("authData");
    if (currentAuthData) {
      setItem("authData", {
        ...currentAuthData,
        todayMood: null,
        moodHistory: {}
      });
    }
  },

// ==================== HABITS ====================
    addHabits: async (newHabits) => {
    try {
      const currentState = get();
      const habitsToAdd = Array.isArray(newHabits) ? newHabits : [newHabits];
      
      const normalizedHabits = habitsToAdd.map(habit => ({
        ...habit,
        text: habit.text || habit.title,
        title: habit.title,
      }));

      const existingIds = currentState.userHabits.map(h => h.id);
      const uniqueHabits = normalizedHabits.filter(habit => !existingIds.includes(habit.id));

      if (uniqueHabits.length === 0) {
        return { success: false, error: 'Habits already exist' };
      }

      const updatedHabits = [...currentState.userHabits, ...uniqueHabits];

      // Save to Firebase
      if (currentState.userId) {
        await saveHabits(currentState.userId, updatedHabits);
      }

      // Update local state
      set({ userHabits: updatedHabits });

      // Update MMKV cache
      const currentAuthData = getItem("authData");
      if (currentAuthData) {
        setItem("authData", {
          ...currentAuthData,
          userHabits: updatedHabits
        });
      }

      return { success: true };

    } catch (error) {
      console.error('Add habits error:', error);
      return { success: false, error: error.message };
    }
  },

  removeHabit: async (habitId) => {
    const currentState = get();
    const updatedHabits = currentState.userHabits.filter(h => h.id !== habitId);
    
    set({ userHabits: updatedHabits });

    // Save to Firebase
    if (currentState.userId) {
      await saveHabits(currentState.userId, updatedHabits);
    }

    // Update MMKV cache
    const currentAuthData = getItem("authData");
    if (currentAuthData) {
      setItem("authData", {
        ...currentAuthData,
        userHabits: updatedHabits
      });
    }
  },

  // ==================== POINTS ====================

   addPoints: async (amount, source) => {
    const currentState = get();
    const newPoints = (currentState.points || 0) + amount;
    const newLevel = Math.floor(newPoints / 100) + 1;

    const pointEntry = {
      amount,
      source,
      timestamp: new Date().toISOString(),
      totalPoints: newPoints,
    };

    const updatedHistory = [...(currentState.pointsHistory || []), pointEntry];

   // console.log(`${amount > 0 ? '+' : ''}${amount} points from ${source}! Total: ${newPoints} (Level ${newLevel})`);

    // Save to Firebase
    if (currentState.userId) {
      await updatePoints(currentState.userId, newPoints, newLevel, updatedHistory);
    }

    // Update local state
    set({
      points: newPoints,
      level: newLevel,
      pointsHistory: updatedHistory
    });

    // Update MMKV cache
    const currentAuthData = getItem("authData");
    if (currentAuthData) {
      setItem("authData", {
        ...currentAuthData,
        points: newPoints,
        level: newLevel,
        pointsHistory: updatedHistory
      });
    }
  },

   getPoints: () => {
     return get().points || 0;
   },

   getLevel: () => {
    return get().level || 1;
   },

   getPointsForNextLevel: () => {
    const currentLevel = get().level || 1;
    return currentLevel * 100;
  },

   getLevelName: (t) => {
    const level = get().level || 1;

    if (level < 5) return t('level.beginner');
    if (level < 10) return t('level.intermediate');
    if (level < 20) return t('level.advanced');
    return t('level.master');
  },

   // ==================== TOGGLE HABIT COMPLETION ====================

    toggleHabitCompletion: async (habitId,date = null) => {
     //const today = date || new Date().toISOString().split('T')[0]; //2025-11-04T00:00:00.000Z -> 2025-11-04
    
     const currentState = get();
     let completions = {...currentState.habitCompletions};
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
  
     const habit = currentState.userHabits.find(h => h.id === habitId);

     if (!habit) return { success: false, error: 'Habit not found' };

     const targetDate = date ? new Date(date) : new Date();
     const dateStr = targetDate.toISOString().split('T')[0];

     if (!shouldTrackHabitOnDate(habit.frequency, targetDate)) {
       Alert.alert(
       'Not Trackable',
       `This habit (${habit.frequency}) cannot be completed on this day.`
     );
     return;
     }

     const isCurrentlyCompleted = completions[habitId][dateStr] || false; 
     const pointsAwarded = hasPointsBeenAwarded(completions, habitId, dateStr);
     // completions["morning-run"]["2025-11-04"]  

     const previousStreak = habit.streak || 0;

     completions[habitId][dateStr] = !isCurrentlyCompleted;

    const today = new Date();
     
    const newStreak = calculateFrequencyAwareStreak(habit.frequency, completions[habitId], today);
     
    const streakBroken = !isCurrentlyCompleted && previousStreak > 0 && newStreak < previousStreak;

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

     //console.log('Updated habit with new streak:', updatedHabits.find(h => h.id === habitId));

      const pointsToAward = habit.points || 10;

      if (!isCurrentlyCompleted && !pointsAwarded) {
        get().addPoints(pointsToAward, `habit-${habitId}`);
        completions = markPointsAwarded(completions, habitId, dateStr);
     } 
     else if (isCurrentlyCompleted && pointsAwarded) {
       get().addPoints(-pointsToAward, `habit-${habitId}-undo`);
       completions = clearPointsAwarded(completions, habitId, dateStr);
     }

     if (currentState.userId) {
      //console.log('Saving to Firebase - habit streaks:', updatedHabits.map(h => ({ id: h.id, streak: h.streak })));
      await Promise.all([
        saveHabitCompletions(currentState.userId, completions),
        saveHabits(currentState.userId, updatedHabits)
      ]);
    }

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

     return { 
       success: true, 
       streakBroken,
       previousStreak,
       newStreak,
       habitName: habit.text || habit.title
     };

    },

    updateHabit: async (habitId, updatedHabit) => {
    const currentState = get();
    const updatedHabits = currentState.userHabits.map(h =>
      h.id === habitId ? { ...h, ...updatedHabit } : h
    );

    set({ userHabits: updatedHabits });

    // Save to Firebase
    if (currentState.userId) {
      await saveHabits(currentState.userId, updatedHabits);
    }

    // Update MMKV cache
    const currentAuthData = getItem("authData");
    if (currentAuthData) {
      setItem("authData", {
        ...currentAuthData,
        userHabits: updatedHabits
      });
    }
  },

   getHabitCompletion: (habitId, date = null) => {
    const currentState = get();
    const targetDate = date ? new Date(date) : new Date();
    const dateStr = targetDate.toISOString().split('T')[0];
    
    return currentState.habitCompletions[habitId]?.[dateStr] || false;
  },


    updateUser: async (userData) => {
        //Partially update user data(update data from quiz results)
        const currentState = get(); //το χρειαζόμαστε γιατι χωρίς αυτο το set updated User 
        // θα αντικαταστούσε το αντικείμενο(με μονο την ανάλυση των απαντήσεων) αντι να κάνει overwrite την αντίστοιχη ιδιότητα
       // const updatedUser= {...currentState.user, ...userData};
        
        // Update Zustand (in-memory)
        set({
          user: { ...currentState.user, ...userData }
        });

        if (currentState.userId) {
         await updateUserData(currentState.userId, removeUndefined(userData));
        }
        
        // Update MMKV (persistent storage)
        const currentAuthData = getItem("authData");
          if (currentAuthData) {
            setItem("authData", {
            ...currentAuthData,
            user: { ...currentAuthData.user, ...userData }
         });
       }
    },

checkAuth: async () => {
    const authData = getItem("authData");
    if (authData?.isAuthenticated && authData.userId) {
      set(authData);

      const { ensureAuth } = require('../app/services/firebaseService');
      
      const isFirebaseAuthed = await ensureAuth();

      if (isFirebaseAuthed) {
        // Sync from Firebase in background
        const { syncFromFirebase } = get();
        syncFromFirebase();
    } else {
      // Firebase auth failed - clear MMKV and logout
        console.log('Firebase auth expired - logging out');
        get().logout();
        return false;
    }
      
      return true;
    }
    return false;
  },
  syncFromFirebase: async () => {
    const currentState = get();
    if (!currentState.userId) return;

    try {
      const [userDataResult, moodResult, reflectionsResult, worriesResult] = await Promise.all([
        getUserData(currentState.userId),
        getMoodHistory(currentState.userId),
        getReflectionsFromFirebase(currentState.userId),
        getWorriesFromFirebase(currentState.userId)
      ]);

      if (userDataResult.success) {
        const userData = userDataResult.data;
        
        const syncedData = {
          userHabits: userData.userHabits || currentState.userHabits,
          habitCompletions: userData.habitCompletions || currentState.habitCompletions,
          points: userData.points || currentState.points,
          level: userData.level || currentState.level,
          pointsHistory: userData.pointsHistory || currentState.pointsHistory,
          kindnessCompletions: userData.kindnessCompletions || currentState.kindnessCompletions,
          moodHistory: moodResult.success ? moodResult.data : currentState.moodHistory,
          reflections: reflectionsResult.success ? reflectionsResult.data : currentState.reflections,
          worryEntries: worriesResult.success ? worriesResult.data : currentState.worryEntries,
        };

        set(syncedData);
        
        const currentAuthData = getItem("authData");
        if (currentAuthData) {
          setItem("authData", { ...currentAuthData, ...syncedData });
        }
      }
    } catch (error) {
      console.error('Sync error:', error);
    }
  },

  refreshHabitTranslations: (t, getExtraGoals, getFoundationalHabits) => {
    const { getAvailableHabits } = require('../constants/availableHabits');
    const currentState = get();
    
    const allAvailableHabits = getAvailableHabits(t);
    const allHabitsMap = {};
    
    Object.values(allAvailableHabits).flat().forEach(habit => {
      allHabitsMap[habit.id] = habit;
    });

    if (getFoundationalHabits) {
      getFoundationalHabits(t).forEach(habit => {
        allHabitsMap[habit.id] = habit;
      });
    }
    
    if (getExtraGoals) {
      getExtraGoals(t).forEach(goal => {
        allHabitsMap[goal.id] = goal;
      });
    }
    
    const updatedHabits = currentState.userHabits.map(userHabit => {
      if (userHabit.isCustom) {
        return userHabit;
      }

      const freshHabit = allHabitsMap[userHabit.id];
      
      if (freshHabit) {
        return {
          ...userHabit,
          title: freshHabit.title,
          text: freshHabit.text || freshHabit.title,
          category: freshHabit.category,
          duration: freshHabit.duration,
          description: freshHabit.description,
          difficulty: freshHabit.difficulty,
        };
      }
      
      return {
        ...userHabit,
        text: userHabit.text || userHabit.title,
      };
    });
    
    set({ userHabits: updatedHabits });
    
    const currentAuthData = getItem("authData");
    if (currentAuthData) {
      setItem("authData", { ...currentAuthData, userHabits: updatedHabits });
    }
  },

// ==================== KINDNESS ACTS ====================

    toggleKindnessAct: async (actId,date=null) => {
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

      if (currentState.userId) {
        await updateUserData(currentState.userId, {
          kindnessCompletions: completions
       });
    }

      const currentAuthData = getItem("authData");
      if (currentAuthData) {
        setItem("authData", { 
        ...currentAuthData, 
        kindnessCompletions: completions 
      });
    }
     
    // console.log('Kindness act completed!');
    },
  
    getTodayKindnessCount: () => {
     const today = new Date().toDateString(); // Changed from .toISOString().split('T')[0]
     const currentState = get();
     return currentState.kindnessCompletions[today]?.length || 0;
    },

  getKindnessCompletions: (date = null) => {
  const targetDate = date ? 
    new Date(date).toDateString() :  // Match the format used in toggleKindnessAct
    new Date().toDateString();
  const currentState = get();
  return currentState.kindnessCompletions[targetDate] || [];
},

  getTotalKindnessActs: () => {
    const currentState = get();
    return Object.values(currentState.kindnessCompletions)
      .reduce((total, acts) => total + acts.length, 0);
  },

  // ==================== REFLECTIONS ====================

  saveReflection: async (text) => {
    const currentState = get();
    
    const newReflection = {
      id: Date.now().toString(),
      text: text,
      date: new Date().toDateString(),
      timestamp: new Date().toISOString(),
    };

    const updatedReflections = [newReflection, ...currentState.reflections];

    // Save to Firebase
    if (currentState.userId) {
      const result = await saveReflectionToFirebase(currentState.userId, text);
      if (!result.success) {
        console.error('Failed to save reflection to Firebase');
        return false;
      }
    }

    // Update local state
    set({ reflections: updatedReflections });

    // Update MMKV cache
    const currentAuthData = getItem("authData");
    if (currentAuthData) {
      setItem("authData", {
        ...currentAuthData,
        reflections: updatedReflections
      });
    }

    return true;
  },

  getReflections: () => {
    return get().reflections || [];
  },

  // ==================== WORRY ENTRIES ====================
  
  getWorryEntries: () => {
    return get().worryEntries || [];
  },

  addWorryEntry: async (entry) => {
    const currentState = get();
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    const updatedEntries = [newEntry, ...currentState.worryEntries];

    // Save to Firebase
    if (currentState.userId) {
      await saveWorryToFirebase(currentState.userId, newEntry);
    }

    // Update local state
    set({ worryEntries: updatedEntries });

    // Update MMKV cache
    const currentAuthData = getItem("authData");
    if (currentAuthData) {
      setItem("authData", {
        ...currentAuthData,
        worryEntries: updatedEntries
      });
    }
  },

  loadWorryEntries: async () => {
    const currentState = get();
    
    if (currentState.userId) {
      const result = await getWorriesFromFirebase(currentState.userId);
      if (result.success) {
        set({ worryEntries: result.data });
        
        const currentAuthData = getItem("authData");
        if (currentAuthData) {
          setItem("authData", {
            ...currentAuthData,
            worryEntries: result.data
          });
        }
      }
    }
  },

  deleteWorryEntry: async (entryId) => {
    const currentState = get();
    const updatedEntries = currentState.worryEntries.filter(e => e.id !== entryId);

    // Delete from Firebase
    if (currentState.userId) {
      await deleteWorryFromFirebase(currentState.userId, entryId);
    }

    // Update local state
    set({ worryEntries: updatedEntries });

    // Update MMKV cache
    const currentAuthData = getItem("authData");
    if (currentAuthData) {
      setItem("authData", {
        ...currentAuthData,
        worryEntries: updatedEntries
      });
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

    isTokenValid: () => true,
    canAccessDashboard: () => {
      const currentState = get();
      return currentState.isAuthenticated && currentState.hasCompletedQuestionnaire;
  },

    // Development helper
   resetAuth: () => {
    removeItem("authData");
    set({
      isAuthenticated: false,
      userId: null,
      user: null,
      isLoading: false,
      hasCompletedQuestionnaire: false,
      questionnaireResults: null,
      userHabits: [],
      habitCompletions: {},
      points: 0,
      level: 1,
      pointsHistory: [],
      todayMood: null,
      moodHistory: {},
      kindnessCompletions: {},
      reflections: [],
      worryEntries: [],
    });
  },
}));

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

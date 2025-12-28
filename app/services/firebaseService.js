import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection,
  query,
  getDocs,
  addDoc,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

const removeUndefined = (obj) => {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  );
};

// ==================== AUTH FUNCTIONS ====================

export const registerUser = async (name, email, password) => {
  try {
    console.log('Attempting to register:', email);
    
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('User created:', user.uid);

    // Update display name
    await updateProfile(user, { displayName: name });

    console.log('Creating user document in Firestore...');

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      username: name.toLowerCase().replace(/\s+/g, ''),
      email: email,
      displayName: name,
      createdAt: serverTimestamp(),
      hasCompletedQuestionnaire: false,
      points: 0,
      level: 1,
      userHabits: [],
      habitCompletions: {},
      kindnessCompletions: {},
      pointsHistory: [],
      todayMood: null,
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('Registration successful!');
    return { success: true, user };

      } catch (error) {
    //console.error('Registration error details:', error);
    
    // Map Firebase errors to translation keys
    const errorMap = {
      'auth/network-request-failed': 'errors.networkError',
      'auth/email-already-in-use': 'errors.emailInUse',
      'auth/invalid-email': 'errors.invalidEmail',
      'auth/weak-password': 'errors.weakPassword',
    };
    
    const errorKey = errorMap[error.code] || 'errors.unknownError';
    
    return { success: false, error: error.code, errorKey };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
   } catch (error) {
    //console.error('Login error:', error);
    
    const errorMap = {
      'auth/network-request-failed': 'errors.networkError',
      'auth/wrong-password': 'errors.wrongPassword',
      'auth/user-not-found': 'errors.userNotFound',
      'auth/invalid-email': 'errors.invalidEmail',
      'auth/too-many-requests': 'errors.tooManyRequests',
    };
    
    const errorKey = errorMap[error.code] || 'errors.unknownError';
    
    return { success: false, error: error.code, errorKey };
  }
};

export const signInWithGoogle = async (idToken) => {
  try {
    console.log('Attempting Google sign-in with token...');
    
    // Create credential with Google ID token
    const credential = GoogleAuthProvider.credential(idToken);
    
    // Sign in with credential
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;
    
    console.log('Google sign-in successful:', user.uid);
    
    // Check if user document exists
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    // If new user, create their document
    if (!userDoc.exists()) {
      console.log('Creating new user document for Google user...');
      
      await setDoc(userDocRef, {
        username: user.email?.split('@')[0] || 'user',
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0],
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
        hasCompletedQuestionnaire: false,
        points: 0,
        level: 1,
        userHabits: [],
        habitCompletions: {},
        kindnessCompletions: {},
        pointsHistory: [],
        todayMood: null,
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Google user document created');
    }
    
    return { success: true, user, isNewUser: !userDoc.exists() };
    
  } catch (error) {
    console.error('Google sign-in error:', error);
    
    const errorMap = {
      'auth/account-exists-with-different-credential': 'errors.accountExistsWithDifferentCredential',
      'auth/invalid-credential': 'errors.invalidCredential',
      'auth/operation-not-allowed': 'errors.operationNotAllowed',
      'auth/user-disabled': 'errors.userDisabled',
      'auth/user-not-found': 'errors.userNotFound',
      'auth/network-request-failed': 'errors.networkError',
    };
    
    const errorKey = errorMap[error.code] || 'errors.unknownError';
    
    return { success: false, error: error.message, errorKey };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// ==================== USER DATA FUNCTIONS ====================

export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    console.error('Get user data error:', error);
    return { success: false, error: error.message };
  }
};

export const updateUserData = async (userId, data) => {
  try {
    // Using setDoc with merge instead of updateDoc,
    // creates the document if it doesn't exist, or updates if it does
    await setDoc(doc(db, 'users', userId), removeUndefined(data), { merge: true });
    
    console.log('User data updated successfully');
    return { success: true };
  } catch (error) {
    console.error('Update user data error:', error);
    return { success: false, error: error.message };
  }
};

// ==================== HABITS FUNCTIONS ====================

export const saveHabits = async (userId, habits) => {
  try {
    const isAuthed = await ensureAuth();
    if (!isAuthed) {
      console.error('User not authenticated');
      return { success: false, error: 'Not authenticated' };
    }
    
    // Clean undefined values from each habit
    const cleanedHabits = habits.map(habit => {
      const cleaned = {};
      Object.entries(habit).forEach(([key, value]) => {
        if (value !== undefined) {
          cleaned[key] = value;
        }
      });
      return cleaned;
    });
    
    await updateDoc(doc(db, 'users', userId), {
      userHabits: cleanedHabits,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Save habits error:', error);
    return { success: false, error: error.message };
  }
};

export const saveHabitCompletions = async (userId, completions) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      habitCompletions: completions,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Save completions error:', error);
    return { success: false, error: error.message };
  }
};

// ==================== MOOD FUNCTIONS ====================

export const saveMood = async (userId, moodData) => {
  try {
    await addDoc(collection(db, 'users', userId, 'moods'), {
      ...moodData,
      timestamp: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Save mood error:', error);
    return { success: false, error: error.message };
  }
};

export const getMoodHistory = async (userId) => {
  try {
    const moodsRef = collection(db, 'users', userId, 'moods');
    const querySnapshot = await getDocs(query(moodsRef));
    
    const moods = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const date = data.timestamp?.toDate().toISOString().split('T')[0];
      if (date) {
        moods[date] = data;
      }
    });
    
    return { success: true, data: moods };
  } catch (error) {
    console.error('Get mood history error:', error);
    return { success: false, error: error.message };
  }
};

// ==================== REFLECTIONS FUNCTIONS ====================

export const saveReflection = async (userId, reflectionText) => {
  try {
    const docRef = await addDoc(collection(db, 'users', userId, 'reflections'), {
      text: reflectionText,
      date: new Date().toDateString(),
      timestamp: serverTimestamp()
    });
    return { success: true, id: docRef.id }; // Return the Firebase-generated ID
  } catch (error) {
    console.error('Save reflection error:', error);
    return { success: false, error: error.message };
  }
};

export const getReflections = async (userId) => {
  try {
    const reflectionsRef = collection(db, 'users', userId, 'reflections');
    const querySnapshot = await getDocs(query(reflectionsRef));
    
    const reflections = [];
    querySnapshot.forEach((doc) => {
      reflections.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: reflections };
  } catch (error) {
    console.error('Get reflections error:', error);
    return { success: false, error: error.message };
  }
};

export const deleteReflection = async (userId, reflectionId) => {
  try {
    await deleteDoc(doc(db, 'users', userId, 'reflections', reflectionId));
    return { success: true };
  } catch (error) {
    console.error('Delete reflection error:', error);
    return { success: false, error: error.message };
  }
};

// ==================== WORRY ENTRIES FUNCTIONS ====================

export const saveWorryEntry = async (userId, entry) => {
  try {
    const docRef = await addDoc(collection(db, 'users', userId, 'worries'), {
      text: entry.text,
      timestamp: serverTimestamp()
    });
    return { success: true, id: docRef.id }; // Return the Firebase-generated ID
  } catch (error) {
    console.error('Save worry error:', error);
    return { success: false, error: error.message };
  }
};

export const getWorryEntries = async (userId) => {
  try {
    const worriesRef = collection(db, 'users', userId, 'worries');
    const querySnapshot = await getDocs(query(worriesRef));
    
    const worries = [];
    querySnapshot.forEach((doc) => {
      worries.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: worries };
  } catch (error) {
    console.error('Get worries error:', error);
    return { success: false, error: error.message };
  }
};

export const deleteWorryEntry = async (userId, entryId) => {
  try {
    await deleteDoc(doc(db, 'users', userId, 'worries', entryId));
    return { success: true };
  } catch (error) {
    console.error('Delete worry error:', error);
    return { success: false, error: error.message };
  }
};

// ==================== POINTS FUNCTIONS ====================

export const updatePoints = async (userId, points, level, pointsHistory) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      points,
      level,
      pointsHistory,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Update points error:', error);
    return { success: false, error: error.message };
  }
};

export const ensureAuth = async () => {
  if (auth.currentUser) return true;
  
  // Wait up to 2 seconds for auth to initialize
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(!!user);
    });
    
    setTimeout(() => {
      unsubscribe();
      resolve(false);
    }, 2000);
  });
};

export default function firebaseService() {
  return (
    <>
     
    </>
  );
}

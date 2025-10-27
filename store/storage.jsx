import { createMMKV } from 'react-native-mmkv'// eslint-disable-line

export const storage = createMMKV({
    id: 'auth-storage'
});

export const setItem = (key, value) => {
    storage.set(key, JSON.stringify(value));
};

export const getItem = (key) => {
    const value = storage.getString(key);
    return value ? JSON.parse(value) : null;
};

export const removeItem = (key) => {
    storage.remove(key);
};
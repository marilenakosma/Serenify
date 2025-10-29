// components/ThemedSetting.jsx - Add press handling and logout styling
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';
import { Colors } from '../constants/Colors';

const ThemedSetting = ({ name, text, onPress, isLogout = false }) => {
    return (
        <TouchableOpacity 
            style={[styles.container, isLogout && styles.logoutContainer]}
            onPress={onPress}
        >
            <ThemedView style={styles.content}>
                <Ionicons 
                    name={name} 
                    size={24} 
                    color={isLogout ? "#e74c3c" : "#666"} 
                />
                <ThemedText style={[styles.text, isLogout && styles.logoutText]}>
                    {text}
                </ThemedText>
                <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color="#999" 
                />
            </ThemedView>
        </TouchableOpacity>
    );
};

export default ThemedSetting;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
    },
    logoutContainer: {
        borderLeftColor: '#e74c3c',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    text: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
    },
    logoutText: {
        color: '#e74c3c',
        fontWeight: '500',
    },
});
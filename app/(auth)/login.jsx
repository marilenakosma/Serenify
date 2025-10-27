import { Link, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import validator from 'validator';
import BackButton from "../../components/BackButton";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedInput from "../../components/ThemedInput";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    
    const router = useRouter();
   
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };
    // Validation functions
    const validateEmail = useCallback(
        debounce((input) => {
            if (touched.email) {
                if (!input) {
                    setErrors(prev => ({ ...prev, email: 'Email is required' }));
                } else if (!validator.isEmail(input)) {
                    setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
                } else {
                    setErrors(prev => ({ ...prev, email: '' }));
                }
            }
        }, 300),
        [touched.email]
    );

    const validatePassword = useCallback(
        debounce((input) => {
            if (touched.password) {
                if (!input) {
                    setErrors(prev => ({ ...prev, password: 'Password is required' }));
                } else if (input.length < 6) {
                    setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
                } else {
                    setErrors(prev => ({ ...prev, password: '' }));
                }
            }
        }, 300),
        [touched.password]
    );

    // Handle input changes
    const handleEmailChange = (input) => {
        setEmail(input);
        validateEmail(input);
    };

    const handlePasswordChange = (input) => {
        setPassword(input);
        validatePassword(input);
    };

    // Focus handlers
    const handleEmailFocus = () => {
        setTouched(prev => ({ ...prev, email: true }));
    };

    const handlePasswordFocus = () => {
        setTouched(prev => ({ ...prev, password: true }));
    };

    // Form validation
    const validateForm = () => {
        const emailError = !email ? 'Email is required' : !validator.isEmail(email) ? 'Invalid email' : '';
        const passwordError = !password ? 'Password is required' : password.length < 6 ? 'Password too short' : '';

        setErrors({
            email: emailError,
            password: passwordError
        });

        setTouched({ email: true, password: true });

        return !emailError && !passwordError;
    };

    const handleLogin = async () => {
        if (!validateForm()) {
            Alert.alert('Validation Error', 'Please fix the errors before submitting');
            return;
        }

        setIsLoading(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Reduced from 2000
            router.replace("/(dashboard)");
        } catch (error) {
            Alert.alert('Error', 'Invalid email or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView style={{flex:1}}>
                <SafeAreaView style={{backgroundColor: Colors.background}}>
                    <BackButton/>
                    <ThemedView style={{flexDirection:'row', justifyContent:'center', paddingVertical: 15}}>
                        <Image source={require('../../assets/images/leaf-green.png')}
                            style={{width: 200, height: 200}}   
                            resizeMode="contain" />
                    </ThemedView>
                </SafeAreaView>

                <ScrollView 
                    style={{flex: 1}}
                    contentContainerStyle={{flexGrow: 1}}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <ThemedView style={styles.container}>
                        <ThemedText title={true} style={styles.title}>
                            Welcome Back
                        </ThemedText>
                        
                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <ThemedInput 
                                style={[
                                    styles.input,
                                    touched.email && (errors.email ? styles.inputError : styles.inputFocused)
                                ]}
                                placeholder="Email Address"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={handleEmailChange}
                                onFocus={handleEmailFocus}
                                value={email}
                            />
                            {touched.email && (
                                <View style={styles.validationContainer}>
                                    {errors.email ? (
                                        <>
                                            <Text style={styles.invalidMark}>⚠</Text>
                                            <Text style={styles.errorMessage}>{errors.email}</Text>
                                        </>
                                    ) : email && validator.isEmail(email) ? (
                                        <Text style={styles.validMark}>✓ Valid email address</Text>
                                    ) : null}
                                </View>
                            )}
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <ThemedInput 
                                style={[
                                    styles.input,
                                    touched.password && (errors.password ? styles.inputError : styles.inputFocused)
                                ]}
                                placeholder="Password"
                                onChangeText={handlePasswordChange}
                                onFocus={handlePasswordFocus}
                                value={password}
                                secureTextEntry 
                            />
                            {touched.password && errors.password && (
                                <View style={styles.validationContainer}>
                                    <Text style={styles.invalidMark}>⚠</Text>
                                    <Text style={styles.errorMessage}>{errors.password}</Text>
                                </View>
                            )}
                        </View>

                        {/* Forgot Password */}
                        <TouchableOpacity style={styles.forgotPasswordContainer}>
                            <ThemedText style={styles.forgotPasswordText}>
                                Forgot Password?
                            </ThemedText>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <ThemedButton 
                            onPress={handleLogin}
                            style={[
                                styles.loginButton,
                                isLoading && styles.buttonDisabled
                            ]}
                            disabled={isLoading}
                        >
                            <ThemedText title={true} style={styles.buttonText}>
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </ThemedText>
                        </ThemedButton>
                        
                        <Spacer height={20}/>

                        {/* Or Divider */}
                        <View style={styles.orContainer}>
                            <View style={styles.orLine} />
                            <ThemedText style={styles.orText}>Or continue with</ThemedText>
                            <View style={styles.orLine} />
                        </View>
                        
                        {/* Social Login */}
                        <View style={{flexDirection:'row'}}>
                                                <TouchableOpacity style={styles.socialButton}>
                                                    <Image source={require('../../assets/images/google.png')}
                                                        style={{width:24, height:24}} />  
                                                </TouchableOpacity>
                        
                                                <TouchableOpacity style={styles.socialButton}>
                                                    <Image source={require('../../assets/images/apple.png')}
                                                        style={{width:24, height:24}} />  
                                                </TouchableOpacity>
                        
                                                <TouchableOpacity style={styles.socialButton}>
                                                    <Image source={require('../../assets/images/facebook.png')}
                                                        style={{width:24, height:24}} />  
                                                </TouchableOpacity>
                                            </View>

                        <Spacer height={30}/>

                        {/* Register Link */}
                        <View style={styles.registerContainer}>
                            <ThemedText style={styles.registerText}>
                                Don't have an account?
                            </ThemedText>
                            <Link href="/register" replace>
                                <ThemedText style={styles.registerLink}>
                                    Sign Up
                                </ThemedText>
                            </Link>
                        </View>        
                    </ThemedView>
                </ScrollView>
            </ThemedView>
        </TouchableWithoutFeedback>    
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "white",
        paddingHorizontal: 32,
        paddingTop: 20,
        paddingBottom: 20,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    title: {
        textAlign: "center",
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
        color: Colors.title,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#e1e1e1',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#fafafa',
        textAlignVertical: 'center',
        includeFontPadding: false,
    },
    inputFocused: {
        borderColor: Colors.primary,
        backgroundColor: 'white',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    inputError: {
        borderColor: '#ff6b6b',
        backgroundColor: '#fff5f5',
    },
    validationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        paddingHorizontal: 4,
    },
    errorMessage: {
        color: '#ff6b6b',
        fontSize: 13,
        marginLeft: 6,
        flex: 1,
    },
    validMark: {
        color: '#4CAF50',
        fontSize: 13,
        fontWeight: '500',
    },
    invalidMark: {
        color: '#ff6b6b',
        fontSize: 14,
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginBottom: 20,
        marginTop: 5,
    },
    forgotPasswordText: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '500',
    },
    loginButton: {
        width: '100%',
        opacity: 1,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#f2f2f2',
        fontSize: 16,
        fontWeight: '600',
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
        width: '100%',
    },
    orLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e1e1e1',
    },
    orText: {
        marginHorizontal: 16,
        fontSize: 14,
        color: '#666',
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15,
    },
    socialButton: {
        backgroundColor: Colors.uiBackground,
        width: 60,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 12,
        borderWidth: 1,
        borderColor: '#e1e1e1',
    },
    registerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    registerText: {
        fontSize: 14,
        color: '#666',
    },
    registerLink: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
        marginLeft: 4,
    },
});
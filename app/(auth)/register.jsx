import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import validator from 'validator';
import BackButton from "../../components/BackButton";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedInput from "../../components/ThemedInput";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    
    const router = useRouter();

    // Custom Password Strength Component - MOVED TO CORRECT LOCATION
    const PasswordStrengthMeter = ({ strength, password }) => {
        const getStrengthText = () => {
            if (strength < 0.3) return 'Very Weak';
            if (strength < 0.6) return 'Weak';
            if (strength < 0.9) return 'Good';
            return 'Strong';
        };

        const getStrengthColor = () => {
            if (strength < 0.3) return '#ff6b6b';
            if (strength < 0.6) return '#ffa726';
            if (strength < 0.9) return '#42a5f5';
            return '#66bb6a';
        };

        if (!password) return null;

        return (
            <View style={styles.strengthMeter}>
                <View style={styles.strengthBarContainer}>
                    <View 
                        style={[
                            styles.strengthBar, 
                            { 
                                width: `${strength * 100}%`, 
                                backgroundColor: getStrengthColor() 
                            }
                        ]} 
                    />
                </View>
                <Text style={[styles.strengthText, { color: getStrengthColor() }]}>
                    {getStrengthText()}
                </Text>
            </View>
        );
    };

    // Validation functions
    const validateName = (input) => {
        setName(input);
        if (touched.name) {
            if (!input.trim()) {
                setErrors(prev => ({ ...prev, name: 'Name is required' }));
            } else if (input.trim().length < 2) {
                setErrors(prev => ({ ...prev, name: 'Name must be at least 2 characters' }));
            } else {
                setErrors(prev => ({ ...prev, name: '' }));
            }
        }
    };

    const validateEmail = (input) => {
        setEmail(input);
        if (touched.email) {
            if (!input) {
                setErrors(prev => ({ ...prev, email: 'Email is required' }));
            } else if (!validator.isEmail(input)) {
                setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
            } else {
                setErrors(prev => ({ ...prev, email: '' }));
            }
        }
    };

    const validatePassword = (input) => {
        setPassword(input);
        if (touched.password) {
            const validationErrors = [];
            
            if (input.length < 8) validationErrors.push('At least 8 characters');
            if (!/[A-Z]/.test(input)) validationErrors.push('One uppercase letter');
            if (!/[a-z]/.test(input)) validationErrors.push('One lowercase letter');
            if (!/\d/.test(input)) validationErrors.push('One number');
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(input)) validationErrors.push('One special character');
            
            if (validationErrors.length > 0) {
                setErrors(prev => ({ ...prev, password: `Missing: ${validationErrors.join(', ')}` }));
                setPasswordStrength(Math.max(0, (5 - validationErrors.length) / 5));
            } else {
                setErrors(prev => ({ ...prev, password: '' }));
                setPasswordStrength(1);
            }
        }
        
        // Also re-validate confirm password if it exists
        if (confirmPassword && touched.confirmPassword) {
            validateConfirmPassword(confirmPassword);
        }
    };

    const validateConfirmPassword = (input) => {
        setConfirmPassword(input);
        if (touched.confirmPassword) {
            if (!input) {
                setErrors(prev => ({ ...prev, confirmPassword: 'Please confirm your password' }));
            } else if (input !== password) {
                setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
            } else {
                setErrors(prev => ({ ...prev, confirmPassword: '' }));
            }
        }
    };

    // Focus handlers
    const handleNameFocus = () => {
        setTouched(prev => ({ ...prev, name: true }));
        validateName(name);
    };

    const handleEmailFocus = () => {
        setTouched(prev => ({ ...prev, email: true }));
        validateEmail(email);
    };

    const handlePasswordFocus = () => {
        setTouched(prev => ({ ...prev, password: true }));
    };

    const handleConfirmPasswordFocus = () => {
        setTouched(prev => ({ ...prev, confirmPassword: true }));
    };

    // Form validation
    const validateForm = () => {
        const nameError = !name.trim() ? 'Name is required' : name.trim().length < 2 ? 'Name too short' : '';
        const emailError = !email ? 'Email is required' : !validator.isEmail(email) ? 'Invalid email' : '';
        const passwordError = passwordStrength < 1 ? 'Password requirements not met' : '';
        const confirmPasswordError = confirmPassword !== password ? 'Passwords do not match' : '';

        setErrors({
            name: nameError,
            email: emailError,
            password: passwordError,
            confirmPassword: confirmPasswordError
        });

        setTouched({ name: true, email: true, password: true, confirmPassword: true });

        return !nameError && !emailError && !passwordError && !confirmPasswordError;
    };

    const handleSubmit = async () => {
        console.log('Register form submitted', { name, email, password });
        
        if (!validateForm()) {
            Alert.alert('Validation Error', 'Please fix the errors before submitting');
            return;
        }

        setIsLoading(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            Alert.alert('Success', 'Account created successfully!', [
                { text: 'OK', onPress: () => router.replace("/(questionnaire)") }
            ]);
            
        } catch (error) {
            Alert.alert('Error', 'Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView style={{flex:1}}>
                <SafeAreaView style={{backgroundColor: Colors.background}}>
                    <BackButton/>
                    <ThemedView style={{flexDirection:'row', justifyContent:'center', paddingVertical: 20}}>
                        <Image source={require('../../assets/images/tropical.png')}
                            style={{width:150, height:150}} />   
                    </ThemedView>
                </SafeAreaView>

                <ThemedView style={styles.container}>
                    <ThemedText title={true} style={styles.title}>
                        Create Your Account
                    </ThemedText>
                    
                    {/* Name Input */}
                    <View style={styles.inputContainer}>
                        <ThemedInput 
                            style={[
                                styles.input,
                                touched.name && (errors.name ? styles.inputError : styles.inputFocused)
                            ]}
                            placeholder="Full Name"
                            keyboardType="default"
                            autoCapitalize="words"
                            onChangeText={validateName}
                            onFocus={handleNameFocus}
                            value={name}
                        />
                        {touched.name && errors.name && (
                            <View style={styles.validationContainer}>
                                <Text style={styles.invalidMark}>⚠</Text>
                                <Text style={styles.errorMessage}>{errors.name}</Text>
                            </View>
                        )}
                    </View>

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
                            onChangeText={validateEmail}
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

                    {/* Password Input - FIXED LOCATION */}
                    <View style={styles.inputContainer}>
                        <ThemedInput 
                            style={[
                                styles.input,
                                touched.password && (errors.password ? styles.inputError : styles.inputFocused)
                            ]}
                            placeholder="Password"
                            onChangeText={validatePassword}
                            onFocus={handlePasswordFocus}
                            value={password}
                            secureTextEntry 
                        />
                        
                        {/* Password Strength Meter - CORRECT LOCATION */}
                        <PasswordStrengthMeter strength={passwordStrength} password={password} />
                        
                        {touched.password && errors.password && (
                            <View style={styles.validationContainer}>
                                <Text style={styles.invalidMark}>⚠</Text>
                                <Text style={styles.errorMessage}>{errors.password}</Text>
                            </View>
                        )}
                    </View>

                    {/* Confirm Password Input - CLEANED UP */}
                    <View style={styles.inputContainer}>
                        <ThemedInput 
                            style={[
                                styles.input,
                                touched.confirmPassword && (errors.confirmPassword ? styles.inputError : styles.inputFocused)
                            ]}
                            placeholder="Confirm Password"
                            onChangeText={validateConfirmPassword}
                            onFocus={handleConfirmPasswordFocus}
                            value={confirmPassword}
                            secureTextEntry 
                        />
                        
                        {touched.confirmPassword && (
                            <View style={styles.validationContainer}>
                                {errors.confirmPassword ? (
                                    <>
                                        <Text style={styles.invalidMark}>⚠</Text>
                                        <Text style={styles.errorMessage}>{errors.confirmPassword}</Text>
                                    </>
                                ) : confirmPassword && confirmPassword === password ? (
                                    <Text style={styles.validMark}>✓ Passwords match</Text>
                                ) : null}
                            </View>
                        )}
                    </View>

                    <Spacer height={15}/>

                    {/* Submit Button */}
                    <ThemedButton 
                        onPress={handleSubmit}
                        style={[
                            styles.submitButton,
                            isLoading && styles.buttonDisabled
                        ]}
                        disabled={isLoading}
                    >
                        <ThemedText title={true} style={{color:'#f2f2f2'}}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </ThemedText>
                    </ThemedButton>
                    
                    <Spacer height={15}/>

                    {/* Or Divider */}
                    <View style={styles.orContainer}>
                        <View style={styles.orLine} />
                        <ThemedText style={styles.orText}>Or continue with</ThemedText>
                        <View style={styles.orLine} />
                    </View>
                    
                    {/* Social Login */}
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity style={styles.image}>
                            <Image source={require('../../assets/images/google.png')}
                                style={{width:24, height:24}} />  
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.image}>
                            <Image source={require('../../assets/images/apple.png')}
                                style={{width:24, height:24}} />  
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.image}>
                            <Image source={require('../../assets/images/facebook.png')}
                                style={{width:24, height:24}} />  
                        </TouchableOpacity>
                    </View>

                    <Spacer height={30}/>

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <ThemedText style={styles.loginText}>
                            Already have an account?
                        </ThemedText>
                        <Link href="/login" replace>
                            <ThemedText style={styles.loginLink}>
                                Sign In
                            </ThemedText>
                        </Link>
                    </View>        
                </ThemedView>
            </ThemedView>
        </TouchableWithoutFeedback>    
    );
};

export default Register;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "white",
        paddingHorizontal: 32,
        paddingTop: 20, // Reduced from 40
        paddingBottom: 20, // Add bottom padding
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
        fontSize: 22, // Reduced from 24
        fontWeight: '600',
        marginBottom: 20, // Reduced from 30
        color: Colors.title,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 15, // Reduced from 20
    },
    input: {
        width: '100%',
        height: 50, // Reduced from 55
        borderWidth: 1,
        borderColor: '#e1e1e1',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12, // Add vertical padding for placeholder
        fontSize: 16,
        backgroundColor: '#fafafa',
        // Fix text alignment
        textAlignVertical: 'center', // Android
        includeFontPadding: false, // Android
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
    submitButton: {
        width: '100%',
        opacity: 1,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
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
    image: {
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
    loginContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loginText: {
        fontSize: 14,
        color: '#666',
    },
    loginLink: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
        marginLeft: 4,
    },
    strengthMeter: {
        marginTop: 8,
        marginBottom: 8,
    },
    strengthBarContainer: {
        height: 4,
        backgroundColor: '#e0e0e0',
        borderRadius: 2,
        marginBottom: 4,
    },
    strengthBar: {
        height: '100%',
        borderRadius: 2,
    },
    strengthText: {
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'right',
    },
});
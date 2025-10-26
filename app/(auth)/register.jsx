import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import PasswordValidator from 'react-native-password-validator';
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
    const [passwordsEqual, setPasswordsEqual] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const router = useRouter();

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

    // Password validator callbacks
    const handleStrengthChange = (strength) => {
        setPasswordStrength(strength);
        console.log('Password strength:', strength);
        
        // Update password error based on strength
        if (touched.password) {
            if (strength < 0.6) { // Less than 60% strength
                setErrors(prev => ({ ...prev, password: 'Password is too weak' }));
            } else {
                setErrors(prev => ({ ...prev, password: '' }));
            }
        }
    };

    const handlePasswordChange = (newPassword) => {
        setPassword(newPassword);
        console.log("Current password:", newPassword);
        
        // Mark as touched when user starts typing
        if (!touched.password && newPassword.length > 0) {
            setTouched(prev => ({ ...prev, password: true }));
        }
    };

    const handleEqualPasswords = (isEqual) => {
        setPasswordsEqual(isEqual);
        console.log('Passwords equal:', isEqual);
        
        if (touched.confirmPassword) {
            if (!isEqual && confirmPassword.length > 0) {
                setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
            } else {
                setErrors(prev => ({ ...prev, confirmPassword: '' }));
            }
        }
    };

    // Focus handlers
    const handleNameFocus = () => {
        setTouched(prev => ({ ...prev, name: true }));
        validateName(name); // Validate on focus
    };

    const handleEmailFocus = () => {
        setTouched(prev => ({ ...prev, email: true }));
        validateEmail(email); // Validate on focus
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
        const passwordError = passwordStrength < 0.6 ? 'Password is too weak' : '';
        const confirmPasswordError = !passwordsEqual ? 'Passwords do not match' : '';

        setErrors({
            name: nameError,
            email: emailError,
            password: passwordError,
            confirmPassword: confirmPasswordError
        });

        // Mark all as touched to show errors
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
            // Simulate API call
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
                            style={{width:180, height:180}} />   
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

                    {/* Password Input with Validator */}
                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.passwordLabel}>Password</ThemedText>
                        <PasswordValidator
                            password={password}
                            confirmPassword={confirmPassword}
                            nrOfChars={8}
                            hasAtLeastOneUpperCase={true}
                            hasAtLeastOneSpecialChar={true}
                            hasAtLeastOneNumber={true}
                            onStrengthChange={handleStrengthChange}
                            onPasswordChange={handlePasswordChange}
                            isEqualPasswords={handleEqualPasswords}
                            showRecomendations={true}
                            inputStyle={[
                                styles.passwordInput,
                                touched.password && (errors.password ? styles.inputError : styles.inputFocused)
                            ]}
                            confirmPasswordInputStyle={[
                                styles.passwordInput,
                                touched.confirmPassword && (errors.confirmPassword ? styles.inputError : styles.inputFocused)
                            ]}
                            onPasswordFocus={handlePasswordFocus}
                            onConfirmPasswordFocus={handleConfirmPasswordFocus}
                            colorPalette={{
                                firstColor: "#ffcccc",   // Very weak
                                secondColor: "#ffe066",  // Weak
                                thirdColor: "#9bf6ff",   // Good
                                fourthColor: "#2a9d8f",  // Strong
                                warning: "#e76f51",
                            }}
                            strengthText={["Very Weak", "Weak", "Good", "Strong"]}
                        />
                        
                        {/* Password Error */}
                        {touched.password && errors.password && (
                            <View style={styles.validationContainer}>
                                <Text style={styles.invalidMark}>⚠</Text>
                                <Text style={styles.errorMessage}>{errors.password}</Text>
                            </View>
                        )}
                        
                        {/* Confirm Password Error */}
                        {touched.confirmPassword && errors.confirmPassword && (
                            <View style={styles.validationContainer}>
                                <Text style={styles.invalidMark}>⚠</Text>
                                <Text style={styles.errorMessage}>{errors.confirmPassword}</Text>
                            </View>
                        )}
                    </View>

                    <Spacer height={20}/>

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
                    
                    <Spacer height={20}/>

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
        paddingTop: 40,
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
        marginBottom: 30,
        color: Colors.title,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 55,
        borderWidth: 1,
        borderColor: '#e1e1e1',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#fafafa',
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
    passwordLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: Colors.title,
    },
    passwordInput: {
        height: 55,
        borderWidth: 1,
        borderColor: '#e1e1e1',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#fafafa',
        marginBottom: 10,
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
});
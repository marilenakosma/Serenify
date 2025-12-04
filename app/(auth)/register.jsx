import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, Keyboard, StyleSheet, Text, TouchableOpacity,
     TouchableWithoutFeedback, View,ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import validator from 'validator';
import BackButton from "../../components/BackButton";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedInput from "../../components/ThemedInput";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { ResponsiveDimensions as RD } from "../../constants/responsiveDimensions";
import { Colors } from "../../constants/Colors";
import { useAuthStore } from "../../store/authStore";
import { useTranslation } from '../../constants/translations';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Register = () => {
    const { register, isLoading } = useAuthStore();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);
    const { t } = useTranslation();
    
    const router = useRouter();

    // Custom Password Strength Component 
    const PasswordStrengthMeter = ({ strength, password }) => {
        const getStrengthText = () => {
         if (strength < 0.3) return t('validation.veryWeak');
         if (strength < 0.6) return t('validation.weak');
         if (strength < 0.9) return t('validation.good');
         return t('validation.strong');
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
                setErrors(prev => ({ ...prev, name: t('validation.nameRequired') }));
            } else if (input.trim().length < 2) {
                setErrors(prev => ({ ...prev, name: t('validation.nameTooShort') }));
            } else {
                setErrors(prev => ({ ...prev, name: '' }));
            }
        }
    };

    const validateEmail = (input) => {
  setEmail(input);
  if (touched.email) {
    if (!input) {
      setErrors(prev => ({ ...prev, email: t('validation.emailRequired') })); 
    } else if (!validator.isEmail(input)) {
      setErrors(prev => ({ ...prev, email: t('validation.emailInvalid') })); 
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  }
};

    const validatePassword = (input) => {
  setPassword(input);
  if (touched.password) {
    const validationErrors = [];
    
    if (input.length < 8) validationErrors.push(t('validation.atLeast8Chars'));
    if (!/[A-Z]/.test(input)) validationErrors.push(t('validation.oneUppercase'));
    if (!/[a-z]/.test(input)) validationErrors.push(t('validation.oneLowercase'));
    if (!/\d/.test(input)) validationErrors.push(t('validation.oneNumber'));
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(input)) validationErrors.push(t('validation.oneSpecialChar'));
    
    if (validationErrors.length > 0) {
      setErrors(prev => ({ 
        ...prev, 
        password: `${t('validation.missing')}: ${validationErrors.join(', ')}` 
      }));
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
          setErrors(prev => ({ ...prev, confirmPassword: t('validation.confirmPasswordRequired') })); 
        } else if (input !== password) {
          setErrors(prev => ({ ...prev, confirmPassword: t('validation.passwordsNotMatch') })); 
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
        const nameError = !name.trim() ? t('validation.nameRequired') : name.trim().length < 2 ? t('validation.nameTooShort') : '';
        const emailError = !email ? t('validation.emailRequired') : !validator.isEmail(email) ? t('validation.emailInvalid') : '';
        const passwordError = passwordStrength < 1 ? t('validation.passwordRequirementsNotMet') : '';
        const confirmPasswordError = confirmPassword !== password ? t('validation.passwordsNotMatch') : '';

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
            //Alert.alert('Validation Error', 'Please fix the errors before submitting');
            return;
        }

        const result = await register(name,email,password);
        if (result.success) {
         console.log('Registration successful - navigating...');
       } else {
         Alert.alert(t('common.error'), result.error);
       }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView style={{flex:1}}>
                <SafeAreaView style={{backgroundColor: Colors.background}}>
                    <BackButton/>
                    <ThemedView style={{flexDirection:'row', justifyContent:'center', paddingVertical: 20}}>
                        <Image source={require('../../assets/images/tropical.png')}
                            style={styles.headerImage} />   
                    </ThemedView>
                </SafeAreaView>

                  <KeyboardAwareScrollView
                    contentContainerStyle={styles.container}
                    enableOnAndroid={true}
                    extraScrollHeight={10}
                    keyboardShouldPersistTaps="handled"
                 >
                    <ThemedText title={true} style={styles.title}>
                        {t('auth.register')}
                    </ThemedText>
                    
                    {/* Name Input */}
                    <View style={styles.inputContainer}>
                        <ThemedInput 
                            style={[
                                styles.input,
                                touched.name && (errors.name ? styles.inputError : styles.inputFocused)
                            ]}
                            placeholder={t('auth.fullName')}
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
                            placeholder={t('auth.email')}
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
                                    <Text style={styles.validMark}>{t('validation.validEmail')}</Text> 
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
                            placeholder={t('auth.password')}
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
                            placeholder={t('auth.confirmPassword')}
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
                                    <Text style={styles.validMark}>{t('validation.passwordsMatch')}</Text>
                                ) : null}
                            </View>
                        )}
                    </View>


                    <Spacer height={RD.isSmallScreen ? 5 : 8}/>

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
                            {isLoading ? t('auth.creatingAccount') : t('auth.createAccount') }
                        </ThemedText>
                    </ThemedButton>
                    
                    <Spacer height={RD.isSmallScreen ? 5 : 8}/>

                    {/* Or Divider */}
                    <View style={styles.orContainer}>
                        <View style={styles.orLine} />
                        <ThemedText style={styles.orText}>{t('auth.continue')}</ThemedText>
                        <View style={styles.orLine} />
                    </View>
                    
                    {/* Social Login */}
                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={styles.image}>
                            <Image source={require('../../assets/images/google.png')}
                                 style={styles.socialIcon} />  
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.image}>
                            <Image source={require('../../assets/images/apple.png')}
                                 style={styles.socialIcon} />  
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.image}>
                            <Image source={require('../../assets/images/facebook.png')}
                                 style={styles.socialIcon} />  
                        </TouchableOpacity>
                    </View>

                    <Spacer height={RD.isSmallScreen ? 10 : 20}/>

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <ThemedText style={styles.loginText}>
                            {t('auth.haveAccount')}
                        </ThemedText>
                        <Link href="/login" replace>
                            <ThemedText style={styles.loginLink}>
                                {t('auth.signin')}
                            </ThemedText>
                        </Link>
                    </View>
                </KeyboardAwareScrollView>
            </ThemedView>      
        </TouchableWithoutFeedback>    
    );
};

export default Register;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        //alignItems: 'center',
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
    headerImage: {
        width: RD.wp(30), // 25% of screen width
        height: RD.wp(30), // Keep it square
        maxWidth: 90,    // Don't get too big on tablets
        maxHeight: 90,
        resizeMode: 'contain',
    },
    title: {
        textAlign: "center",
        fontSize: RD.wp(5.7), 
        marginBottom: RD.hp(2.5),
        color: Colors.title,
    },
    inputContainer: {
        width: '100%',
        marginBottom: RD.hp(2),
    },
    input: {
        width: '100%',
        height: RD.hp(5),
        borderWidth: 1,
        borderColor: '#e1e1e1',
        borderRadius: RD.wp(2.5),
        paddingHorizontal: RD.wp(3),
        paddingVertical: RD.hp(1),
        fontSize: RD.wp(3.7),
        backgroundColor: '#fafafa',
        fontFamily:'MontserratZ-Regular',
        textAlignVertical: 'center', // Android
        includeFontPadding: false, // Android
        color: '#000000',
    },
    inputFocused: {
        borderColor: Colors.primary,
        backgroundColor: 'white',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        color: '#000000',
    },
    inputError: {
        borderColor: '#ff6b6b',
        backgroundColor: '#fff5f5',
        color: '#000000',
    },
    validationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        paddingHorizontal: 4,
    },
    errorMessage: {
        color: '#ff6b6b',
        fontSize: RD.wp(3.2),
        marginLeft: 6,
        flex: 1,
    },
    validMark: {
        color: '#4CAF50',
        fontSize: RD.wp(3.2),
    },
    invalidMark: {
        color: '#ff6b6b',
        fontSize: 14,
    },
    submitButton: {
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
        width: RD.wp(13), 
        height: RD.wp(13), 
        borderRadius: RD.wp(3),
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: RD.wp(3),
        borderWidth: 1,
        borderColor: '#e1e1e1',
    },
    loginContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loginText: {
        fontSize: RD.wp(3.5),
        color: '#666',
    },
    loginLink: {
        fontSize: RD.wp(3.5),
        color: Colors.primary,
        marginLeft: RD.wp(1),
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
        fontSize: RD.wp(3),
        textAlign: 'right',
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: RD.wp(5),
    },
    socialIcon: {
    width: RD.wp(6),  
    height: RD.wp(6),
    resizeMode: 'contain',
},
});
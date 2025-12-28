import { Link } from "expo-router";
import { useCallback, useState,useEffect } from "react";
import { Alert, Image, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
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
import { CustomAlert } from "../../components/CustomAlert";
import { useRouter } from "expo-router";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '../config/firebaseConfig';

const Login = () => {
    const {login,isLoading,loginWithGoogle} = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [alertConfig, setAlertConfig] = useState(null);
    const router = useRouter();
    const { t } = useTranslation();

     useEffect(() => {
        GoogleSignin.configure({
            webClientId: GOOGLE_WEB_CLIENT_ID,
        });
    }, []);

    const handleGoogleSignIn = async () => {
     try {
       await GoogleSignin.hasPlayServices();
       const userInfo = await GoogleSignin.signIn();
    
       if (userInfo.data?.idToken) {
        const result = await loginWithGoogle(userInfo.data.idToken);
      
       if (!result.success) {
         const errorMessage = result.errorKey ? t(result.errorKey) : result.error;
         handleAlert(t('common.error'), errorMessage);
       }
      }
     } catch (error) {
       console.error('Google Sign-In Error:', error);
       handleAlert(t('common.error'), t('errors.googleSignInFailed'));
     }
   };
    
    
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
                    setErrors(prev => ({ ...prev, email: t('validation.emailRequired') }));
                } else if (!validator.isEmail(input)) {
                    setErrors(prev => ({ ...prev, email: t('validation.emailInvalid') }));
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
                    setErrors(prev => ({ ...prev, password: t('validation.passwordRequired') }));
                } else if (input.length < 6) {
                    setErrors(prev => ({ ...prev, password: t('validation.passwordTooShort') }));
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
        const emailError = !email ? t('validation.emailRequired') : !validator.isEmail(email) ? t('validation.emailInvalid') : '';
        const passwordError = !password ? t('validation.passwordRequired') : password.length < 6 ? t('validation.passwordTooShort') : '';

        setErrors({
            email: emailError,
            password: passwordError
        });

        setTouched({ email: true, password: true });

        return !emailError && !passwordError;
    };

    const handleAlert = (title, message, onConfirmAction) => {
        setAlertConfig({
          type: 'error',
          title: title,
          message: message,
          showCancel: !!onConfirmAction,
          onConfirm: async () => {
            try {
              if (onConfirmAction) {
                await onConfirmAction();
              }
              setAlertConfig(null);
            } catch (error) {
              setAlertConfig(null);
            }
          }, 
          onClose: () => setAlertConfig(null)
        });
      };

    const handleLogin = async () => {
        if (!validateForm()) {
            handleAlert(t('validation.validationError'),t('validation.fixErrorsBeforeSubmitting'));
            return;
        }
        
        try {
            const result = await login(email,password);
            if(result.success) {
              //Alert.alert(t('common.success'), t('auth.loginSuccessful'));
            } else {
              //Alert.alert(t('common.error'), t('auth.invalidCredentials'));
             const errorMessage = result.errorKey ? t(result.errorKey) : result.error;
             handleAlert(t('common.error'),errorMessage);
            }
        } catch(error) {
            const errorMessage = result.errorKey ? t(result.errorKey) : result.error;
            handleAlert(t('common.error'),errorMessage);
        }
    };
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView style={{flex:1}}>
                <SafeAreaView style={{backgroundColor: Colors.background}}>
                    <BackButton/>
                    <ThemedView style={{flexDirection:'row', justifyContent:'center', paddingVertical: 15}}>
                        <Image source={require('../../assets/images/leaf-green.png')}
                           style={styles.headerImage}  />
                    </ThemedView>
                </SafeAreaView>

                <ScrollView 
                    style={{flex: 1}}
                    contentContainerStyle={{flex: 1}}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <ThemedView style={styles.container}>
                        <ThemedText title={true} style={styles.title}>
                           {t('auth.login')}
                        </ThemedText>
                        
                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <ThemedInput 
                                style={[
                                    styles.input,
                                    touched.email && (errors.email ? styles.inputError : styles.inputFocused)
                                ]}
                                placeholder = {t('auth.email')}
                                placeholderTextColor="#666"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={handleEmailChange}
                                onFocus={handleEmailFocus}
                                value={email}
                            />
                            

                            {touched.email && errors.email && (
                                <View style={styles.validationContainer}>
                                     <ThemedText style={styles.errorMessage}>⚠ {errors.email}</ThemedText>
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
                                placeholder = {t('auth.password')}
                                onChangeText={handlePasswordChange}
                                onFocus={handlePasswordFocus}
                                value={password}
                                secureTextEntry 
                            />
                            {touched.password && errors.password && (
                                <View style={styles.validationContainer}>
                                    <ThemedText style={styles.invalidMark}>⚠</ThemedText>
                                    <ThemedText style={styles.errorMessage}>{errors.password}</ThemedText>
                                </View>
                            )}
                        </View>

                        {/* Forgot Password */}
                        <TouchableOpacity 
                            style={styles.forgotPasswordContainer}
                            onPress={() => router.push('/forgot-password')}
                        >
                            <ThemedText style={styles.forgotPasswordText}>
                                {t('auth.forgotPassword')}
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

                        {alertConfig && (
                           <CustomAlert
                             type={alertConfig.type}
                             title={alertConfig.title}
                             message={alertConfig.message}
                             showCancel={alertConfig.showCancel}
                             onConfirm={alertConfig.onConfirm}
                             onClose={alertConfig.onClose}
                           />
                         )}

                            <ThemedText title={true} style={styles.buttonText}>
                                {isLoading ?  t('auth.signingin') : t('auth.signInBtn')}
                            </ThemedText>
                        </ThemedButton>
                        
                        <Spacer height={RD.isSmallScreen ? 5 : 8}/>

                        {/* Or Divider */}
                        <View style={styles.orContainer}>
                            <View style={styles.orLine} />
                            <ThemedText style={styles.orText}>{t('auth.loginWith')}</ThemedText>
                            <View style={styles.orLine} />
                        </View>
                        
                        {/* Social Login */}
                        <View style={styles.socialContainer}>
                                                <TouchableOpacity style={styles.image} onPress={handleGoogleSignIn}>
                                                    <Image source={require('../../assets/images/google.png')}
                                                         style={styles.socialIcon} />  
                                                    <ThemedText>Google</ThemedText>
                                                </TouchableOpacity>
                        
                                                {/*<TouchableOpacity style={styles.image}>
                                                    <Image source={require('../../assets/images/apple.png')}
                                                         style={styles.socialIcon} />  
                                                </TouchableOpacity>
                        
                                                <TouchableOpacity style={styles.image}>
                                                    <Image source={require('../../assets/images/facebook.png')}
                                                         style={styles.socialIcon} />  
                                                </TouchableOpacity>*/}
                        </View>

                        <Spacer height={RD.isSmallScreen ? 10 : 20}/>

                        {/* Register Link */}
                        <View style={styles.registerContainer}>
                            <ThemedText style={styles.registerText}>
                                {t('auth.dontHaveAccount')}
                            </ThemedText>
                            <Link href="/register" replace>
                                <ThemedText style={styles.registerLink}>
                                    {t('auth.signup')}
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
    headerImage: {
        width: RD.wp(40), // 25% of screen width
        height: RD.wp(50), // Keep it square
        //maxWidth: 150,    // Don't get too big on tablets
        //maxHeight: 150,
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
        fontFamily:'MontserratZ-Regular',
        letterSpacing:0.3,
        backgroundColor: '#fafafa',
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
        fontSize: 13,
        marginLeft: 6,
        flex: 1,
    },
    validMark: {
        color: '#4CAF50',
        fontSize: 13,
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
    },
    loginButton: {
        opacity: 1,
        //borderRadius:8
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#f2f2f2',
        fontSize: 16,
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
    image: {
        backgroundColor: Colors.background,
        height: RD.wp(10), 
        borderRadius: RD.wp(2),
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: RD.wp(3),
        marginTop:RD.wp(1),
        marginBottom:RD.wp(0.5),
        borderColor:Colors.primary,
        borderWidth: 1,
        flexDirection:'row',
        gap:8,
        padding:8
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
        marginLeft: 4,
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
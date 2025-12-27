import { useState } from "react";
import { 
  StyleSheet, 
  View, 
  Image, 
  Keyboard, 
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import validator from 'validator';
import BackButton from "../../components/BackButton";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedInput from "../../components/ThemedInput";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { ResponsiveDimensions as RD } from "../../constants/responsiveDimensions";
import { Colors } from "../../constants/Colors";
import { useTranslation } from '../../constants/translations';
import { CustomAlert } from "../../components/CustomAlert";
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [alertConfig, setAlertConfig] = useState(null);
  const { t } = useTranslation();
  const router = useRouter();

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

  const handleEmailFocus = () => {
    setTouched(prev => ({ ...prev, email: true }));
  };

  const handleResetPassword = async () => {
    // Validate email
    if (!email) {
      setErrors({ email: t('validation.emailRequired') });
      setTouched({ email: true });
      return;
    }
    
    if (!validator.isEmail(email)) {
      setErrors({ email: t('validation.emailInvalid') });
      setTouched({ email: true });
      return;
    }

    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      
      // Show success alert
      setAlertConfig({
        type: 'success',
        title: t('common.success'),
        message: t('auth.resetEmailSent'),
        onClose: () => {
          setAlertConfig(null);
          router.back();
        }
      });
    } catch (error) {
      console.error('Password reset error:', error);
      
      let errorMessage = t('auth.resetEmailError');
      
      // Handle specific Firebase errors
      if (error.code === 'auth/user-not-found') {
        errorMessage = t('auth.invalidCredentials');
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = t('validation.emailInvalid');
      }

      setAlertConfig({
        type: 'error',
        title: t('common.error'),
        message: errorMessage,
        onClose: () => setAlertConfig(null)
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={{ flex: 1 }}>
        <SafeAreaView style={{ backgroundColor: Colors.background }}>
          <BackButton />
          <ThemedView style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 15 }}>
            <Image 
              source={require('../../assets/images/fallLeaf.png')}
              style={styles.headerImage} 
            />
          </ThemedView>
        </SafeAreaView>

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ThemedView style={styles.container}>
            <ThemedText title={true} style={styles.title}>
              {t('auth.resetPasswordTitle')}
            </ThemedText>

            <ThemedText style={styles.subtitle}>
              {t('auth.resetPasswordSubtitle')}
            </ThemedText>
            

            <Spacer height={RD.hp(3)} />

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
                autoCorrect={false}
                onChangeText={validateEmail}
                onFocus={handleEmailFocus}
                value={email}
              />
              {touched.email && errors.email && (
                <View style={styles.validationContainer}>
                  <ThemedText style={styles.errorMessage}>⚠ {errors.email}</ThemedText>
                </View>
             )}
            </View>

            <Spacer height={RD.hp(2)} />

            {/* Reset Button */}
            <ThemedButton 
              onPress={handleResetPassword}
              style={[
                styles.resetButton,
                isLoading && styles.buttonDisabled
              ]}
              disabled={isLoading}
            >
              <ThemedText title={true} style={styles.buttonText}>
                {isLoading ? t('auth.sendingResetLink') : t('auth.sendResetLink')}
              </ThemedText>
            </ThemedButton>

            <Spacer height={RD.hp(2)} />

            {/* Back to Login */}
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ThemedText style={styles.backText}>
                {t('auth.backToLogin')}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ScrollView>

        {alertConfig && (
          <CustomAlert
            type={alertConfig.type}
            title={alertConfig.title}
            message={alertConfig.message}
            onClose={alertConfig.onClose}
          />
        )}
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "white",
    paddingHorizontal: 32,
    paddingTop: 40,
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
    width: RD.wp(40),
    height: RD.wp(60),
    resizeMode: 'contain',
  },
  title: {
    textAlign: "center",
    fontSize: RD.wp(5.7),
    marginBottom: RD.hp(1.5),
    color: Colors.title,
  },
  subtitle: {
    //textAlign: "center",
    fontSize: RD.wp(3.7),
    color: '#666',
    //flexWrap:'wrap',
    //paddingHorizontal: 20,
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
    fontFamily: 'MontserratZ-Regular',
    letterSpacing: 0.3,
    backgroundColor: '#fafafa',
    textAlignVertical: 'center',
    includeFontPadding: false,
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
    marginTop: 6,
    paddingHorizontal: 4,
  },
  errorMessage: {
    color: '#ff6b6b',
    fontSize: 13,
  },
  resetButton: {
    opacity: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#f2f2f2',
    fontSize: 16,
  },
  backButton: {
    paddingVertical: 10,
  },
  backText: {
    color: Colors.primary,
    fontSize: 14,
  },
});
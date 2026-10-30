import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { INITIAL_STAFF_USERS } from '../data/mockDatabase';

export default function LoginScreen({
  onLoginSuccess,
  onNavigateRegister,
  onBackToSplash,
  staffList,
}) {
  const [identifier, setIdentifier] = useState(''); // email, username, or employee ID
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = () => {
    setErrorMsg('');
    const query = identifier.trim().toLowerCase();

    if (!query || !password) {
      setErrorMsg('Please enter your email or username and password.');
      return;
    }

    const allUsers = staffList || INITIAL_STAFF_USERS;
    const found = allUsers.find((u) => {
      const matchEmail = u.email && u.email.toLowerCase() === query;
      const matchId = u.employeeId && u.employeeId.toLowerCase() === query;
      const matchName = u.name && u.name.toLowerCase().includes(query);
      const matchPass = u.password === password;
      return (matchEmail || matchId || matchName) && matchPass;
    });

    if (!found) {
      setErrorMsg('Invalid email/username or password. Please try again.');
      return;
    }

    onLoginSuccess(found);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Password Recovery',
      'Please enter your registered staff email or contact the PNG Express Fleet IT Operations Helpdesk (+94 11 234 5678).'
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Top Brand Identity Header */}
      <View style={styles.brandHeader}>
        {onBackToSplash ? (
          <TouchableOpacity style={styles.backPill} onPress={onBackToSplash}>
            <Text style={styles.backPillText}>← Splash</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.busIconContainer}>
          <Image
            source={require('../../assets/bus-logo-blue.png')}
            style={styles.busImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.brandTitle}>PNG Express</Text>
        <Text style={styles.brandTagline}>Your Trusted Transport Service</Text>
      </View>

      {/* Welcome Title */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Welcome Back</Text>
        <Text style={styles.welcomeSubtitle}>Sign in to continue</Text>
      </View>

      {/* Error Message Alert */}
      {errorMsg ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      {/* Input Fields */}
      <View style={styles.formContainer}>
        {/* Email or Username */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputField}
            placeholder="Email or Username"
            placeholderTextColor="#94a3b8"
            value={identifier}
            onChangeText={(text) => {
              setIdentifier(text);
              if (errorMsg) setErrorMsg('');
            }}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Password with Eye Toggle */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.inputField, { paddingRight: 46 }]}
            placeholder="Password"
            placeholderTextColor="#94a3b8"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errorMsg) setErrorMsg('');
            }}
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🙈'}</Text>
          </TouchableOpacity>
        </View>

        {/* Forgot Password Link */}
        <TouchableOpacity
          style={styles.forgotBtn}
          onPress={handleForgotPassword}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Main Solid Blue Login Button */}
        <TouchableOpacity
          style={styles.btnLogin}
          onPress={handleLogin}
          activeOpacity={0.85}
        >
          <Text style={styles.btnLoginText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Registration Link */}
      <View style={styles.footerSection}>
        <Text style={styles.footerText}>
          Don’t have an account?{' '}
          <Text style={styles.registerLink} onPress={onNavigateRegister}>
            Register Here
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 32,
    justifyContent: 'space-between',
    ...(Platform.OS === 'web'
      ? {
          maxWidth: 500,
          width: '100%',
          alignSelf: 'center',
          minHeight: '100vh',
        }
      : {}),
  },

  // Brand Header
  brandHeader: {
    alignItems: 'center',
    marginBottom: 28,
    position: 'relative',
  },
  backPill: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: '#f1f5f9',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  backPillText: {
    fontSize: 11,
    color: '#006FD8',
    fontWeight: '700',
  },
  busIconContainer: {
    width: 120,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  busImage: {
    width: 110,
    height: 80,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#006FD8',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  brandTagline: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 3,
    letterSpacing: 0.3,
    textAlign: 'center',
  },

  // Welcome Section
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },

  // Error Banner
  errorBanner: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '600',
  },

  // Form Section
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  inputField: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#0f172a',
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    top: 15,
    padding: 2,
  },
  eyeIcon: {
    fontSize: 18,
  },

  // Forgot Password
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    paddingVertical: 2,
  },
  forgotText: {
    color: '#006FD8',
    fontSize: 13,
    fontWeight: '600',
  },

  // Login Button
  btnLogin: {
    height: 54,
    backgroundColor: '#006FD8',
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#006FD8',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  btnLoginText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Footer
  footerSection: {
    alignItems: 'center',
    marginTop: 32,
    paddingBottom: 8,
  },
  footerText: {
    fontSize: 13,
    color: '#475569',
  },
  registerLink: {
    color: '#006FD8',
    fontWeight: '800',
  },
});

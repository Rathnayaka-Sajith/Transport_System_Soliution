import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
  Platform,
  Alert,
} from 'react-native';

// Web compatibility polyfill for Alert.alert
if (Platform.OS === 'web') {
  Alert.alert = (title, message, buttons) => {
    if (buttons && buttons.length > 1) {
      const confirmed = window.confirm(`${title || ''}\n\n${message || ''}`);
      if (confirmed) {
        const okBtn = buttons.find((b) => b.style !== 'cancel' && b.text !== 'Cancel') || buttons[buttons.length - 1];
        if (okBtn && okBtn.onPress) okBtn.onPress();
      } else {
        const cancelBtn = buttons.find((b) => b.style === 'cancel' || b.text === 'Cancel');
        if (cancelBtn && cancelBtn.onPress) cancelBtn.onPress();
      }
    } else {
      window.alert(`${title || ''}${message ? `\n\n${message}` : ''}`);
      if (buttons && buttons[0] && buttons[0].onPress) {
        buttons[0].onPress();
      }
    }
  };
}

import { INITIAL_STAFF_USERS } from './src/data/mockDatabase';
import StaffHeader from './src/components/StaffHeader';
import WelcomeSplashScreen from './src/screens/WelcomeSplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import RoleSelectorScreen from './src/screens/RoleSelectorScreen';
import DriverDashboardScreen from './src/screens/DriverDashboardScreen';
import ConductorDashboardScreen from './src/screens/ConductorDashboardScreen';
import MechanicDashboardScreen from './src/screens/MechanicDashboardScreen';

export default function App() {
  const [staffUsers, setStaffUsers] = useState(INITIAL_STAFF_USERS);
  const [currentScreen, setCurrentScreen] = useState('splash'); // 'splash' | 'login' | 'register' | 'select-role' | 'dashboard'
  const [currentUser, setCurrentUser] = useState(null);
  const [activeRole, setActiveRole] = useState(null); // 'driver' | 'conductor' | 'mechanic'

  // Handle successful login
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    // If staff has multiple roles (e.g. Driver + Conductor), ask "Who are you logging in as right now?"
    if (user.roles && user.roles.length > 1) {
      setCurrentScreen('select-role');
    } else {
      // Single role staff: direct to their specific workspace
      setActiveRole(user.roles[0]);
      setCurrentScreen('dashboard');
    }
  };

  // Handle successful registration
  const handleRegisterSuccess = (newUser) => {
    setStaffUsers([newUser, ...staffUsers]);
    setCurrentUser(newUser);
    if (newUser.roles && newUser.roles.length > 1) {
      setCurrentScreen('select-role');
    } else {
      setActiveRole(newUser.roles[0]);
      setCurrentScreen('dashboard');
    }
  };

  // Handle selection of active shift duty
  const handleSelectRole = (roleId) => {
    setActiveRole(roleId);
    setCurrentScreen('dashboard');
  };

  // Handle duty switch from header
  const handleSwitchDuty = () => {
    setCurrentScreen('select-role');
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    setActiveRole(null);
    setCurrentScreen('splash');
  };

  const isSplash = currentScreen === 'splash';

  return (
    <SafeAreaView style={[styles.container, isSplash && { backgroundColor: '#006FD8' }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={isSplash ? '#006FD8' : '#0b1329'}
      />

      <View style={[styles.phoneFrame, isSplash && { backgroundColor: '#006FD8', borderColor: '#005bb5' }]}>
        {/* Persistent Header when logged in */}
        {currentUser && currentScreen === 'dashboard' ? (
          <StaffHeader
            user={currentUser}
            activeRole={activeRole}
            onSwitchRole={handleSwitchDuty}
            onLogout={handleLogout}
          />
        ) : null}

        <View style={[styles.screenBody, isSplash && { backgroundColor: '#006FD8' }]}>
          {currentScreen === 'splash' && (
            <WelcomeSplashScreen onContinue={() => setCurrentScreen('login')} />
          )}

          {currentScreen === 'login' && (
            <LoginScreen
              staffList={staffUsers}
              onLoginSuccess={handleLoginSuccess}
              onNavigateRegister={() => setCurrentScreen('register')}
              onBackToSplash={() => setCurrentScreen('splash')}
            />
          )}

          {currentScreen === 'register' && (
            <RegisterScreen
              onRegisterSuccess={handleRegisterSuccess}
              onBackToLogin={() => setCurrentScreen('login')}
            />
          )}

          {currentScreen === 'select-role' && currentUser && (
            <RoleSelectorScreen
              user={currentUser}
              onSelectRole={handleSelectRole}
              onCancel={activeRole ? () => setCurrentScreen('dashboard') : null}
            />
          )}

          {currentScreen === 'dashboard' && currentUser && (
            <>
              {activeRole === 'driver' && <DriverDashboardScreen user={currentUser} />}
              {activeRole === 'conductor' && <ConductorDashboardScreen user={currentUser} />}
              {activeRole === 'mechanic' && <MechanicDashboardScreen user={currentUser} />}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1329',
    ...(Platform.OS === 'web' ? { minHeight: '100vh', width: '100%', alignItems: 'center' } : {}),
  },
  phoneFrame: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0b1329',
    ...(Platform.OS === 'web'
      ? {
          maxWidth: 500,
          minHeight: '100vh',
          boxShadow: '0 0 40px rgba(0,0,0,0.6)',
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: '#1e293b',
        }
      : {}),
  },
  screenBody: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});

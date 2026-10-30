import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';

import { INITIAL_STAFF_USERS } from './src/data/mockDatabase';
import StaffHeader from './src/components/StaffHeader';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import RoleSelectorScreen from './src/screens/RoleSelectorScreen';
import DriverDashboardScreen from './src/screens/DriverDashboardScreen';
import ConductorDashboardScreen from './src/screens/ConductorDashboardScreen';
import MechanicDashboardScreen from './src/screens/MechanicDashboardScreen';

export default function App() {
  const [staffUsers, setStaffUsers] = useState(INITIAL_STAFF_USERS);
  const [currentScreen, setCurrentScreen] = useState('login'); // 'login' | 'register' | 'select-role' | 'dashboard'
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
    setCurrentScreen('login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0b1329" />

      {/* Persistent Header when logged in */}
      {currentUser && currentScreen === 'dashboard' ? (
        <StaffHeader
          user={currentUser}
          activeRole={activeRole}
          onSwitchRole={handleSwitchDuty}
          onLogout={handleLogout}
        />
      ) : null}

      <View style={styles.screenBody}>
        {currentScreen === 'login' && (
          <LoginScreen
            staffList={staffUsers}
            onLoginSuccess={handleLoginSuccess}
            onNavigateRegister={() => setCurrentScreen('register')}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1329',
  },
  screenBody: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { INITIAL_STAFF_USERS } from '../data/mockDatabase';

export default function LoginScreen({ onLoginSuccess, onNavigateRegister, staffList }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = () => {
    setErrorMsg('');
    if (!email.trim() || !password) {
      setErrorMsg('Please enter your registered email and password.');
      return;
    }

    const allUsers = staffList || INITIAL_STAFF_USERS;
    const found = allUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (!found) {
      setErrorMsg('Invalid email or password. You can also use a quick demo login below.');
      return;
    }

    onLoginSuccess(found);
  };

  const handleQuickDemo = (demoUser) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    onLoginSuccess(demoUser);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topIconBox}>
        <Text style={styles.topEmoji}>🚍</Text>
      </View>

      <Text style={styles.title}>Staff Sign In</Text>
      <Text style={styles.subtitle}>
        Unified operational portal for Drivers, Conductors & Fleet Mechanics
      </Text>

      {errorMsg ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      <View style={styles.formGroup}>
        <Text style={styles.label}>REGISTERED EMAIL ADDRESS</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. sunil.driver@pngexpress.lk"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>PASSWORD</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.btnSignIn} onPress={handleLogin}>
        <Text style={styles.btnSignInText}>Sign In to Shift ➔</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerLink} onPress={onNavigateRegister}>
        <Text style={styles.registerLinkText}>
          New staff member? <Text style={{ color: '#046bd2', fontWeight: '800' }}>Register Here (Multi-Role)</Text>
        </Text>
      </TouchableOpacity>

      {/* Quick Demo One-Click Accounts */}
      <View style={styles.demoBox}>
        <Text style={styles.demoTitle}>QUICK TEST ACCOUNTS (MULTI-ROLE & SINGLE):</Text>
        
        <View style={styles.demoGrid}>
          {INITIAL_STAFF_USERS.slice(0, 4).map((user) => (
            <TouchableOpacity
              key={user.id}
              style={styles.demoCard}
              onPress={() => handleQuickDemo(user)}
            >
              <Text style={styles.demoCardEmoji}>{user.avatar}</Text>
              <Text style={styles.demoCardName}>{user.name.split(' ')[0]}</Text>
              <Text style={styles.demoCardRole}>
                {user.roles.map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join(' + ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f8fafc',
    flexGrow: 1,
  },
  topIconBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#046bd2',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  topEmoji: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  errorBanner: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  input: {
    height: 48,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0f172a',
  },
  btnSignIn: {
    height: 50,
    backgroundColor: '#046bd2',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#046bd2',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  btnSignInText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  registerLink: {
    marginTop: 18,
    alignItems: 'center',
  },
  registerLinkText: {
    fontSize: 13,
    color: '#475569',
  },
  demoBox: {
    marginTop: 26,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 16,
  },
  demoTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  demoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  demoCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 10,
  },
  demoCardEmoji: {
    fontSize: 18,
  },
  demoCardName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  demoCardRole: {
    fontSize: 10,
    color: '#046bd2',
    fontWeight: '700',
    marginTop: 2,
  },
});

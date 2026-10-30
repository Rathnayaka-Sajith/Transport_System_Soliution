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
import { ROLE_DEFINITIONS } from '../data/mockDatabase';

export default function RegisterScreen({ onRegisterSuccess, onBackToLogin }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nic, setNic] = useState('');

  // Multi-Role Category Selection (can check 1, 2, or 3)
  const [selectedRoles, setSelectedRoles] = useState(['driver']);

  // Role Specific Fields
  const [licenseNo, setLicenseNo] = useState('');
  const [conductorBadge, setConductorBadge] = useState('');
  const [mechanicSpecialty, setMechanicSpecialty] = useState('Air Brakes & Suspension');

  const toggleRole = (roleId) => {
    if (selectedRoles.includes(roleId)) {
      if (selectedRoles.length === 1) {
        Alert.alert('Selection Required', 'You must select at least one staff duty category.');
        return;
      }
      setSelectedRoles(selectedRoles.filter((r) => r !== roleId));
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  const handleRegister = () => {
    if (!name.trim() || !phone.trim() || !email.trim() || !password) {
      Alert.alert('Required Fields', 'Please fill in your name, mobile, email, and password.');
      return;
    }

    if (selectedRoles.length === 0) {
      Alert.alert('Category Required', 'Please select at least one job role category.');
      return;
    }

    const newStaffUser = {
      id: 'emp-' + Date.now(),
      employeeId: 'PNG-EMP-' + Math.floor(106 + Math.random() * 50),
      name: name.trim(),
      email: email.trim(),
      password: password,
      phone: phone.trim(),
      nic: nic.trim() || '200019283710',
      avatar: selectedRoles.includes('driver') ? '👨‍✈️' : selectedRoles.includes('conductor') ? '🎫' : '🔧',
      roles: [...selectedRoles],
      driverDetails: selectedRoles.includes('driver') ? { licenseNo: licenseNo || 'B-DL-PENDING', experienceYears: 5 } : null,
      conductorDetails: selectedRoles.includes('conductor') ? { badgeNo: conductorBadge || 'COND-WP-NEW' } : null,
      mechanicDetails: selectedRoles.includes('mechanic') ? { specialization: mechanicSpecialty } : null,
    };

    Alert.alert(
      'Registration Complete',
      `Welcome ${newStaffUser.name}! Your account has been registered with ${selectedRoles.length} duty categories.`,
      [{ text: 'Continue', onPress: () => onRegisterSuccess(newStaffUser) }]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Staff Registration</Text>
        <TouchableOpacity onPress={onBackToLogin}>
          <Text style={styles.backBtnText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Register for one or more job roles</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>FULL NAME *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Priyantha Jayasuriya"
          placeholderTextColor="#94a3b8"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>MOBILE PHONE *</Text>
          <TextInput
            style={styles.input}
            placeholder="+94 7X XXX XXXX"
            placeholderTextColor="#94a3b8"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={[styles.formGroup, { flex: 1 }]}>
          <Text style={styles.label}>NIC NUMBER</Text>
          <TextInput
            style={styles.input}
            placeholder="1990XXXXXXXX"
            placeholderTextColor="#94a3b8"
            value={nic}
            onChangeText={setNic}
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>WORK EMAIL ADDRESS *</Text>
        <TextInput
          style={styles.input}
          placeholder="priyantha@pngexpress.lk"
          placeholderTextColor="#94a3b8"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>CREATE PASSWORD *</Text>
        <TextInput
          style={styles.input}
          placeholder="Minimum 6 characters"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* MULTI-ROLE CATEGORY CHECKBOX SECTION */}
      <View style={styles.rolesSection}>
        <Text style={styles.rolesTitle}>SELECT DUTY CATEGORIES (Choose 1, 2, or All 3):</Text>
        <Text style={styles.rolesHint}>
          If you work across multiple roles (e.g., Conductor who also drives, or Driver who handles mechanic repairs), check all that apply.
        </Text>

        {ROLE_DEFINITIONS.map((role) => {
          const isSelected = selectedRoles.includes(role.id);
          return (
            <TouchableOpacity
              key={role.id}
              style={[
                styles.roleCard,
                isSelected && { borderColor: role.color, backgroundColor: role.bgColor },
              ]}
              onPress={() => toggleRole(role.id)}
            >
              <Text style={styles.roleIcon}>{role.icon}</Text>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.roleCardTitle}>{role.title}</Text>
                <Text style={styles.roleCardDesc}>{role.description}</Text>
              </View>
              <View
                style={[
                  styles.checkboxCircle,
                  isSelected && { backgroundColor: role.color, borderColor: role.color },
                ]}
              >
                {isSelected ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Additional Role Specific Credentials */}
      {selectedRoles.includes('driver') && (
        <View style={styles.extraBox}>
          <Text style={styles.extraLabel}>BUS DRIVER LICENSE NUMBER</Text>
          <TextInput
            style={styles.extraInput}
            placeholder="e.g. B-9938120-DL"
            placeholderTextColor="#94a3b8"
            value={licenseNo}
            onChangeText={setLicenseNo}
          />
        </View>
      )}

      {selectedRoles.includes('conductor') && (
        <View style={[styles.extraBox, { borderColor: '#6ee7b7', backgroundColor: '#ecfdf5' }]}>
          <Text style={[styles.extraLabel, { color: '#065f46' }]}>CONDUCTOR BADGE / PERMIT NO.</Text>
          <TextInput
            style={styles.extraInput}
            placeholder="e.g. COND-WP-8821"
            placeholderTextColor="#94a3b8"
            value={conductorBadge}
            onChangeText={setConductorBadge}
          />
        </View>
      )}

      {selectedRoles.includes('mechanic') && (
        <View style={[styles.extraBox, { borderColor: '#fcd34d', backgroundColor: '#fffbeb' }]}>
          <Text style={[styles.extraLabel, { color: '#92400e' }]}>MECHANIC SPECIALIZATION</Text>
          <TextInput
            style={styles.extraInput}
            placeholder="e.g. Air Brakes, Suspension, AC Systems"
            placeholderTextColor="#94a3b8"
            value={mechanicSpecialty}
            onChangeText={setMechanicSpecialty}
          />
        </View>
      )}

      <TouchableOpacity style={styles.btnRegister} onPress={handleRegister}>
        <Text style={styles.btnRegisterText}>Complete Registration ➔</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8fafc',
    flexGrow: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  backBtnText: {
    fontSize: 12,
    color: '#046bd2',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  input: {
    height: 44,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#0f172a',
  },
  row: {
    flexDirection: 'row',
  },
  rolesSection: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
  },
  rolesTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  rolesHint: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 15,
    marginBottom: 12,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    marginBottom: 8,
  },
  roleIcon: {
    fontSize: 24,
  },
  roleCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  roleCardDesc: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 13,
  },
  checkboxCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  extraBox: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#93c5fd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  extraLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1e40af',
    marginBottom: 4,
  },
  extraInput: {
    height: 38,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 13,
    color: '#0f172a',
  },
  btnRegister: {
    height: 48,
    backgroundColor: '#10b981',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 20,
    shadowColor: '#10b981',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  btnRegisterText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});

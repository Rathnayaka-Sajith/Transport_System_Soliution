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
import { Feather } from '@expo/vector-icons';

export default function RegisterScreen({ onRegisterSuccess, onBackToLogin }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Selected Categories (can select multiple: driver, conductor, mechanic)
  const [selectedCategories, setSelectedCategories] = useState(['driver']);

  const toggleCategory = (catId) => {
    if (selectedCategories.includes(catId)) {
      if (selectedCategories.length === 1) {
        Alert.alert('Category Required', 'You must select at least one staff category.');
        return;
      }
      setSelectedCategories(selectedCategories.filter((c) => c !== catId));
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const handleRegister = () => {
    setErrorMsg('');

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !employeeId.trim() ||
      !password
    ) {
      setErrorMsg('Please fill in all fields (Name, Email, Phone, Employee ID, Password).');
      return;
    }

    if (selectedCategories.length === 0) {
      setErrorMsg('Please select at least one staff category.');
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const newStaffUser = {
      id: 'emp-' + Date.now(),
      employeeId: employeeId.trim().toUpperCase(),
      name: fullName,
      email: email.trim().toLowerCase(),
      password: password,
      phone: phone.trim(),
      nic: '2000' + Math.floor(10000000 + Math.random() * 90000000),
      avatar: selectedCategories.includes('driver')
        ? '👨‍✈️'
        : selectedCategories.includes('conductor')
        ? '🎫'
        : '🔧',
      roles: [...selectedCategories],
      driverDetails: selectedCategories.includes('driver')
        ? { licenseNo: 'B-DL-' + employeeId.trim().toUpperCase(), experienceYears: 5 }
        : null,
      conductorDetails: selectedCategories.includes('conductor')
        ? { badgeNo: 'COND-' + employeeId.trim().toUpperCase(), depot: 'Colombo Central Fleet' }
        : null,
      mechanicDetails: selectedCategories.includes('mechanic')
        ? { specialization: 'Heavy Coach Mechanical & Electrical', workshop: 'Central Workshop' }
        : null,
    };

    Alert.alert(
      'Account Created',
      `Welcome ${newStaffUser.name}! Your account has been registered with ${selectedCategories.length} duty categories.`,
      [{ text: 'Continue to Portal', onPress: () => onRegisterSuccess(newStaffUser) }]
    );
  };

  const categories = [
    { id: 'driver', title: 'Driver', icon: '🚌' },
    { id: 'conductor', title: 'Conductor', icon: '🎫' },
    { id: 'mechanic', title: 'Mechanic', icon: '🔧' },
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Brand Header */}
      <View style={styles.brandHeader}>
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

      {/* Title */}
      <View style={styles.titleSection}>
        <Text style={styles.titleMain}>Create Account</Text>
        <Text style={styles.titleSub}>Sign up with staff credentials</Text>
      </View>

      {/* Error Banner */}
      {errorMsg ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      {/* Form Fields */}
      <View style={styles.formContainer}>
        {/* First & Last Name Row */}
        <View style={styles.row}>
          <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
            <TextInput
              style={styles.inputField}
              placeholder="First Name"
              placeholderTextColor="#94a3b8"
              value={firstName}
              onChangeText={(text) => {
                setFirstName(text);
                if (errorMsg) setErrorMsg('');
              }}
            />
          </View>
          <View style={[styles.inputWrapper, { flex: 1 }]}>
            <TextInput
              style={styles.inputField}
              placeholder="Last Name"
              placeholderTextColor="#94a3b8"
              value={lastName}
              onChangeText={(text) => {
                setLastName(text);
                if (errorMsg) setErrorMsg('');
              }}
            />
          </View>
        </View>

        {/* Email Address */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputField}
            placeholder="Email Address"
            placeholderTextColor="#94a3b8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errorMsg) setErrorMsg('');
            }}
          />
        </View>

        {/* Mobile Phone Number */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputField}
            placeholder="Phone Number (e.g. +94 7X XXX XXXX)"
            placeholderTextColor="#94a3b8"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (errorMsg) setErrorMsg('');
            }}
          />
        </View>

        {/* Employee ID */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputField}
            placeholder="Employee ID (e.g. PNG-EMP-108)"
            placeholderTextColor="#94a3b8"
            autoCapitalize="characters"
            value={employeeId}
            onChangeText={(text) => {
              setEmployeeId(text);
              if (errorMsg) setErrorMsg('');
            }}
          />
        </View>

        {/* Password */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.inputField, { paddingRight: 48 }]}
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
            <Feather
              name={showPassword ? 'eye' : 'eye-off'}
              size={20}
              color={showPassword ? '#006FD8' : '#94a3b8'}
            />
          </TouchableOpacity>
        </View>

        {/* Staff Category Multi-Select */}
        <View style={styles.categorySection}>
          <Text style={styles.categoryLabel}>STAFF CATEGORY (SELECT ONE OR MORE)</Text>
          <View style={styles.categoryRow}>
            {categories.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.catPill,
                    isSelected && styles.catPillSelected,
                  ]}
                  onPress={() => toggleCategory(cat.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.catIcon}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.catTitle,
                      isSelected && styles.catTitleSelected,
                    ]}
                  >
                    {cat.title}
                  </Text>
                  {isSelected && <Text style={styles.catCheck}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Submit Register Button */}
        <TouchableOpacity
          style={styles.btnRegister}
          onPress={handleRegister}
          activeOpacity={0.85}
        >
          <Text style={styles.btnRegisterText}>Register</Text>
        </TouchableOpacity>
      </View>

      {/* Footer to Login */}
      <View style={styles.footerSection}>
        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text style={styles.loginLink} onPress={onBackToLogin}>
            Sign In
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
    paddingTop: 40,
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
    marginBottom: 20,
  },
  busIconContainer: {
    width: '100%',
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  busImage: {
    width: 135,
    height: 85,
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

  // Title Section
  titleSection: {
    marginBottom: 18,
  },
  titleMain: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  titleSub: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 3,
  },

  // Error Banner
  errorBanner: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
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
  row: {
    flexDirection: 'row',
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 13,
  },
  inputField: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#0f172a',
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    top: 15,
    padding: 2,
  },

  // Category Selector
  categorySection: {
    marginTop: 4,
    marginBottom: 20,
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  catPill: {
    flex: 1,
    height: 44,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 4,
  },
  catPillSelected: {
    backgroundColor: '#006FD8',
    borderColor: '#006FD8',
  },
  catIcon: {
    fontSize: 14,
  },
  catTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  catTitleSelected: {
    color: '#FFFFFF',
  },
  catCheck: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '900',
  },

  // Register Button
  btnRegister: {
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
  btnRegisterText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Footer
  footerSection: {
    alignItems: 'center',
    marginTop: 24,
    paddingBottom: 8,
  },
  footerText: {
    fontSize: 13,
    color: '#475569',
  },
  loginLink: {
    color: '#006FD8',
    fontWeight: '800',
  },
});

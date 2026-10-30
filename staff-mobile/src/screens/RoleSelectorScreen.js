import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from 'react-native';

export default function RoleSelectorScreen({ user, onSelectRole, onCancel }) {
  const userRoles = user?.roles || ['driver', 'conductor'];

  // Clean name format ensuring "Hello, Mr <Name>!"
  const rawName = user?.name || 'Sunil Rathnayaka';
  const cleanName = rawName.replace(/^Mr\.?\s*/i, '');
  const greeting = `Hello, Mr ${cleanName}!`;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Two Crossing Circles Header (Driver & Conductor Avatars) */}
      <View style={styles.crossingCirclesContainer}>
        {/* Circle 1: Driver Avatar */}
        <View style={styles.circleWrapper}>
          <Image
            source={require('../../assets/avatar-driver.jpg')}
            style={styles.circleImage}
            resizeMode="cover"
          />
        </View>

        {/* Circle 2: Conductor Avatar (Crossing / Overlapping) */}
        <View style={[styles.circleWrapper, styles.circleOverlap]}>
          <Image
            source={require('../../assets/avatar-conductor.png')}
            style={styles.circleImage}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Employee ID Badge */}
      <View style={styles.empBadge}>
        <Text style={styles.empBadgeText}>{user?.employeeId || 'PNG-EMP-101'}</Text>
      </View>

      {/* Greeting Title */}
      <Text style={styles.greetingTitle}>{greeting}</Text>

      {/* Prompt Question */}
      <Text style={styles.questionTitle}>
        Who are you logging in as right now?
      </Text>

      {/* Linear Role Selection Cards */}
      <View style={styles.linearRoleList}>
        {/* As a Driver (Image 4: Coach Cockpit) */}
        {userRoles.includes('driver') && (
          <TouchableOpacity
            style={[styles.roleCard, styles.driverCard]}
            onPress={() => onSelectRole('driver')}
            activeOpacity={0.85}
          >
            {/* Small Image (Image 4: Mercedes Coach Cockpit) */}
            <View style={styles.thumbBox}>
              <Image
                source={require('../../assets/thumb-driver-cockpit.jpg')}
                style={styles.thumbImage}
                resizeMode="cover"
              />
            </View>

            <View style={styles.cardContent}>
              <Text style={[styles.actionTag, { color: '#006FD8' }]}>START SHIFT</Text>
              <Text style={styles.cardMainTitle}>As a Driver</Text>
            </View>

            <View style={[styles.arrowBox, { backgroundColor: '#eff6ff' }]}>
              <Text style={[styles.arrowText, { color: '#006FD8' }]}>➔</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* As a Conductor (Image 5: Digital Validator) */}
        {userRoles.includes('conductor') && (
          <TouchableOpacity
            style={[styles.roleCard, styles.conductorCard]}
            onPress={() => onSelectRole('conductor')}
            activeOpacity={0.85}
          >
            {/* Small Image (Image 5: Digital QR Validator & Ticket Scanner) */}
            <View style={[styles.thumbBox, { backgroundColor: '#f0fdf4' }]}>
              <Image
                source={require('../../assets/thumb-conductor-validator.png')}
                style={styles.thumbImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.cardContent}>
              <Text style={[styles.actionTag, { color: '#10b981' }]}>START SHIFT</Text>
              <Text style={styles.cardMainTitle}>As a Conductor</Text>
            </View>

            <View style={[styles.arrowBox, { backgroundColor: '#ecfdf5' }]}>
              <Text style={[styles.arrowText, { color: '#10b981' }]}>➔</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* As a Mechanic (for mechanic registered staff) */}
        {userRoles.includes('mechanic') && (
          <TouchableOpacity
            style={[styles.roleCard, styles.mechanicCard]}
            onPress={() => onSelectRole('mechanic')}
            activeOpacity={0.85}
          >
            <View style={[styles.thumbBox, { backgroundColor: '#fffbeb' }]}>
              <Text style={styles.mechanicEmoji}>🔧</Text>
            </View>

            <View style={styles.cardContent}>
              <Text style={[styles.actionTag, { color: '#f59e0b' }]}>START SHIFT</Text>
              <Text style={styles.cardMainTitle}>As a Mechanic</Text>
            </View>

            <View style={[styles.arrowBox, { backgroundColor: '#fffbeb' }]}>
              <Text style={[styles.arrowText, { color: '#f59e0b' }]}>➔</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Optional Cancel / Keep Current Role */}
      {onCancel ? (
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelBtnText}>Keep Current Role</Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 36,
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? {
          maxWidth: 500,
          width: '100%',
          alignSelf: 'center',
          minHeight: '100vh',
        }
      : {}),
  },

  // Crossing Circles (Driver + Conductor)
  crossingCirclesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  circleWrapper: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFFFFF',
    borderWidth: 3.5,
    borderColor: '#006FD8',
    shadowColor: '#006FD8',
    shadowOpacity: 0.28,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  circleOverlap: {
    marginLeft: -18, // Creates the crossing circles effect
  },
  circleImage: {
    width: '100%',
    height: '100%',
  },

  // Employee Badge
  empBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 10,
  },
  empBadgeText: {
    color: '#006FD8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Typography
  greetingTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#006FD8',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 22,
  },

  // Linear Role Cards
  linearRoleList: {
    width: '100%',
    gap: 14,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  driverCard: {
    borderColor: '#bfdbfe',
    backgroundColor: '#f8fbff',
  },
  conductorCard: {
    borderColor: '#a7f3d0',
    backgroundColor: '#f6fdf9',
  },
  mechanicCard: {
    borderColor: '#fde68a',
    backgroundColor: '#fffdf7',
  },

  // Small Thumbnail Image (Images 4 & 5)
  thumbBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  mechanicEmoji: {
    fontSize: 26,
  },

  // Card Content
  cardContent: {
    flex: 1,
    marginLeft: 14,
  },
  actionTag: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  cardMainTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },

  // Right Arrow Icon
  arrowBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  arrowText: {
    fontSize: 15,
    fontWeight: '900',
  },

  cancelBtn: {
    marginTop: 22,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
  },
  cancelBtnText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
});

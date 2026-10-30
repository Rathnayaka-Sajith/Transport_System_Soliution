import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ROLE_DEFINITIONS } from '../data/mockDatabase';

export default function RoleSelectorScreen({ user, onSelectRole, onCancel }) {
  const userRoles = user?.roles || ['driver'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarEmoji}>{user?.avatar || '👨‍✈️'}</Text>
      </View>

      <View style={styles.empBadge}>
        <Text style={styles.empBadgeText}>{user?.employeeId || 'PNG-STAFF'}</Text>
      </View>

      <Text style={styles.title}>Hello, {user?.name || 'Staff Member'}!</Text>
      <Text style={styles.question}>
        Who are you logging in as right now?
      </Text>
      <Text style={styles.hint}>
        You are registered for {userRoles.length} duty categories. Select your active role for this work shift:
      </Text>

      <View style={styles.roleList}>
        {userRoles.map((roleId) => {
          const roleMeta = ROLE_DEFINITIONS.find((r) => r.id === roleId) || {
            id: roleId,
            title: roleId.toUpperCase(),
            icon: '💼',
            color: '#046bd2',
            bgColor: '#eff6ff',
            badge: 'Operations',
            description: 'Start shift in this role',
          };

          return (
            <TouchableOpacity
              key={roleId}
              style={[styles.roleCard, { borderColor: roleMeta.color, backgroundColor: roleMeta.bgColor }]}
              onPress={() => onSelectRole(roleId)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconBox, { backgroundColor: roleMeta.color }]}>
                <Text style={styles.iconEmoji}>{roleMeta.icon}</Text>
              </View>

              <View style={styles.cardContent}>
                <Text style={[styles.actionTag, { color: roleMeta.color }]}>START SHIFT AS</Text>
                <Text style={styles.cardTitle}>{roleMeta.title}</Text>
                <Text style={styles.cardDesc}>{roleMeta.description}</Text>
              </View>

              <Text style={[styles.arrowIcon, { color: roleMeta.color }]}>➔</Text>
            </TouchableOpacity>
          );
        })}
      </View>

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
    padding: 24,
    backgroundColor: '#ffffff',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#cbd5e1',
  },
  avatarEmoji: {
    fontSize: 36,
  },
  empBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 10,
  },
  empBadgeText: {
    color: '#046bd2',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  question: {
    fontSize: 18,
    fontWeight: '800',
    color: '#046bd2',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 6,
  },
  hint: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 320,
    lineHeight: 16,
  },
  roleList: {
    width: '100%',
    gap: 12,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 26,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  actionTag: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 1,
  },
  cardDesc: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
    lineHeight: 14,
  },
  arrowIcon: {
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 8,
  },
  cancelBtn: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  cancelBtnText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
});

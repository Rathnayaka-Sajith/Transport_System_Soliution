import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function StaffHeader({ user, activeRole, onSwitchRole, onLogout }) {
  const getRoleIcon = (role) => {
    switch (role) {
      case 'driver': return '🚌';
      case 'conductor': return '🎫';
      case 'mechanic': return '🔧';
      default: return '🚍';
    }
  };

  const getRoleTitle = (role) => {
    switch (role) {
      case 'driver': return 'Driver';
      case 'conductor': return 'Conductor';
      case 'mechanic': return 'Mechanic';
      default: return 'Staff';
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftCol}>
        <Text style={styles.brandTitle}>🚍 PNG EXPRESS</Text>
        <Text style={styles.staffName}>{user?.name || 'Staff Member'}</Text>
        <Text style={styles.staffId}>{user?.employeeId || 'PNG-STAFF'}</Text>
      </View>

      <View style={styles.rightCol}>
        {/* If user has multiple roles, allow switching shift duty anytime */}
        {user?.roles?.length > 1 && (
          <TouchableOpacity style={styles.roleSwitcherBtn} onPress={onSwitchRole}>
            <Text style={styles.roleSwitcherIcon}>{getRoleIcon(activeRole)}</Text>
            <View>
              <Text style={styles.roleSwitcherLabel}>ACTIVE DUTY</Text>
              <Text style={styles.roleSwitcherRole}>{getRoleTitle(activeRole)} ⇄</Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0f172a',
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  leftCol: {
    flex: 1,
  },
  brandTitle: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  staffName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  staffId: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleSwitcherBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#0284c7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  roleSwitcherIcon: {
    fontSize: 16,
  },
  roleSwitcherLabel: {
    color: '#38bdf8',
    fontSize: 8,
    fontWeight: '800',
  },
  roleSwitcherRole: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  logoutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '700',
  },
});

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';

export default function StaffHeader({ user, activeRole, onSwitchRole, onLogout }) {
  const [showIdModal, setShowIdModal] = useState(false);

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
    <>
      <View style={styles.header}>
        {/* Left: Tap to view digital ID card */}
        <TouchableOpacity
          style={styles.leftCol}
          onPress={() => setShowIdModal(true)}
          activeOpacity={0.8}
        >
          <View style={styles.avatarRow}>
            <Text style={styles.staffAvatar}>{user?.avatar || '👨‍✈️'}</Text>
            <View>
              <Text style={styles.staffName}>{user?.name || 'Staff Member'}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Right: Role Switcher & Logout */}
        <View style={styles.rightCol}>
          {user?.roles?.length > 1 && (
            <TouchableOpacity
              style={styles.roleSwitcherBtn}
              onPress={onSwitchRole}
              activeOpacity={0.8}
            >
              <Text style={styles.roleSwitcherIcon}>{getRoleIcon(activeRole)}</Text>
              <View>
                <Text style={styles.roleSwitcherLabel}>ACTIVE DUTY</Text>
                <Text style={styles.roleSwitcherRole}>{getRoleTitle(activeRole)} ⇄</Text>
              </View>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={onLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Digital Employee ID Card Modal */}
      <Modal
        visible={showIdModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowIdModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.idCardBox}>
            <View style={styles.idCardHeader}>
              <Text style={styles.idCardHeaderSub}>SRI LANKA NATIONAL EXPRESS LOGISTICS</Text>
              <Text style={styles.idCardHeaderTitle}>PNG EXPRESS STAFF CREDENTIAL</Text>
            </View>

            <View style={styles.idCardBody}>
              <View style={styles.idAvatarLargeBox}>
                <Text style={styles.idAvatarLarge}>{user?.avatar || '👨‍✈️'}</Text>
              </View>

              <Text style={styles.idStaffFullName}>{user?.name || 'Staff Member'}</Text>
              <Text style={styles.idStaffEmpId}>EMP ID: {user?.employeeId || 'PNG-STAFF-100'}</Text>
              <Text style={styles.idStaffNic}>NIC: {user?.nic || '198539201948'}</Text>

              {/* Roles Badges */}
              <View style={styles.idRolesRow}>
                {user?.roles?.map((r) => (
                  <View key={r} style={[styles.idRoleBadge, r === activeRole && styles.idRoleBadgeActive]}>
                    <Text style={styles.idRoleBadgeText}>
                      {getRoleIcon(r)} {r.toUpperCase()}
                      {r === activeRole ? ' (ON DUTY)' : ''}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Specific Licenses Info */}
              <View style={styles.idDetailsList}>
                {user?.driverDetails && (
                  <View style={styles.idDetailItem}>
                    <Text style={styles.idDetailLabel}>DRIVING LICENSE</Text>
                    <Text style={styles.idDetailValue}>
                      {user.driverDetails.licenseNo} (Exp: {user.driverDetails.licenseExpiry})
                    </Text>
                  </View>
                )}

                {user?.conductorDetails && (
                  <View style={styles.idDetailItem}>
                    <Text style={styles.idDetailLabel}>CONDUCTOR BADGE</Text>
                    <Text style={styles.idDetailValue}>
                      {user.conductorDetails.badgeNo} • {user.conductorDetails.depot}
                    </Text>
                  </View>
                )}

                {user?.mechanicDetails && (
                  <View style={styles.idDetailItem}>
                    <Text style={styles.idDetailLabel}>MECHANIC CERTIFICATION</Text>
                    <Text style={styles.idDetailValue}>
                      {user.mechanicDetails.specialization}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.idSecurityFooter}>
                <Text style={styles.idSecurityText}>🔒 Tamper-Proof Cryptographic NFC Staff Token</Text>
                <Text style={styles.idHotlineText}>Fleet Control Hotline: +94 11 234 5678</Text>
              </View>

              <TouchableOpacity
                style={styles.idCloseBtn}
                onPress={() => setShowIdModal(false)}
              >
                <Text style={styles.idCloseBtnText}>Close ID Credential</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  leftCol: {
    flex: 1,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  staffAvatar: {
    fontSize: 28,
  },
  staffName: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleSwitcherBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 8,
    gap: 6,
  },
  roleSwitcherIcon: {
    fontSize: 15,
  },
  roleSwitcherLabel: {
    color: '#006FD8',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  roleSwitcherRole: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '800',
  },
  logoutBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 8,
  },
  logoutText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
  },

  // Modal ID Card Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  idCardBox: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8,
  },
  idCardHeader: {
    backgroundColor: '#006FD8',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#005BB5',
  },
  idCardHeaderSub: {
    color: '#BFDBFE',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },
  idCardHeaderTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  idCardBody: {
    padding: 20,
    alignItems: 'center',
  },
  idAvatarLargeBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#006FD8',
    marginBottom: 8,
  },
  idAvatarLarge: {
    fontSize: 40,
  },
  idStaffFullName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  idStaffEmpId: {
    fontSize: 12,
    fontWeight: '700',
    color: '#006FD8',
    marginTop: 2,
  },
  idStaffNic: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  idRolesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 14,
  },
  idRoleBadge: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  idRoleBadgeActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#006FD8',
  },
  idRoleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0f172a',
  },
  idDetailsList: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  idDetailItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7',
    paddingBottom: 6,
  },
  idDetailLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  idDetailValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 1,
  },
  idSecurityFooter: {
    marginTop: 14,
    alignItems: 'center',
  },
  idSecurityText: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '700',
  },
  idHotlineText: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  idCloseBtn: {
    marginTop: 16,
    width: '100%',
    backgroundColor: '#006FD8',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  idCloseBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});

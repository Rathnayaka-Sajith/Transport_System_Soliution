import React, { useState, useEffect } from 'react';
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
  const [shiftSeconds, setShiftSeconds] = useState(9940); // Initialized to ~2h 45m for realism

  useEffect(() => {
    const timer = setInterval(() => {
      setShiftSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatShiftTime = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

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
              <Text style={styles.brandTitle}>🚍 PNG EXPRESS • ID CARD 🪪</Text>
              <Text style={styles.staffName}>{user?.name || 'Staff Member'}</Text>
              <View style={styles.shiftPill}>
                <View style={styles.greenPulse} />
                <Text style={styles.shiftTime}>Duty: {formatShiftTime(shiftSeconds)}</Text>
              </View>
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
    backgroundColor: '#0f172a',
    paddingVertical: 12,
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
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  staffAvatar: {
    fontSize: 28,
  },
  brandTitle: {
    color: '#38bdf8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  staffName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 1,
  },
  shiftPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  greenPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  shiftTime: {
    color: '#94a3b8',
    fontSize: 10,
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
    letterSpacing: 0.5,
  },
  roleSwitcherRole: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  logoutBtn: {
    backgroundColor: '#334155',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  logoutText: {
    color: '#e2e8f0',
    fontSize: 11,
    fontWeight: '700',
  },

  // Modal ID Card Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
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
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8,
  },
  idCardHeader: {
    backgroundColor: '#0b1329',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#046bd2',
  },
  idCardHeaderSub: {
    color: '#38bdf8',
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
    borderColor: '#046bd2',
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
    color: '#046bd2',
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
    borderColor: '#046bd2',
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
    backgroundColor: '#046bd2',
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

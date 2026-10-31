import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function StaffHeader({ user, activeRole, onSwitchRole, onLogout }) {
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);

  const cleanName = (user?.name || 'Sunil Rathnayaka').replace(/^Mr\.?\s*/i, '');
  const roleTitle = activeRole ? activeRole.charAt(0).toUpperCase() + activeRole.slice(1) : 'Staff';

  const handleOpenNotifications = () => {
    setShowNotificationModal(true);
    setHasUnreadNotification(false);
  };

  return (
    <>
      <View style={styles.header}>
        {/* Left: Account Icon Button */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setShowAccountModal(true)}
          activeOpacity={0.7}
          accessibilityLabel="Account Options"
        >
          <View style={styles.avatarCircle}>
            <Feather name="user" size={19} color="#006FD8" />
          </View>
        </TouchableOpacity>

        {/* Center: PNG Express Minimal Header */}
        <View style={styles.centerCol}>
          <Text style={styles.centerBrand}>PNG Express</Text>
        </View>

        {/* Right: Notification Mark Icon */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={handleOpenNotifications}
          activeOpacity={0.7}
          accessibilityLabel="Notifications"
        >
          <View style={styles.bellWrapper}>
            <Feather name="bell" size={21} color="#0F172A" />
            {hasUnreadNotification && <View style={styles.unreadDot} />}
          </View>
        </TouchableOpacity>
      </View>

      {/* Account Profile Modal */}
      <Modal
        visible={showAccountModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAccountModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAccountModal(false)}
        >
          <TouchableOpacity
            style={styles.modalCard}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeaderTitle}>Account Profile</Text>
              <TouchableOpacity
                onPress={() => setShowAccountModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* User Info */}
            <View style={styles.userProfileSection}>
              <View style={styles.largeAvatarCircle}>
                <Feather name="user" size={32} color="#006FD8" />
              </View>
              <Text style={styles.userNameText}>Mr. {cleanName}</Text>
              <Text style={styles.userEmpIdText}>
                ID: {user?.employeeId || 'PNG-EMP-101'}
              </Text>
              <View style={styles.activeRolePill}>
                <Text style={styles.activeRolePillText}>Current Duty: {roleTitle}</Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionList}>
              {/* Option: Switch Role (if multirole) */}
              {user?.roles?.length > 1 && (
                <TouchableOpacity
                  style={styles.switchRoleBtn}
                  onPress={() => {
                    setShowAccountModal(false);
                    if (onSwitchRole) onSwitchRole();
                  }}
                  activeOpacity={0.8}
                >
                  <Feather name="refresh-cw" size={17} color="#006FD8" />
                  <Text style={styles.switchRoleBtnText}>Switch Duty Role</Text>
                  <Feather name="chevron-right" size={16} color="#94A3B8" style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>
              )}

              {/* Option: Logout */}
              <TouchableOpacity
                style={styles.logoutBtn}
                onPress={() => {
                  setShowAccountModal(false);
                  if (onLogout) onLogout();
                }}
                activeOpacity={0.8}
              >
                <Feather name="log-out" size={17} color="#EF4444" />
                <Text style={styles.logoutBtnText}>Log Out</Text>
                <Feather name="chevron-right" size={16} color="#EF4444" style={{ marginLeft: 'auto' }} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Notification Modal */}
      <Modal
        visible={showNotificationModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNotificationModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowNotificationModal(false)}
        >
          <TouchableOpacity
            style={styles.modalCard}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Feather name="bell" size={18} color="#006FD8" />
                <Text style={styles.modalHeaderTitle}>Notifications</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowNotificationModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Notification List */}
            <View style={styles.notificationItem}>
              <View style={styles.notifBadgeRow}>
                <View style={styles.notifAlertPill}>
                  <Text style={styles.notifAlertText}>15 MINS PRIOR ALERT</Text>
                </View>
                <Text style={styles.notifTimeAgo}>Just now</Text>
              </View>

              <Text style={styles.notifTitleText}>You have trip at 09:30 PM</Text>
              <Text style={styles.notifBodyText}>
                Route 87: Colombo Central ➔ Jaffna Town. Coach NB-4592 is scheduled for boarding in 15 minutes.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeNotifBtn}
              onPress={() => setShowNotificationModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.closeNotifBtnText}>Close</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconBtn: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerCol: {
    alignItems: 'center',
  },
  centerBrand: {
    fontSize: 15,
    fontWeight: '800',
    color: '#006FD8',
  },
  bellWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 8,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },

  // User Profile in Modal
  userProfileSection: {
    alignItems: 'center',
    paddingVertical: 18,
  },
  largeAvatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EFF6FF',
    borderWidth: 2.5,
    borderColor: '#006FD8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  userNameText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  userEmpIdText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
  },
  activeRolePill: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  activeRolePillText: {
    color: '#006FD8',
    fontSize: 11,
    fontWeight: '800',
  },

  // Action Buttons in Modal
  actionList: {
    gap: 10,
    marginTop: 8,
  },
  switchRoleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 10,
  },
  switchRoleBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#006FD8',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 10,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
  },

  // Notification Modal Styles
  notificationItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  notifBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  notifAlertPill: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  notifAlertText: {
    color: '#006FD8',
    fontSize: 10,
    fontWeight: '800',
  },
  notifTimeAgo: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  notifTitleText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  notifBodyText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  closeNotifBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  closeNotifBtnText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
});

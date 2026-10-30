import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { MOCK_JOB_CARDS } from '../data/mockDatabase';

export default function MechanicDashboardScreen({ user }) {
  const [jobCards, setJobCards] = useState(MOCK_JOB_CARDS);

  const toggleTask = (jobId, taskIndex) => {
    setJobCards((prev) =>
      prev.map((card) => {
        if (card.jobId === jobId) {
          const updatedTasks = [...card.tasks];
          updatedTasks[taskIndex] = {
            ...updatedTasks[taskIndex],
            done: !updatedTasks[taskIndex].done,
          };
          return { ...card, tasks: updatedTasks };
        }
        return card;
      })
    );
  };

  const handleCertifyRoadworthy = (jobId, busPlate) => {
    setJobCards((prev) =>
      prev.map((card) =>
        card.jobId === jobId ? { ...card, status: 'COMPLETED' } : card
      )
    );
    Alert.alert(
      '✓ Safety Certification Issued',
      `Bus ${busPlate} (Job #${jobId}) has been successfully certified as roadworthy by mechanic ${user?.name || 'Staff'}. Central fleet dispatch notified to re-enter coach into route schedules.`
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerBadge}>
          <Text style={styles.bannerBadgeText}>FLEET ENGINEERING &amp; RESCUE</Text>
        </View>
        <Text style={styles.bannerTitle}>Workshop Operations</Text>
        <Text style={styles.bannerSub}>
          Lead Mechanic: {user?.name || 'Staff'} • Central Workshop
        </Text>
      </View>

      {/* Fleet Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={[styles.statVal, { color: '#046bd2' }]}>138</Text>
          <Text style={styles.statLabel}>Active Fleet</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statVal, { color: '#f59e0b' }]}>4</Text>
          <Text style={styles.statLabel}>In Service Bay</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statVal, { color: '#10b981' }]}>100%</Text>
          <Text style={styles.statLabel}>Safety Score</Text>
        </View>
      </View>

      {/* Active Job Cards */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🔧 Fleet Job Cards &amp; Roadside Calls</Text>
      </View>

      {jobCards.map((job) => {
        const allTasksDone = job.tasks.every((t) => t.done);
        const isCompleted = job.status === 'COMPLETED';

        return (
          <View
            key={job.jobId}
            style={[styles.jobCard, isCompleted && styles.jobCardCompleted]}
          >
            <View style={styles.jobTopRow}>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={styles.jobBadge}>
                    <Text style={styles.jobBadgeText}>{job.jobId}</Text>
                  </View>
                  <Text style={styles.busPlate}>{job.busPlate}</Text>
                </View>
                <Text style={styles.busModel}>{job.busModel}</Text>
              </View>

              <View
                style={[
                  styles.priorityPill,
                  job.priority === 'HIGH' && { backgroundColor: '#fee2e2' },
                  isCompleted && { backgroundColor: '#ecfdf5' },
                ]}
              >
                <Text
                  style={[
                    styles.priorityText,
                    job.priority === 'HIGH' && { color: '#dc2626' },
                    isCompleted && { color: '#059669' },
                  ]}
                >
                  {isCompleted ? 'CERTIFIED' : job.priority + ' PRIORITY'}
                </Text>
              </View>
            </View>

            <View style={styles.issueBox}>
              <Text style={styles.issueText}>⚠️ Reported Issue: {job.issue}</Text>
              <Text style={styles.reportedText}>Reporter: {job.reportedBy}</Text>
            </View>

            {/* Checklist */}
            <View style={styles.checklistContainer}>
              <Text style={styles.checkTitle}>MECHANICAL TASKS:</Text>
              {job.tasks.map((task, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.taskRow}
                  onPress={() => toggleTask(job.jobId, idx)}
                  disabled={isCompleted}
                >
                  <Text style={styles.checkIcon}>{task.done ? '☑️' : '◻️'}</Text>
                  <Text style={[styles.taskText, task.done && styles.taskTextDone]}>
                    {task.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {!isCompleted ? (
              <TouchableOpacity
                style={[styles.btnCertify, !allTasksDone && styles.btnCertifyDisabled]}
                onPress={() => handleCertifyRoadworthy(job.jobId, job.busPlate)}
              >
                <Text style={styles.btnCertifyText}>
                  ✓ Sign Off &amp; Certify Bus as Roadworthy
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.completedTag}>
                <Text style={styles.completedTagText}>✓ Bus Certified Roadworthy &amp; Dispatched</Text>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8fafc',
    flexGrow: 1,
  },
  banner: {
    backgroundColor: '#d97706',
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
  },
  bannerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  bannerBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  bannerSub: {
    color: '#fef3c7',
    fontSize: 12,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  jobCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  jobCardCompleted: {
    borderColor: '#bbf7d0',
    backgroundColor: '#f0fdf4',
  },
  jobTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  jobBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
  },
  busPlate: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  busModel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  priorityPill: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#b45309',
  },
  issueBox: {
    backgroundColor: '#fffbeb',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  issueText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400e',
  },
  reportedText: {
    fontSize: 10,
    color: '#b45309',
    marginTop: 2,
  },
  checklistContainer: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  checkTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748b',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  checkIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  taskText: {
    fontSize: 12,
    color: '#334155',
    flex: 1,
  },
  taskTextDone: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  btnCertify: {
    backgroundColor: '#10b981',
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnCertifyDisabled: {
    opacity: 0.6,
  },
  btnCertifyText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  completedTag: {
    backgroundColor: '#ecfdf5',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  completedTagText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '800',
  },
});

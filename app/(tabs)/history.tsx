import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTimers } from '@/context/TimerContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HistoryScreen() {
  const { history, clearHistory } = useTimers();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Format date
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderHistoryItem = ({ item }: { item: typeof history[0] }) => (
    <ThemedView style={styles.historyItem}>
      <View style={styles.historyItemHeader}>
        <ThemedText type="defaultSemiBold">{item.timerName}</ThemedText>
        <ThemedText style={styles.category}>{item.category}</ThemedText>
      </View>
      <View style={styles.historyItemDetails}>
        <ThemedText style={styles.time}>Duration: {formatTime(item.duration)}</ThemedText>
        <ThemedText style={styles.date}>Completed: {formatDate(item.completedAt)}</ThemedText>
      </View>
    </ThemedView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Timer History</ThemedText>
        {history.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
            <ThemedText style={styles.clearButtonText}>Clear</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>

      {history.length > 0 ? (
        <FlatList
          data={history.sort((a, b) => b.completedAt - a.completedAt)}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <ThemedView style={styles.emptyState}>
          <Ionicons name="list-outline" size={64} color={colors.icon} />
          <ThemedText style={styles.emptyStateText}>
            No timer history yet. Complete a timer to see it here!
          </ThemedText>
        </ThemedView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: '#0a7ea4',
  },
  listContent: {
    padding: 16,
  },
  historyItem: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    opacity: 0.7,
  },
  historyItemDetails: {
    marginTop: 4,
  },
  time: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    opacity: 0.7,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    marginTop: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});
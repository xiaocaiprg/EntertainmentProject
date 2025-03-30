import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface GameActionsProps {
  onEndRound: () => void;
}

export const GameActions: React.FC<GameActionsProps> = React.memo((props) => {
  const { onEndRound } = props;

  const handleEndRound = useCallback(() => {
    onEndRound();
  }, [onEndRound]);

  return (
    <View style={styles.actionsContainer}>
      {/* 结束本场按钮 */}
      <TouchableOpacity style={styles.actionButton} onPress={handleEndRound}>
        <Text style={styles.actionButtonText}>结束本场</Text>
      </TouchableOpacity>
      {/* 这里可以添加更多的操作按钮 */}
    </View>
  );
});

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#ff6b6b',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    margin: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

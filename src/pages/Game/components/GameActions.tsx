import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface GameActionsProps {
  onEndRound: () => void;
  onDeleteLastInning: () => void;
}

export const GameActions: React.FC<GameActionsProps> = React.memo((props) => {
  const { onEndRound, onDeleteLastInning } = props;

  const handleEndRound = useCallback(() => {
    onEndRound();
  }, [onEndRound]);

  const handleDeleteLastInning = useCallback(() => {
    onDeleteLastInning();
  }, [onDeleteLastInning]);

  return (
    <View style={styles.actionsContainer}>
      {/* 删除上一局按钮 */}
      <TouchableOpacity style={styles.actionButton} onPress={handleDeleteLastInning}>
        <Text style={styles.actionButtonText}>删除上一把</Text>
      </TouchableOpacity>
      {/* 结束本场按钮 */}
      <TouchableOpacity style={[styles.actionButton, styles.endRoundButton]} onPress={handleEndRound}>
        <Text style={styles.actionButtonText}>结束本场</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#EB1D04',
    paddingVertical: 12,
    marginRight: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  endRoundButton: {
    marginRight: 0,
    backgroundColor: '#EB5A01',
  },
});

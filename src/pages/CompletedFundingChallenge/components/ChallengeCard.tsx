import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { GameMatchDto } from '../../../interface/Game';
import { THEME_COLORS } from '../../../utils/styles';

interface ChallengeCardProps {
  item: GameMatchDto;
  onEditPress: (challengeId: number | undefined) => void;
}

export const ChallengeCard = React.memo((props: ChallengeCardProps) => {
  const { item, onEditPress } = props;

  // 处理编辑按钮点击
  const handleEditPress = useCallback(() => {
    onEditPress(item.id);
  }, [item.id, onEditPress]);

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
          {item.name || '-'}
        </Text>
        <View style={styles.statusTag}>
          <Text style={styles.statusText}>募资完成</Text>
        </View>
      </View>
      <View style={styles.itemContent}>
        <View style={styles.itemLeft}>
          <View style={styles.itemRow}>
            <Text style={styles.label}>创建时间:</Text>
            <Text style={styles.value}>{item.createTime || '-'}</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.label}>挑战上下水:</Text>
            <Text style={styles.value}>{item.profitStr || '-'}</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.label}>挑战转码:</Text>
            <Text style={styles.value}>{item.turnOverStr || '-'}</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.label}>投手名字:</Text>
            <Text style={styles.value}>{item.playPersonName || '-'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={handleEditPress} activeOpacity={0.7}>
          <MaterialIcons name="edit" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
    backgroundColor: '#faad14' + '20',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#faad14',
  },
  itemContent: {
    flexDirection: 'row',
  },
  itemLeft: {
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: '#666',
    width: 80,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  editButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME_COLORS.primary,
    alignSelf: 'center',
  },
});

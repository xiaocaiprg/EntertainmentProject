import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { GameMatchSimpleDto } from '../../../interface/Ranking';
import { THEME_COLORS } from '../../../utils/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getStatusText } from '../../../public/Game';
import CustomText from '../../../components/CustomText';

interface ChallengeListProps {
  challenges: GameMatchSimpleDto[];
  onPressItem: (item: GameMatchSimpleDto) => void;
}

interface ChallengeItemProps {
  item: GameMatchSimpleDto;
  onPressItem: (item: GameMatchSimpleDto) => void;
}

const ChallengeItem: React.FC<ChallengeItemProps> = React.memo(({ item, index, onPressItem }) => {
  const statusInfo = getStatusText(item.isEnabled);

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={() => onPressItem(item)} activeOpacity={0.7}>
      <View style={styles.itemHeader}>
        <CustomText style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
          {item.name || '-'}
        </CustomText>
        {index < 3 && (
          <CustomText style={[styles.itemName, { color: '#F56301' }]} numberOfLines={1} ellipsizeMode="tail">
            No.{index + 1}
          </CustomText>
        )}
        <View style={[styles.statusTag, { backgroundColor: statusInfo.color + '20' }]}>
          <CustomText style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.text}</CustomText>
        </View>
      </View>
      <View style={styles.itemContentContainer}>
        <View style={styles.itemContent}>
          <View style={styles.itemInfoContainer}>
            <View style={styles.itemInfoRow}>
              <CustomText style={styles.label}>日期:</CustomText>
              <CustomText style={styles.value}>{item.gameDate || '-'}</CustomText>
            </View>
            <View style={styles.itemInfoRow}>
              <CustomText style={styles.label}>地点:</CustomText>
              <CustomText style={styles.value}>{item.addressName || '-'}</CustomText>
            </View>
            <View style={styles.itemInfoRow}>
              <CustomText style={styles.label}>玩法:</CustomText>
              <CustomText style={styles.value}>{item.playRuleName || '-'}</CustomText>
            </View>
            <View style={styles.itemInfoRow}>
              <CustomText style={styles.label}>币种:</CustomText>
              <CustomText style={styles.value}>{item.currency || '-'}</CustomText>
            </View>
          </View>
          <View style={styles.itemInfoContainer}>
            <View style={styles.itemInfoRow}>
              <CustomText style={styles.label}>投手:</CustomText>
              <CustomText style={styles.value}>{item.playPersonName || '-'}</CustomText>
            </View>
            <View style={styles.itemInfoRow}>
              <CustomText style={styles.label}>上下水:</CustomText>
              <CustomText style={styles.profitValue}>{item.profitStr}</CustomText>
            </View>
            <View style={styles.itemInfoRow}>
              <CustomText style={styles.label}>转码:</CustomText>
              <CustomText style={styles.profitValue}>{item.turnOverStr}</CustomText>
            </View>
          </View>
        </View>

        <Icon name="chevron-right" size={24} color={THEME_COLORS.text.light} />
      </View>
    </TouchableOpacity>
  );
});

export const ChallengeList: React.FC<ChallengeListProps> = React.memo((props) => {
  const { challenges, onPressItem } = props;

  if (!challenges || challenges.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <CustomText style={styles.emptyText}>暂无挑战信息</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.listContentContainer}>
      {challenges.map((challengeItem, index) => (
        <ChallengeItem key={String(challengeItem.id)} item={challengeItem} index={index} onPressItem={onPressItem} />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  listContentContainer: {
    paddingBottom: 5,
  },
  itemContainer: {
    backgroundColor: THEME_COLORS.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME_COLORS.border.light,
    padding: 10,
    marginBottom: 5,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
    flex: 1,
  },
  statusTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  itemContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContent: {
    flexDirection: 'row',
    flex: 1,
  },
  itemInfoContainer: {
    flexDirection: 'column',
    marginRight: 15,
  },
  itemInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  label: {
    fontSize: 13,
    color: THEME_COLORS.text.secondary,
    width: 60,
  },
  value: {
    fontSize: 13,
    color: THEME_COLORS.text.primary,
  },
  profitValue: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME_COLORS.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: THEME_COLORS.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME_COLORS.border.light,
  },
  emptyText: {
    fontSize: 14,
    color: THEME_COLORS.text.light,
  },
});

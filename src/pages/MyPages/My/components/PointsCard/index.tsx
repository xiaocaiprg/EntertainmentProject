import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CustomText from '../../../../../components/CustomText';
import { useTranslation } from '../../../../../hooks/useTranslation';
import { BusinessDto } from '../../../../../interface/Business';
interface PointsCardProps {
  user: BusinessDto;
  onPointsPress: (code?: string) => void;
}

export const PointsCard = React.memo((props: PointsCardProps) => {
  const { user, onPointsPress } = props;
  const { t } = useTranslation();

  // 积分项组件
  const PointsItem = useCallback(
    ({ value, label, onPress }: { value?: number | string; label: string; onPress?: () => void }) => (
      <TouchableOpacity style={styles.pointsItem} onPress={onPress}>
        <CustomText style={styles.pointsValue}>{value?.toLocaleString() || '-'}</CustomText>
        <CustomText style={styles.pointsLabel}>{label}</CustomText>
      </TouchableOpacity>
    ),
    [],
  );
  const onGameCoinsPress = useCallback(() => {
    Alert.alert('暂未开放,敬请期待');
  }, []);
  return (
    <View style={styles.pointsCardWrapper}>
      <PointsItem value={user.availablePoints} label={t('my.points')} onPress={() => onPointsPress()} />
      <PointsItem
        value={user?.creditAccount?.availablePoints}
        label={t('my.creditPoints')}
        onPress={() => onPointsPress(user?.creditAccount?.code)}
      />
      <PointsItem value={user?.creditAccount?.repayAmount} label={t('my.repayAmount')} />
      <PointsItem label={t('my.gameCoins')} onPress={onGameCoinsPress} />
    </View>
  );
});

const styles = StyleSheet.create({
  pointsCardWrapper: {
    marginHorizontal: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
  },
  pointsItem: {
    flex: 1,
    alignItems: 'center',
  },
  pointsValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  pointsLabel: {
    fontSize: 12,
    color: '#999',
  },
});

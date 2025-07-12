import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from '../../../../../hooks/useTranslation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomText from '../../../../../components/CustomText';

interface ActionAreaProps {
  navigation: any;
}
export const ActionArea = React.memo((props: ActionAreaProps) => {
  const { navigation } = props;
  const { t } = useTranslation();

  const handleTransferPress = useCallback(() => {
    navigation.navigate('PointsTransfer');
  }, [navigation]);

  const handleFrozenPointsPress = useCallback(() => {
    navigation.navigate('FrozenPoints');
  }, [navigation]);

  return (
    <View style={styles.ActionAreaWrapper}>
      <TouchableOpacity style={styles.ActionAreaItem} onPress={handleTransferPress}>
        <Icon name="sync-alt" size={24} color="#6c5ce7" />
        <CustomText style={styles.ActionAreaItemLabel}>{t('my.transfer')}</CustomText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.ActionAreaItem} onPress={handleFrozenPointsPress}>
        <Icon name="manage-search" size={24} color="#6c5ce7" />
        <CustomText style={styles.ActionAreaItemLabel}>{t('my.frozenPoints')}</CustomText>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  ActionAreaWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  ActionAreaItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  ActionAreaItemLabel: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
});

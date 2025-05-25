import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { UserResult } from '../../../../interface/User';
import { useTranslation } from '../../../../hooks/useTranslation';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomText from '../../../../components/CustomText';

interface MemberBenefitsProps {
  user: UserResult;
  navigation: any;
}

export const MemberBenefits = React.memo((props: MemberBenefitsProps) => {
  const { user, navigation } = props;
  const { t } = useTranslation();

  const handleProfitPress = useCallback(() => {
    navigation.navigate('MyProfit');
  }, [navigation]);

  return (
    <LinearGradient
      style={styles.background}
      colors={['#bcb0e8', '#e7e0ff', '#d4c6ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.membershipCardWrapper}>
        <View style={styles.leftSection}>
          <CustomText style={styles.membershipLabel}>普通会员</CustomText>
        </View>
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.profitContainer} onPress={handleProfitPress}>
            <View style={styles.profitContent}>
              <View style={styles.profitLabelContainer}>
                <Icon name="money" size={16} color="#6c5ce7" />
                <CustomText style={styles.profitLabel}>{t('my.profit')}</CustomText>
              </View>
              <CustomText style={styles.profitValue}>{user.profitStr}</CustomText>
            </View>
            <Icon name="chevron-right" size={12} color="#111" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
});

const styles = StyleSheet.create({
  background: {
    flexDirection: 'column',
    marginTop: -18,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 15,
  },
  membershipCardWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  leftSection: {},
  rightSection: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  profitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profitContent: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 5,
  },
  profitLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  membershipLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  profitLabel: {
    fontSize: 14,
    color: '#111',
    marginLeft: 4,
  },
  profitValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
});

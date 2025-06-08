import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { useRole } from '../../hooks/useRole';
import { ChallengeList } from './ChallengeList';
import { STATUS_BAR_HEIGHT, isIOS } from '../../utils/platform';
import { RootStackScreenProps } from '../router';

type FundraisingChallengeScreenProps = RootStackScreenProps<'FundraisingChallenge'>;

export const FundraisingChallengeScreen: React.FC<FundraisingChallengeScreenProps> = React.memo((props) => {
  const { navigation } = props;
  const { isInvestor } = useRole();

  // 检查权限
  useEffect(() => {
    // 只有投资者才能查看此页面
    if (!isInvestor) {
      navigation.goBack();
    }
  }, [isInvestor, navigation]);

  // 点击挑战项或出资按钮，跳转到出资详情页
  const handleItemPress = useCallback(
    (matchId: number | undefined) => {
      if (matchId) {
        navigation.navigate('InvestmentDetail', { matchId });
      }
    },
    [navigation],
  );

  // 返回按钮处理
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={styles.safeArea}>
        <ChallengeList onItemPress={handleItemPress} onBack={handleBack} />
      </SafeAreaView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: isIOS() ? 0 : STATUS_BAR_HEIGHT,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

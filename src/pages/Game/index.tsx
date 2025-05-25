import React, { useCallback } from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { RootStackScreenProps } from '../router';
import { isIOS, STATUS_BAR_HEIGHT } from '../../utils/platform';
import { GameHeader } from './components/common/GameHeader';
import { AAGame } from './views/AA';
import { CBGame } from './views/CB';
// 使用导航栈中定义的类型
type GameScreenProps = RootStackScreenProps<'Game'>;

export const Game: React.FC<GameScreenProps> = React.memo(({ route, navigation }) => {
  const { challengeName, operator, roundId, recorder, baseNumber, playRuleCode } = route.params;

  const renderContent = useCallback(() => {
    const gameProps = {
      challengeName,
      operator,
      roundId,
      recorder,
      baseNumber,
      navigation,
    };
    switch (playRuleCode) {
      case 'CB':
        return <CBGame {...gameProps} />;
      case 'AA':
        return <AAGame {...gameProps} />;
      default:
        return <CBGame {...gameProps} />;
    }
  }, [challengeName, operator, roundId, recorder, baseNumber, navigation, playRuleCode]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <GameHeader title="挑战详情" navigation={navigation} />
      {renderContent()}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: isIOS() ? 0 : STATUS_BAR_HEIGHT,
  },
});

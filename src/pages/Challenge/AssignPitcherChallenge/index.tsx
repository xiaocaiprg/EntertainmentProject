import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { useRole } from '../../../hooks/useRole';
import { ChallengeList } from './ChallengeList';
import { AssignmentDetail } from './AssignmentDetail';
import { STATUS_BAR_HEIGHT, isIOS } from '../../../utils/platform';
import { RootStackScreenProps } from '../../router';

type AssignPitcherChallengeScreenProps = RootStackScreenProps<'AssignPitcherChallenge'>;

export const AssignPitcherChallengeScreen: React.FC<AssignPitcherChallengeScreenProps> = React.memo(
  ({ navigation }) => {
    const { isPlayAdmin } = useRole();
    const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

    // 检查权限
    useEffect(() => {
      if (!isPlayAdmin) {
        navigation.goBack();
      }
    }, [isPlayAdmin, navigation]);

    // 点击挑战项，跳转到分配详情页
    const handleItemPress = useCallback((matchId: number | undefined) => {
      if (matchId) {
        setSelectedMatchId(matchId);
      }
    }, []);

    // 返回列表页
    const handleBackToList = useCallback(() => {
      setSelectedMatchId(null);
    }, []);

    // 返回按钮处理
    const handleBack = useCallback(() => {
      navigation.goBack();
    }, [navigation]);

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <SafeAreaView style={styles.safeArea}>
          {selectedMatchId ? (
            <AssignmentDetail matchId={selectedMatchId} onBack={handleBackToList} />
          ) : (
            <ChallengeList onItemPress={handleItemPress} onBack={handleBack} />
          )}
        </SafeAreaView>
      </View>
    );
  },
);

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

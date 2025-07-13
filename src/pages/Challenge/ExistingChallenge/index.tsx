import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Alert, StyleSheet, SafeAreaView, StatusBar, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import CustomText from '../../../components/CustomText';
import { THEME_COLORS } from '../../../utils/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ExistingChallengeForm from './components/ExistingChallengeForm';
import { getChallengeList } from '../../../api/services/gameService';
import { roundCreate } from '../../../api/services/roundService';
import { GameMatchPageDto } from '../../../interface/Game';
import { ChallengeStatus } from '../../../interface/Common';
import { isIOS, STATUS_BAR_HEIGHT } from '../../../utils/platform';

export const ExistingChallengeScreen = React.memo(() => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const [challengeList, setChallengeList] = useState<GameMatchPageDto[]>([]);
  const [selectedChallengeId, setSelectedChallengeId] = useState(-1); // 选择挑战
  const [activeRoundId, setActiveRoundId] = useState(0); // 进行中的场次ID
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const lastSubmitTimeRef = useRef<number>(0);
  const throttleDelayRef = useRef<number>(1000); // 1秒的节流延迟

  // 处理确认按钮点击
  const handleConfirm = useCallback(() => {
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTimeRef.current;

    // 如果距离上次提交的时间小于节流延迟，或者当前正在提交中，则直接返回
    if (timeSinceLastSubmit < throttleDelayRef.current || isSubmitting) {
      console.log('节流控制：拒绝重复提交', timeSinceLastSubmit);
      return;
    }

    // 更新最后提交时间
    lastSubmitTimeRef.current = now;

    const challenge = challengeList.find((c) => c.id === selectedChallengeId);
    if (!challenge) {
      return;
    }
    if (activeRoundId > 0) {
      // 如果有进行中的场次，直接导航到游戏页面，使用reset方法替代navigate
      navigation.replace('Game', {
        challengeId: selectedChallengeId,
        challengeName: challenge.name,
        operator: challenge.playPersonName,
        recorder: challenge.docPersonName,
        roundId: activeRoundId,
        baseNumber: challenge.baseNumberList?.[0],
        playRuleCode: challenge.playRuleCode,
      });
    } else {
      // 设置提交状态
      setIsSubmitting(true);

      // 如果没有进行中的场次，则创建新场次
      roundCreate({
        matchId: selectedChallengeId,
      })
        .then((res) => {
          if (res) {
            // 使用reset方法替代navigate
            navigation.replace('Game', {
              challengeId: selectedChallengeId,
              challengeName: challenge.name,
              operator: challenge.playPersonName,
              recorder: challenge.docPersonName,
              roundId: res,
              baseNumber: challenge.baseNumberList?.[0],
              playRuleCode: challenge.playRuleCode,
            });
          }
        })
        .catch((err) => {
          console.log('新增场次失败', err.message);
          Alert.alert('提示', err.message);
        })
        .finally(() => {
          // 请求完成后，重置提交状态
          setIsSubmitting(false);
        });
    }
  }, [challengeList, selectedChallengeId, navigation, activeRoundId, isSubmitting]);

  // 处理返回按钮点击
  const handleGoBack = useCallback(() => navigation.goBack(), [navigation]);

  useEffect(() => {
    getChallengeList({
      pageNum: 1,
      pageSize: 1000,
      isEnabledList: [ChallengeStatus.FUNDRAISING_COMPLETED, ChallengeStatus.IN_PROGRESS],
    }).then((res) => {
      setChallengeList(res?.records || []);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>查询已有挑战</CustomText>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.content}>
        <ExistingChallengeForm
          challenges={challengeList}
          selectedChallengeId={selectedChallengeId}
          onSelectChallengeId={(id) => {
            setSelectedChallengeId(Number(id));
          }}
          onConfirm={handleConfirm}
          setActiveRoundId={setActiveRoundId}
        />
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
    paddingTop: isIOS() ? 0 : STATUS_BAR_HEIGHT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
});

export default ExistingChallengeScreen;

import React, { useState, useCallback, useEffect } from 'react';
import { Alert, StyleSheet, SafeAreaView, StatusBar, ScrollView, View, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { THEME_COLORS } from '../../utils/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ExistingChallengeForm from './components/ExistingChallengeForm';
import NewChallengeForm from './components/NewChallengeForm';
import { getOperatorList, getChallengeList, createChallenge, roundCreate } from '../../api/services/gameService';
import { UserRecorder, GameMatchDto } from '../../interface/Game';
import { isIOS, STATUS_BAR_HEIGHT } from '../../utils/platform';
type RouteParams = {
  type: 'new' | 'existing';
};

export const ChallengeSelectScreen = React.memo(() => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();
  const { type } = route.params as RouteParams;

  const [operatorList, setOperatorList] = useState<UserRecorder[]>([]);
  const [challengeList, setChallengeList] = useState<GameMatchDto[]>([]);
  const [selectedChallengeId, setSelectedChallengeId] = useState(-1); // 选择挑战
  const [selectedOperatorId, setSelectedOperatorId] = useState(-1); // 选择投手
  const [challengeName, setChallengeName] = useState(''); // 挑战名称
  const [activeRoundId, setActiveRoundId] = useState(0); // 进行中的场次ID

  // 处理确认按钮点击
  const handleConfirm = useCallback(() => {
    if (type === 'existing') {
      const challenge = challengeList.find((c) => c.id === selectedChallengeId);
      if (!challenge) {
        return;
      }
      if (activeRoundId > 0) {
        // 如果有进行中的场次，直接导航到游戏页面，使用reset方法替代navigate
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Main',
              state: {
                routes: [{ name: 'Home' }],
                index: 0,
              },
            },
            {
              name: 'Game',
              params: {
                challengeId: selectedChallengeId,
                challengeName: challenge.name,
                operator: challenge.playPersonName,
                roundId: activeRoundId,
              },
            },
          ],
        });
      } else {
        // 如果没有进行中的场次，则创建新场次
        roundCreate({
          matchId: selectedChallengeId,
        })
          .then((res) => {
            if (res) {
              // 使用reset方法替代navigate
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'Main',
                    state: {
                      routes: [{ name: 'Home' }],
                      index: 0,
                    },
                  },
                  {
                    name: 'Game',
                    params: {
                      challengeId: selectedChallengeId,
                      challengeName: challenge.name,
                      operator: challenge.playPersonName,
                      roundId: res,
                    },
                  },
                ],
              });
            }
          })
          .catch((err) => {
            console.log('新增场次失败', err.message);
            Alert.alert('提示', err.message);
          });
      }
    } else {
      // 新增挑战
      const operator = operatorList.find((o) => o.userId === selectedOperatorId)?.username;
      createChallenge({
        name: challengeName || '',
        playPersonId: selectedOperatorId,
        isEnabled: 1,
      })
        .then((res) => {
          if (res) {
            // 使用reset方法替代navigate
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Main',
                  state: {
                    routes: [{ name: 'Home' }],
                    index: 0,
                  },
                },
                {
                  name: 'Game',
                  params: {
                    challengeName: challengeName || '',
                    operator,
                    roundId: res,
                    isNewChallenge: true,
                  },
                },
              ],
            });
          }
        })
        .catch((err) => {
          console.log('新增挑战失败', err.message);
          Alert.alert('提示', err.message);
        });
    }
  }, [
    type,
    operatorList,
    challengeList,
    selectedChallengeId,
    selectedOperatorId,
    challengeName,
    navigation,
    activeRoundId,
  ]);

  // 处理返回按钮点击
  const handleGoBack = useCallback(() => navigation.goBack(), [navigation]);

  useEffect(() => {
    getOperatorList({ pageNum: '1', pageSize: '999', type: 2 }).then((res) => {
      setOperatorList(res?.records || []);
    });
    getChallengeList({ pageNum: '1', pageSize: '999', isEnabled: 1 }).then((res) => {
      setChallengeList(res?.records || []);
    });
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="default" backgroundColor={THEME_COLORS.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{type === 'new' ? '新增挑战' : '已有挑战'}</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {type === 'existing' ? (
          <ExistingChallengeForm
            challenges={challengeList}
            selectedChallengeId={selectedChallengeId}
            onSelectChallengeId={(id) => {
              setSelectedChallengeId(Number(id));
            }}
            onConfirm={handleConfirm}
            setActiveRoundId={setActiveRoundId}
          />
        ) : (
          <NewChallengeForm
            operators={operatorList}
            selectedOperatorId={selectedOperatorId}
            challengeName={challengeName}
            onSelectOperatorId={(userId) => {
              setSelectedOperatorId(userId);
            }}
            onChangeName={(text) => {
              setChallengeName(text);
            }}
            onConfirm={handleConfirm}
          />
        )}
      </ScrollView>
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
    height: 60,
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
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
});

export default ChallengeSelectScreen;

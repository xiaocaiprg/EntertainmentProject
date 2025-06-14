import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getChallengeList, updateMatchDocPerson } from '../../api/services/gameService';
import { getBusinessList } from '../../api/services/businessService';
import { GameMatchPageDto } from '../../interface/Game';
import { ChallengeStatus, UserType } from '../../interface/Common';
import { STATUS_BAR_HEIGHT, isIOS } from '../../utils/platform';
import { THEME_COLORS } from '../../utils/styles';
import { BusinessDto, BusinessListParams } from '../../interface/Business';
import { RecorderSelector } from './components/RecorderSelector';
import CustomText from '../../components/CustomText';
import { ChallengeCard } from './components/ChallengeCard';
import { RootStackScreenProps } from '../router';

// 使用导航堆栈中定义的类型
type ChangeRecorderChallengeScreenProps = RootStackScreenProps<'ChangeRecorderChallenge'>;

export const ChangeRecorderChallenge: React.FC<ChangeRecorderChallengeScreenProps> = React.memo(({ navigation }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [challengeList, setChallengeList] = useState<GameMatchPageDto[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [recorderList, setRecorderList] = useState<BusinessDto[]>([]);
  const [selectedRecorder, setSelectedRecorder] = useState<BusinessDto | null>(null);
  const [currentChallengeId, setCurrentChallengeId] = useState<number | undefined>(undefined);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const pageNum = useRef<number>(1);
  const pageSize = useRef<number>(10);
  // 获取挑战列表
  const fetchChallengeList = useCallback(async () => {
    setLoading(true);
    const res = await getChallengeList({
      pageNum: pageNum.current,
      pageSize: pageSize.current,
      isEnabledList: [ChallengeStatus.FUNDRAISING_COMPLETED, ChallengeStatus.FUNDRAISING, ChallengeStatus.IN_PROGRESS], // 仅查询已完成募资的挑战
    });
    if (res) {
      const isHasMore = res.current < res.pages;
      setHasMore(isHasMore);
      setChallengeList((prev) => [...prev, ...(res.records || [])]);
    }
    setLoading(false);
  }, []);

  // 获取记录人列表
  const fetchRecorderList = useCallback(async () => {
    const params: BusinessListParams = {
      type: UserType.RECORDER,
    };
    const res = await getBusinessList(params);
    if (res) {
      setRecorderList(res);
    }
  }, []);

  // 加载更多挑战
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      pageNum.current += 1;
      fetchChallengeList();
    }
  }, [loading, hasMore, fetchChallengeList]);

  // 初始加载数据
  useEffect(() => {
    fetchChallengeList();
    fetchRecorderList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 打开选择记录人Modal
  const openRecorderModal = useCallback((challengeId: number | undefined) => {
    if (!challengeId) {
      return;
    }
    setCurrentChallengeId(challengeId);
    setModalVisible(true);
  }, []);

  // 关闭记录人选择弹窗
  const closeRecorderModal = useCallback(() => {
    setModalVisible(false);
    setSelectedRecorder(null);
  }, []);

  // 选择记录人
  const handleSelectRecorder = useCallback((recorder: BusinessDto) => {
    setSelectedRecorder(recorder);
  }, []);

  // 提交记录人
  const handleSubmitRecorder = useCallback(async () => {
    if (!selectedRecorder || !currentChallengeId) {
      Alert.alert('提示', '请选择记录人');
      return;
    }
    try {
      setSubmitting(true);
      await updateMatchDocPerson({
        id: currentChallengeId,
        docPersonCode: selectedRecorder.code || '',
      });

      setSubmitting(false);
      setModalVisible(false);
      Alert.alert('提示', '更新成功', [
        {
          text: '确定',
          onPress: () => {
            // 更新成功后返回首页
            navigation.navigate('Main');
          },
        },
      ]);
    } catch (error) {
      setSubmitting(false);
      Alert.alert('提示', '更新失败');
    }
  }, [selectedRecorder, currentChallengeId, navigation]);

  // 渲染列表底部加载状态
  const renderFooter = useCallback(() => {
    if (!loading) {
      return null;
    }
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={THEME_COLORS.primary} />
        <CustomText style={styles.footerText}>加载中...</CustomText>
      </View>
    );
  }, [loading]);

  // 返回按钮处理
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // 渲染挑战项
  const renderItem = useCallback(
    (item: GameMatchPageDto) => <ChallengeCard item={item} onEditPress={openRecorderModal} />,
    [openRecorderModal],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={THEME_COLORS.text.primary} />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>可修改的挑战</CustomText>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.container}>
        <FlatList
          data={challengeList}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(item) => `${String(item.id)}`}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          refreshing={loading}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
        />
        {challengeList.length === 0 && !loading && (
          <View style={styles.emptyContainer}>
            <CustomText style={styles.emptyText}>暂无挑战</CustomText>
          </View>
        )}
      </View>

      <RecorderSelector
        visible={modalVisible}
        recorderList={recorderList}
        selectedRecorder={selectedRecorder}
        submitting={submitting}
        onClose={closeRecorderModal}
        onSelect={handleSelectRecorder}
        onSubmit={handleSubmitRecorder}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: isIOS() ? 0 : STATUS_BAR_HEIGHT,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 36,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 10,
  },
  footerContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

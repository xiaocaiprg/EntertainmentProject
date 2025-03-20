import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { THEME_COLORS } from '../../utils/styles';

// 模拟数据，实际应用中应从API获取
const MOCK_CHALLENGES = [
  { id: '1', name: '挑战赛1', operator: '操作员A' },
  { id: '2', name: '挑战赛2', operator: '操作员B' },
  { id: '3', name: '周末挑战', operator: '操作员C' },
];

const MOCK_OPERATORS = [
  { id: '1', name: '操作员A' },
  { id: '2', name: '操作员B' },
  { id: '3', name: '操作员C' },
  { id: '4', name: '操作员D' },
];

type RouteParams = {
  type: 'new' | 'existing';
};

export const ChallengeSelectScreen = React.memo(() => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();
  const { type } = route.params as RouteParams;

  const [selectedChallenge, setSelectedChallenge] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [challengeName, setChallengeName] = useState('');
  const [showChallengeOptions, setShowChallengeOptions] = useState(false);
  const [showOperatorOptions, setShowOperatorOptions] = useState(false);

  // 判断确认按钮是否可点击
  const isConfirmDisabled = useMemo(
    () => (type === 'existing' ? !selectedChallenge : !selectedOperator),
    [type, selectedChallenge, selectedOperator],
  );

  // 处理确认按钮点击
  const handleConfirm = useCallback(() => {
    // 根据不同类型的选择，传递不同的参数到Game页面
    if (type === 'existing') {
      const challenge = MOCK_CHALLENGES.find((c) => c.id === selectedChallenge);
      navigation.navigate('Game', {
        challengeId: selectedChallenge,
        challengeName: challenge?.name,
        operator: challenge?.operator,
      });
    } else {
      // 新增挑战
      const operator = MOCK_OPERATORS.find((o) => o.id === selectedOperator)?.name;
      navigation.navigate('Game', {
        challengeName,
        operator,
        isNewChallenge: true,
      });
    }
  }, [type, selectedChallenge, selectedOperator, challengeName, navigation]);

  // 处理返回按钮点击
  const handleGoBack = useCallback(() => navigation.goBack(), [navigation]);

  // 渲染标题
  const headerTitle = useMemo(() => (type === 'new' ? '新增挑战' : '已有挑战'), [type]);

  // 渲染挑战选择下拉框
  const renderChallengeSelect = useCallback(() => {
    return (
      <View style={styles.selectContainer}>
        <Text style={styles.labelText}>选择挑战</Text>
        <TouchableOpacity style={styles.dropdown} onPress={() => setShowChallengeOptions(!showChallengeOptions)}>
          <Text style={styles.dropdownText}>
            {selectedChallenge ? MOCK_CHALLENGES.find((c) => c.id === selectedChallenge)?.name : '请选择挑战'}
          </Text>
          <Icon name={showChallengeOptions ? 'arrow-drop-up' : 'arrow-drop-down'} size={24} color="#666" />
        </TouchableOpacity>

        {showChallengeOptions && (
          <View style={styles.optionsList}>
            {MOCK_CHALLENGES.map((challenge) => (
              <TouchableOpacity
                key={challenge.id}
                style={styles.optionItem}
                onPress={() => {
                  setSelectedChallenge(challenge.id);
                  setShowChallengeOptions(false);
                }}
              >
                <Text style={styles.optionText}>{`${challenge.name} (${challenge.operator})`}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  }, [selectedChallenge, showChallengeOptions]);

  // 渲染操作员选择下拉框
  const renderOperatorSelect = useCallback(() => {
    return (
      <View style={styles.selectContainer}>
        <Text style={styles.labelText}>选择操作人</Text>
        <TouchableOpacity style={styles.dropdown} onPress={() => setShowOperatorOptions(!showOperatorOptions)}>
          <Text style={styles.dropdownText}>
            {selectedOperator ? MOCK_OPERATORS.find((o) => o.id === selectedOperator)?.name : '请选择操作人'}
          </Text>
          <Icon name={showOperatorOptions ? 'arrow-drop-up' : 'arrow-drop-down'} size={24} color="#666" />
        </TouchableOpacity>

        {showOperatorOptions && (
          <View style={styles.optionsList}>
            {MOCK_OPERATORS.map((operator) => (
              <TouchableOpacity
                key={operator.id}
                style={styles.optionItem}
                onPress={() => {
                  setSelectedOperator(operator.id);
                  setShowOperatorOptions(false);
                }}
              >
                <Text style={styles.optionText}>{operator.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  }, [selectedOperator, showOperatorOptions]);

  // 渲染挑战名称输入框
  const renderChallengeNameInput = useCallback(() => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.labelText}>挑战名称</Text>
        <TextInput
          style={styles.textInput}
          value={challengeName}
          onChangeText={setChallengeName}
          placeholder="请输入本次挑战名称"
          placeholderTextColor="#999"
        />
      </View>
    );
  }, [challengeName]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="default" backgroundColor={THEME_COLORS.background} />

      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.formContainer}>
          {type === 'existing' ? (
            renderChallengeSelect()
          ) : (
            <>
              {renderOperatorSelect()}
              {renderChallengeNameInput()}
            </>
          )}

          <View style={styles.spacer} />

          {/* 确认按钮 */}
          <TouchableOpacity
            style={[styles.confirmButton, isConfirmDisabled && styles.confirmButtonDisabled]}
            onPress={handleConfirm}
            disabled={isConfirmDisabled}
          >
            <Text style={styles.confirmButtonText}>确认</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
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
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectContainer: {
    marginBottom: 16,
    position: 'relative',
    zIndex: 10,
  },
  inputContainer: {
    marginBottom: 16,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  optionsList: {
    position: 'absolute',
    top: 76,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    maxHeight: 180,
    overflow: 'scroll',
    zIndex: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  optionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  textInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
  },
  spacer: {
    height: 20,
  },
  confirmButton: {
    backgroundColor: THEME_COLORS.primary,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChallengeSelectScreen;

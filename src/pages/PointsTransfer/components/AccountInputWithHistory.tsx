import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomText from '../../../components/CustomText';
import { getTransferOutlogList } from '../../../api/services/pointService';
import { TransferOutLogDto } from '../../../interface/Points';
import { TransferType } from '../index';
import { UserTransferType } from '../../../interface/Common';

interface AccountInputWithHistoryProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  transferType: Exclude<TransferType, TransferType.POOL>;
  style?: any;
  t: (key: string) => string;
}

export const AccountInputWithHistory: React.FC<AccountInputWithHistoryProps> = React.memo((props) => {
  const { value, onChangeText, placeholder, transferType, style, t } = props;

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [personalHistory, setPersonalHistory] = useState<TransferOutLogDto[]>([]);
  const [companyHistory, setCompanyHistory] = useState<TransferOutLogDto[]>([]);
  const [groupHistory, setGroupHistory] = useState<TransferOutLogDto[]>([]);
  const inputRef = useRef<TextInput>(null);

  // 根据转账类型获取对应的历史记录
  const currentHistory = useMemo(() => {
    const history =
      transferType === TransferType.PERSONAL
        ? personalHistory
        : transferType === TransferType.COMPANY
        ? companyHistory
        : groupHistory;
    return history.slice(0, 5); // 只显示最近的5条记录
  }, [transferType, personalHistory, companyHistory, groupHistory]);

  // 页面加载时获取历史记录
  useEffect(() => {
    const fetchAllHistory = async () => {
      // 并行获取个人、公司和集团的历史记录
      const [personalData, companyData, groupData] = await Promise.all([
        getTransferOutlogList(UserTransferType.PERSONAL.toString()), // 个人
        getTransferOutlogList(UserTransferType.COMPANY.toString()), // 公司
        getTransferOutlogList(UserTransferType.GROUP.toString()), // 集团
      ]);

      if (personalData && personalData.length > 0) {
        setPersonalHistory(personalData);
      }

      if (companyData && companyData.length > 0) {
        setCompanyHistory(companyData);
      }

      if (groupData && groupData.length > 0) {
        setGroupHistory(groupData);
      }
    };

    fetchAllHistory();
  }, []);

  const handleInputBlur = useCallback(() => {
    // 延迟关闭，让用户有时间点击下拉项
    setTimeout(() => {
      setIsDropdownVisible(false);
    }, 300);
  }, []);

  const handleSelectAccount = useCallback(
    (item: TransferOutLogDto) => {
      onChangeText(item.toCode);
      setIsDropdownVisible(false);
      inputRef.current?.blur();
    },
    [onChangeText],
  );

  const handleInputPress = useCallback(() => {
    setIsDropdownVisible((prev) => !prev);
  }, []);

  // 当转账类型改变时，关闭下拉框
  useEffect(() => {
    setIsDropdownVisible(false);
  }, [transferType]);

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.inputContainer} onPress={handleInputPress} activeOpacity={1}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onBlur={handleInputBlur}
          placeholderTextColor={'#999'}
          placeholder={placeholder}
        />
        <Icon
          name={isDropdownVisible ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={20}
          color="#999"
          style={styles.dropdownIcon}
        />
      </TouchableOpacity>

      {isDropdownVisible && (
        <View style={styles.dropdown}>
          <View style={styles.dropdownContent}>
            {currentHistory.length > 0 ? (
              <>
                <View style={styles.dropdownHeader}>
                  <CustomText style={styles.dropdownHeaderText}>{t('pointsTransfer.recentTransferHistory')}</CustomText>
                </View>
                <View style={styles.historyList}>
                  {currentHistory.map((item, index) => (
                    <TouchableOpacity
                      key={`${item.toCode}-${index}`}
                      style={styles.historyItem}
                      onPress={() => handleSelectAccount(item)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.historyItemContent}>
                        <CustomText style={styles.historyCode}>{item.toCode}</CustomText>
                        <CustomText style={styles.historyName} numberOfLines={1}>
                          {item.toName}
                        </CustomText>
                      </View>
                      <Icon name="keyboard-arrow-right" size={20} color="#999" />
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : (
              <View style={styles.emptyContainer}>
                <CustomText style={styles.emptyText}>{t('pointsTransfer.noTransferHistory')}</CustomText>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  inputContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 10,
  },
  dropdownIcon: {
    paddingRight: 10,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderTopWidth: 0,
    overflow: 'hidden',
    zIndex: 1,
    maxHeight: 250,
  },
  dropdownContent: {
    flex: 1,
  },
  dropdownHeader: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f8f8',
  },
  dropdownHeaderText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyItemContent: {
    flex: 1,
  },
  historyCode: {
    fontSize: 14,
    color: '#333',
  },
  historyName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  emptyContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});

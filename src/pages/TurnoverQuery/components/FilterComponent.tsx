import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { THEME_COLORS } from '../../../utils/styles';
import { UserResult } from '../../../interface/User';
import { FilterProps, QueryCondition } from '../interface/ITurnoverQuery';
import { DatePicker } from '../../../components/DatePicker';
import { formatDate } from '../../../utils/date';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SlideModal } from '../../../components/SlideModal';
import { getOperatorList } from '../../../api/services/gameService';

export const FilterComponent = React.memo((props: FilterProps) => {
  const { onSearch, companyList, currentUserType } = props;
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 6);
    return date;
  });
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedCompanyCode, setSelectedCompanyCode] = useState<string>('');
  const [selectedPersonCode, setSelectedPersonCode] = useState<string>('');
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [personModalOpen, setPersonModalOpen] = useState(false);
  const [users, setUsers] = useState<UserResult[]>([]);
  const pageNumRef = useRef(1);
  const pageSizeRef = useRef(100);

  const fetchUsers = useCallback(async (companyCode: string) => {
    const result = await getOperatorList({
      companyCode: companyCode,
      pageNum: pageNumRef.current,
      pageSize: pageSizeRef.current,
    });
    if (result && result.records) {
      setUsers(result.records);
    }
  }, []);

  const handleCompanySelect = useCallback(
    (companyCode: string) => {
      fetchUsers(companyCode);
      setSelectedCompanyCode(companyCode);
      setCompanyModalOpen(false);
    },
    [fetchUsers],
  );

  const handlePersonSelect = useCallback((personCode: string) => {
    setSelectedPersonCode(personCode);
    setPersonModalOpen(false);
  }, []);
  const handleSubmit = useCallback(() => {
    if (!selectedCompanyCode) {
      // 如果未选择公司，不能提交查询
      return;
    }
    const params: QueryCondition = {
      startTime: formatDate(startDate, 'YYYY-MM-DD'),
      endTime: formatDate(endDate, 'YYYY-MM-DD'),
    };
    params.companyCode = selectedCompanyCode;
    if (selectedPersonCode) {
      params.businessCode = selectedPersonCode;
    }
    onSearch(params);
  }, [startDate, endDate, selectedCompanyCode, selectedPersonCode, onSearch]);

  // 获取当前选中公司名称
  const selectedCompanyName = useMemo(() => {
    const company = companyList.find((c) => c.code === selectedCompanyCode);
    return company ? company.name : '请选择公司';
  }, [companyList, selectedCompanyCode]);
  // 获取当前选中人员名称
  const selectedPersonName = useMemo(() => {
    const person = users.find((u) => u.code === selectedPersonCode);
    return person ? person.name : '选择个人(非必填)';
  }, [users, selectedPersonCode]);
  const renderCompanyList = useCallback(
    () => (
      <View style={styles.selectorListContent}>
        {companyList.map((company) => (
          <TouchableOpacity
            key={company.code}
            style={[styles.selectorItem, selectedCompanyCode === company.code && styles.selectorItemSelected]}
            onPress={() => handleCompanySelect(company.code)}
          >
            <Text style={styles.selectorItemText}>{company.name}</Text>
            {selectedCompanyCode === company.code && <Icon name="check" size={20} color={THEME_COLORS.primary} />}
          </TouchableOpacity>
        ))}
      </View>
    ),
    [companyList, selectedCompanyCode, handleCompanySelect],
  );
  const renderPersonList = useCallback(
    () => (
      <View style={styles.selectorListContent}>
        <TouchableOpacity
          style={[styles.selectorItem, !selectedPersonCode && styles.selectorItemSelected]}
          onPress={() => handlePersonSelect('')}
        >
          <Text style={styles.selectorItemText}>不选择</Text>
          {!selectedPersonCode && <Icon name="check" size={20} color={THEME_COLORS.primary} />}
        </TouchableOpacity>

        {users?.map((person) => (
          <TouchableOpacity
            key={person.code}
            style={[styles.selectorItem, selectedPersonCode === person.code && styles.selectorItemSelected]}
            onPress={() => handlePersonSelect(person.code)}
          >
            <Text style={styles.selectorItemText}>{person.name}</Text>
            {selectedPersonCode === person.code && <Icon name="check" size={20} color={THEME_COLORS.primary} />}
          </TouchableOpacity>
        ))}
      </View>
    ),
    [users, selectedPersonCode, handlePersonSelect],
  );
  const renderFilterBar = useCallback(
    () => (
      <View>
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterItem, styles.companySelector]}
            onPress={() => setCompanyModalOpen(true)}
          >
            <Text style={styles.filterText} numberOfLines={1}>
              {selectedCompanyName}
            </Text>
            <Icon name="arrow-drop-down" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterItem, styles.personSelector, !selectedCompanyCode && styles.disabled]}
            onPress={() => selectedCompanyCode && setPersonModalOpen(true)}
            disabled={!selectedCompanyCode}
          >
            <Text style={styles.filterText} numberOfLines={1}>
              {selectedPersonName}
            </Text>
            <Icon name="arrow-drop-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        <View style={styles.filterRow}>
          <View style={[styles.dateContainer, { marginRight: 5 }]}>
            <Text style={styles.dateLabel}>开始时间:</Text>
            <View style={styles.datePickerWrapper}>
              <DatePicker title="" selectedDate={startDate} onDateChange={setStartDate} format="YYYY-MM-DD" />
            </View>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>结束时间:</Text>
            <View style={styles.datePickerWrapper}>
              <DatePicker title="" selectedDate={endDate} onDateChange={setEndDate} format="YYYY-MM-DD" />
            </View>
          </View>
        </View>
      </View>
    ),
    [endDate, startDate, selectedCompanyName, selectedPersonName, selectedCompanyCode],
  );

  useEffect(() => {
    setSelectedCompanyCode('');
    setSelectedPersonCode('');
  }, [currentUserType]);
  return (
    <View style={styles.container}>
      {renderFilterBar()}
      <TouchableOpacity
        style={[styles.submitButton, !selectedCompanyCode && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={!selectedCompanyCode}
      >
        <Text style={styles.submitButtonText}>查询</Text>
      </TouchableOpacity>
      <SlideModal visible={companyModalOpen} title="选择公司" onClose={() => setCompanyModalOpen(false)}>
        {renderCompanyList()}
      </SlideModal>
      <SlideModal visible={personModalOpen} title="选择个人(可选)" onClose={() => setPersonModalOpen(false)}>
        {renderPersonList()}
      </SlideModal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
  },
  filterItem: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  companySelector: {
    flex: 1,
    marginRight: 6,
  },
  personSelector: {
    flex: 1,
  },
  disabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#eee',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  dateContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginRight: 2,
  },
  datePickerWrapper: {
    flex: 1,
  },
  // 选择器列表样式
  selectorListContent: {
    paddingVertical: 5,
  },
  selectorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectorItemSelected: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
  },
  selectorItemText: {
    fontSize: 14,
    color: '#333',
  },
  // 提交按钮
  submitButton: {
    backgroundColor: THEME_COLORS.primary,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

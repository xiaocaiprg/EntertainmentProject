import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TransferLogDto } from '../../../../interface/Points';
import CustomText from '../../../../components/CustomText';

// 定义积分类型枚举
export enum PointType {
  TRANSFER_IN = 1, // 转入
  TRANSFER_OUT = 2, // 转出
}

interface PointCardProps {
  item: TransferLogDto;
}

export const PointCard = React.memo((props: PointCardProps) => {
  const { item } = props;

  const pointTypeText = React.useMemo(() => {
    if (item.type === PointType.TRANSFER_IN) {
      return '转入';
    }
    if (item.type === PointType.TRANSFER_OUT) {
      return '转出';
    }
    return '';
  }, [item.type]);

  const isEarnType = React.useMemo(() => {
    return item.type === PointType.TRANSFER_IN;
  }, [item.type]);

  const pointDisplay = React.useMemo(() => {
    let sign = '';
    if (item.type === PointType.TRANSFER_OUT) {
      sign = '-';
    } else if (item.type === PointType.TRANSFER_IN) {
      sign = '+';
    } else {
      sign = item.amount && item.amount > 0 ? '+' : '-';
    }
    const absAmount = Math.abs(item.amount ?? 0);
    return { sign, absAmount };
  }, [item.type, item.amount]);

  // 根据类型决定显示来源还是去向信息
  const renderSourceOrDestination = () => {
    if (item.type === PointType.TRANSFER_IN) {
      return (
        <CustomText style={styles.recordOrderNo}>
          来源: {item.fromName}
          {item.fromCode ? ` (${item.fromCode})` : ''}
        </CustomText>
      );
    } else if (item.type === PointType.TRANSFER_OUT) {
      return (
        <CustomText style={styles.recordOrderNo}>
          去向: {item.toName}
          {item.toCode ? ` (${item.toCode})` : ''}
        </CustomText>
      );
    }
    return null;
  };

  return (
    <View style={styles.recordItem}>
      <View style={styles.recordMain}>
        <CustomText style={styles.recordDesc}>
          {pointTypeText}
          {item.matchName ? ` - ${item.matchName}` : ''}
        </CustomText>
        <CustomText style={styles.recordDate}>{item.transferTime}</CustomText>
        {renderSourceOrDestination()}
        {item.description && <CustomText style={styles.recordDate}>备注: {item.description}</CustomText>}
      </View>
      <CustomText style={[styles.recordAmount, isEarnType ? styles.earnAmount : styles.spendAmount]}>
        {pointDisplay.sign}
        {pointDisplay.absAmount}
      </CustomText>
    </View>
  );
});

const styles = StyleSheet.create({
  recordItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recordMain: {
    flex: 1,
  },
  recordDesc: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  recordDate: {
    fontSize: 14,
    color: '#999',
    marginBottom: 3,
  },
  recordOrderNo: {
    fontSize: 14,
    color: '#999',
  },
  recordAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  earnAmount: {
    color: '#d4a152',
  },
  spendAmount: {
    color: '#666',
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProfitDto } from '../../../interface/Points';

interface ProfitCardProps {
  item: ProfitDto;
}

export const ProfitCard = React.memo((props: ProfitCardProps) => {
  const { item } = props;

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Text style={styles.name}>{item.matchName}</Text>
      </View>
      <View style={styles.rightContent}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: item.profit >= 0 ? '#2ecc71' : '#e74c3c' }}>
          {item.profitStr} {item.currency && `(${item.currency})`}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 5,
  },
  leftContent: {
    flex: 1,
    justifyContent: 'center',
  },
  rightContent: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  code: {
    fontSize: 14,
    color: '#666',
  },
});

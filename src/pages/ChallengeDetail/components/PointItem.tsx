import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GamePointDto, GameInningDto } from '../../../interface/Game';

interface PointItemProps {
  point: GamePointDto;
  index?: number;
}

export const PointItem = React.memo((props: PointItemProps) => {
  const { point } = props;

  const renderInning = useCallback((inning: GameInningDto, idx: number) => {
    return (
      <View key={`inning-${inning.id || idx}`} style={styles.inningItem}>
        <Text
          style={[
            styles.inningResult,
            inning.result === 1 ? styles.winText : inning.result === 2 ? styles.loseText : {},
          ]}
        >
          {inning.result === 1 ? '+' : inning.result === 2 ? '-' : ''}
        </Text>
        <Text style={styles.inningLabel}>{`(${inning.isDealer === 1 ? '庄' : '闲'})`}</Text>
      </View>
    );
  }, []);

  return (
    <View style={styles.pointItem}>
      <Text style={styles.pointLable}>第{point.eventNum}轮:</Text>
      <Text style={styles.pointLable}>押注:{point.betNumber}</Text>

      {point.gameInningDtoList && point.gameInningDtoList.length > 0 && (
        <View style={styles.inningContainer}>{point.gameInningDtoList.map(renderInning)}</View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  pointItem: {
    flexDirection: 'row',
    alignContent: 'space-evenly',
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
    borderWidth: 0.5,
    borderColor: '#eaeaea',
  },
  pointLable: {
    fontSize: 12,
    color: '#777',
    marginRight: 3,
  },
  inningContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  inningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  inningLabel: {
    fontSize: 12,
    color: '#555',
  },
  inningResult: {
    fontSize: 12,
    fontWeight: '500',
  },
  winText: {
    color: '#4caf50',
  },
  loseText: {
    color: '#f44336',
  },
});

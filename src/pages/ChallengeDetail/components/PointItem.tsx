import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { GamePointDto, GameInningDto } from '../../../interface/Game';
import CustomText from '../../../components/CustomText';
import { ChallengeType } from '../../../interface/Common';
interface PointItemProps {
  point: GamePointDto;
  playRuleCode: string;
  index?: number;
}

export const PointItem = React.memo((props: PointItemProps) => {
  const { point, playRuleCode } = props;

  const renderInning = useCallback(
    (inning: GameInningDto, idx: number) => {
      return (
        <View key={`inning-${inning.id || idx}`} style={styles.inningItem}>
          <CustomText
            style={[
              styles.inningResult,
              inning.result === 1 ? styles.winText : inning.result === 2 ? styles.loseText : {},
            ]}
          >
            {inning.result === 1 ? '+' : inning.result === 2 ? '-' : ''}
          </CustomText>
          {playRuleCode === ChallengeType.FREE_FIGHT && (
            <CustomText style={styles.inningLabel}>{inning.betNumber}</CustomText>
          )}
          <CustomText style={styles.inningLabel}>{`(${inning.isDealer === 1 ? '庄' : '闲'})`}</CustomText>
        </View>
      );
    },
    [playRuleCode],
  );

  return (
    <View style={styles.pointItem}>
      <CustomText style={styles.pointLable}>第{point.eventNum}轮:</CustomText>
      {playRuleCode !== ChallengeType.FREE_FIGHT && (
        <CustomText style={styles.pointLable}>押注:{point.betNumber}</CustomText>
      )}
      {point.gameInningDtoList && point.gameInningDtoList.length > 0 && (
        <View style={styles.inningContainer}>{point.gameInningDtoList.map(renderInning)}</View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  pointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    paddingHorizontal: 8,
    marginBottom: 6,
    borderWidth: 0.5,
    borderColor: '#eaeaea',
  },
  pointLable: {
    fontSize: 14,
    color: '#777',
    marginRight: 4,
  },
  inningContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  inningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  inningLabel: {
    fontSize: 14,
    color: '#555',
  },
  inningResult: {
    fontSize: 18,
    fontWeight: '700',
  },
  winText: {
    color: '#4caf50',
  },
  loseText: {
    color: '#f44336',
  },
});

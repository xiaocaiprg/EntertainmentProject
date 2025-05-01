import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, StatusBar, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isAndroid } from '../../../utils/platform';
import { useTranslation } from '../../../hooks/useTranslation';
import { RankingTypeEnum } from '../../../interface/Ranking';

interface HeaderProps {
  scrollY: Animated.Value;
  onShowInfo: () => void;
  onBack: () => void;
  rankingType: RankingTypeEnum;
  onRankingTypeChange: (type: RankingTypeEnum) => void;
}

export const Nav = React.memo((props: HeaderProps) => {
  const { scrollY, onShowInfo, onBack, rankingType, onRankingTypeChange } = props;
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const rankingOptions = useMemo(
    () => [
      { value: RankingTypeEnum.PERSONAL, label: t('pitcher_ranking.personal') },
      { value: RankingTypeEnum.COMPANY, label: t('pitcher_ranking.company') },
    ],
    [t],
  );

  const renderTypeSelector = useCallback(() => {
    return (
      <View style={styles.typeSelector}>
        {rankingOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[styles.typeOption, rankingType === option.value && styles.activeTypeOption]}
            onPress={() => onRankingTypeChange(option.value)}
          >
            <Text style={[styles.typeOptionText, rankingType === option.value && styles.activeTypeOptionText]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }, [rankingOptions, rankingType, onRankingTypeChange]);

  const renderNav = useCallback(() => {
    return (
      <View style={[styles.row, { marginTop: insets.top }]}>
        <TouchableOpacity onPress={onBack}>
          <Icon name="arrow-back" size={24} color={'#fff'} />
        </TouchableOpacity>
        {renderTypeSelector()}
        <TouchableOpacity onPress={onShowInfo} style={styles.infoContainer}>
          <Icon name="list" size={24} color={'#fff'} />
          <Text style={styles.infoText}>{t('pitcher_ranking.info')}</Text>
        </TouchableOpacity>
      </View>
    );
  }, [insets.top, onBack, onShowInfo, t, renderTypeSelector]);

  return (
    <View style={styles.extraView}>
      {isAndroid() ? <StatusBar barStyle="dark-content" backgroundColor={'transparent'} translucent /> : null}
      {renderNav()}
      <Animated.View
        style={[
          styles.navWrapper,
          {
            opacity: scrollY.interpolate({
              inputRange: [0, 50],
              outputRange: [0, 1],
            }),
          },
        ]}
      >
        {renderNav()}
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  extraView: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  },
  navWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: '#013795',
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#fff',
  },
  typeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 2,
  },
  typeOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    borderRadius: 13,
  },
  activeTypeOption: {
    backgroundColor: '#fff',
  },
  typeOptionText: {
    fontSize: 12,
    color: '#fff',
  },
  activeTypeOptionText: {
    color: '#013795',
    fontWeight: '500',
  },
});

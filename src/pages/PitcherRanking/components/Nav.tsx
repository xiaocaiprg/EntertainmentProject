import React, { useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, StatusBar, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isAndroid } from '../../../utils/platform';
import { useTranslation } from '../../../hooks/useTranslation';

interface HeaderProps {
  title?: string;
  scrollY: Animated.Value;
  onShowInfo: () => void;
  onBack: () => void;
}

export const Nav = React.memo((props: HeaderProps) => {
  const { title, scrollY, onShowInfo, onBack } = props;
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const renderNav = useCallback(() => {
    return (
      <View style={[styles.row, { marginTop: insets.top }]}>
        <TouchableOpacity onPress={onBack}>
          <Icon name="arrow-back" size={24} color={'#fff'} />
        </TouchableOpacity>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <TouchableOpacity onPress={onShowInfo} style={styles.infoContainer}>
          <Icon name="list" size={24} color={'#fff'} />
          <Text style={styles.infoText}>{t('pitcher_ranking.info')}</Text>
        </TouchableOpacity>
      </View>
    );
  }, [insets.top, onBack, onShowInfo, title, t]);

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
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#fff',
  },
});

import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from '../../../hooks/useTranslation';
import { StackNavigationProp } from '@react-navigation/stack';

interface PeakRecordPromoProps {
  navigation: StackNavigationProp<any>;
}

export const PeakRecordPromo = React.memo((props: PeakRecordPromoProps) => {
  const { navigation } = props;
  const { t } = useTranslation();

  const navigateToPeakRecord = useCallback(() => {
    navigation.navigate('PeakRecord');
  }, [navigation]);

  return (
    <TouchableOpacity onPress={navigateToPeakRecord}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.peakRecordGradient}
      >
        <View style={styles.peakRecordContainer}>
          <FontAwesome5 name="crown" size={15} color="#fff" style={styles.peakRecordIcon} />
          <View style={styles.peakRecordTextContainer}>
            <Text style={styles.peakRecordTitle}>{t('home.peakRecordTitle')}</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={15} color="#fff" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  peakRecordGradient: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 5,
  },
  peakRecordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  peakRecordIcon: {
    marginRight: 5,
  },
  peakRecordTextContainer: {
    flex: 1,
  },
  peakRecordTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});

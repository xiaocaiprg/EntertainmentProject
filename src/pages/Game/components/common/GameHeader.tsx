import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { STATUS_BAR_HEIGHT } from '../../../../utils/platform';
import CustomText from '../../../../components/CustomText';

interface GameHeaderProps {
  title: string;
  navigation?: StackNavigationProp<any>;
}

export const GameHeader: React.FC<GameHeaderProps> = React.memo((props) => {
  const { title, navigation } = props;

  const handleGoBack = useCallback(() => {
    navigation?.goBack();
  }, [navigation]);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#111" />
      </TouchableOpacity>
      <CustomText style={styles.headerTitle}>{title}</CustomText>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 20 + STATUS_BAR_HEIGHT,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 15,
    color: '#111',
  },
});

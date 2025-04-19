import React, { useCallback, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '../../hooks/useTranslation';
import { LanguageContext } from '../../context/LanguageContext';
import { STATUS_BAR_HEIGHT, isIOS } from '../../utils/platform';

interface LanguageOption {
  value: string;
  label: string;
}

const languageOptions: LanguageOption[] = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
];
export const SettingsScreen = React.memo(() => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useContext(LanguageContext);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleChangeLanguage = useCallback(
    async (language: string) => {
      await changeLanguage(language);
    },
    [changeLanguage],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack}>
            <Icon name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('settings.settings')}</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={{ padding: 10 }}>
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>{`${t('settings.language')}:`}</Text>
            <View style={styles.languageOptions}>
              {languageOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.languageOption, currentLanguage === option.value && styles.selectedLanguage]}
                  onPress={() => handleChangeLanguage(option.value)}
                >
                  <Text style={[styles.languageText, currentLanguage === option.value && styles.selectedLanguageText]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: isIOS() ? 0 : STATUS_BAR_HEIGHT,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f3fe',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    width: 100,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  languageOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  languageOption: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    paddingVertical: 5,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedLanguage: {
    backgroundColor: '#6c5ce7',
    borderColor: '#6c5ce7',
  },
  languageText: {
    fontSize: 15,
    color: '#333',
  },
  selectedLanguageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

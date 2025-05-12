import React, { useCallback, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from '../../hooks/useTranslation';
import { LanguageContext } from '../../context/LanguageContext';
import { STATUS_BAR_HEIGHT, isIOS } from '../../utils/platform';
import { RootStackScreenProps } from '../router';

interface LanguageOption {
  value: string;
  label: string;
}

const languageOptions: LanguageOption[] = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
];

// 使用导航堆栈中定义的类型
type SettingsScreenProps = RootStackScreenProps<'Settings'>;

export const SettingsScreen: React.FC<SettingsScreenProps> = React.memo((props) => {
  const { navigation } = props;
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

  const navigateToAccountSecurity = useCallback(() => {
    navigation.navigate('AccountSecurity');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Icon name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings.settings')}</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.contentContainer}>
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

        <View style={styles.divider} />

        <TouchableOpacity style={styles.settingItem} onPress={navigateToAccountSecurity}>
          <Text style={styles.settingItemText}>{t('settings.accountSecurity')}</Text>
          <Icon name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingTop: isIOS() ? 0 : STATUS_BAR_HEIGHT,
  },
  header: {
    backgroundColor: '#f4f4f4',
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
  contentContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
  sectionTitle: {
    width: 100,
    fontSize: 15,
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
    marginLeft: 10,
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
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
  settingItemText: {
    fontSize: 15,
    color: '#333',
  },
});

import React, { useCallback, useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from '../../hooks/useTranslation';
import { LanguageContext } from '../../context/LanguageContext';
import { STATUS_BAR_HEIGHT, isIOS } from '../../utils/platform';
import { RootStackScreenProps } from '../router';
import CustomText from '../../components/CustomText';
import UpdateManager from '../../utils/UpdateManager';

interface LanguageOption {
  value: string;
  label: string;
}

const languageOptions: LanguageOption[] = [
  { value: 'zh', label: '中文' },
  { value: 'zhHant', label: '繁體中文' },
  { value: 'en', label: 'English' },
];

// 使用导航堆栈中定义的类型
type SettingsScreenProps = RootStackScreenProps<'Settings'>;

export const SettingsScreen: React.FC<SettingsScreenProps> = React.memo((props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useContext(LanguageContext);
  const [updateText, setUpdateText] = useState('');

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

  const navigateToPaymentManager = useCallback(() => {
    navigation.navigate('PaymentManager');
  }, [navigation]);

  const handleCheckUpdate = useCallback(async () => {
    ToastAndroid.show('正在检查更新...', ToastAndroid.SHORT);

    try {
      const versionInfo = await UpdateManager.checkVersionInfo();

      if (versionInfo.hasUpdate) {
        // 触发更新流程
        UpdateManager.checkUpdate();
      } else {
        setUpdateText(t('settings.checkUpdateNoUpdate'));
      }
    } catch (error) {}
  }, [t]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Icon name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>{t('settings.settings')}</CustomText>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.container}>
          <View style={styles.content}>
            <CustomText style={styles.sectionTitle}>{`${t('settings.language')}:`}</CustomText>
            <View style={styles.languageOptions}>
              {languageOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.languageOption, currentLanguage === option.value && styles.selectedLanguage]}
                  onPress={() => handleChangeLanguage(option.value)}
                >
                  <CustomText
                    style={[styles.languageText, currentLanguage === option.value && styles.selectedLanguageText]}
                  >
                    {option.label}
                  </CustomText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingItem} onPress={navigateToAccountSecurity}>
            <CustomText style={styles.settingItemText}>{t('settings.accountSecurity')}</CustomText>
            <Icon name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingItem} onPress={navigateToPaymentManager}>
            <CustomText style={styles.settingItemText}>{t('settings.paymentManager')}</CustomText>
            <Icon name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingItem} onPress={handleCheckUpdate}>
            <CustomText style={styles.settingItemText}>{t('settings.checkUpdate')}</CustomText>
            <View style={styles.updateTextContainer}>
              <CustomText style={[styles.settingItemText, { color: '#757676' }]}>{updateText}</CustomText>
              <Icon name="chevron-right" size={24} color="#666" />
            </View>
          </TouchableOpacity>
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
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 10,
  },
  container: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    alignItems: 'center',
  },
  languageOption: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  selectedLanguage: {
    backgroundColor: '#6c5ce7',
    borderColor: '#6c5ce7',
  },
  languageText: {
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  selectedLanguageText: {
    color: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: '#f4f4f4',
    marginHorizontal: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#fff',
  },
  settingItemText: {
    fontSize: 15,
    color: '#333',
  },
  updateTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

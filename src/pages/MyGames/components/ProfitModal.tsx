import React, { useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GameMatchProfitDto } from '../../../interface/Game';
import { THEME_COLORS } from '../../../utils/styles';
import { SlideModal } from '../../../components/SlideModal';
import { useTranslation } from '../../../hooks/useTranslation';
import CustomText from '../../../components/CustomText';
interface ProfitModalProps {
  visible: boolean;
  onClose: () => void;
  profit: GameMatchProfitDto | null;
  loading?: boolean;
}

export const ProfitModal = React.memo((props: ProfitModalProps) => {
  const { visible, onClose, profit, loading = false } = props;
  const { t } = useTranslation();
  const renderInvestCompanyProfit = useCallback(
    (profitData: GameMatchProfitDto) => {
      if (!profitData.investCompanyProfitDtoList || profitData.investCompanyProfitDtoList.length === 0) {
        return null;
      }
      return (
        <>
          <View style={styles.divider} />
          <CustomText style={styles.sectionTitle}>{t('myGames.investCompanyProfitDetails')}</CustomText>
          {profitData.investCompanyProfitDtoList.map((company, index) => (
            <View key={index} style={styles.profitItem}>
              <CustomText style={styles.profitLabel}>{company.name}</CustomText>
              <CustomText style={styles.profitValue}>{company.profitStr}</CustomText>
            </View>
          ))}
        </>
      );
    },
    [t],
  );
  const renderInvestPersonMyGames = useCallback(
    (profitData: GameMatchProfitDto) => {
      if (!profitData.investPersonProfitDtoList || profitData.investPersonProfitDtoList.length === 0) {
        return null;
      }
      return (
        <>
          <View style={styles.divider} />
          <CustomText style={styles.sectionTitle}>{t('myGames.investPersonProfitDetails')}</CustomText>
          {profitData.investPersonProfitDtoList.map((person, index) => (
            <View key={index} style={styles.profitItem}>
              <CustomText style={styles.profitLabel}>{person.investPersonName}</CustomText>
              <CustomText style={styles.profitValue}>{person.profitStr}</CustomText>
            </View>
          ))}
        </>
      );
    },
    [t],
  );
  const renderDocCompanyProfit = useCallback(
    (profitData: GameMatchProfitDto) => {
      if (!profitData.docCompanyProfitDtoList || profitData.docCompanyProfitDtoList.length === 0) {
        return null;
      }
      return (
        <>
          <View style={styles.divider} />
          <CustomText style={styles.sectionTitle}>{t('myGames.companyProfitDetails')}</CustomText>
          {profitData.docCompanyProfitDtoList.map((company, index) => (
            <View key={index} style={styles.profitItem}>
              <CustomText style={styles.profitLabel}>{company.name}</CustomText>
              <CustomText style={styles.profitValue}>{company.profitStr}</CustomText>
            </View>
          ))}
        </>
      );
    },
    [t],
  );

  const renderContent = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          <CustomText style={styles.loadingText}>{t('myGames.loadingDetails')}</CustomText>
        </View>
      );
    }

    if (!profit) {
      return (
        <View style={styles.noProfitContainer}>
          <Icon name="info" size={40} color="#ccc" />
          <CustomText style={styles.noProfitText}>{t('myGames.noProfitInfo')}</CustomText>
        </View>
      );
    }

    return (
      <View style={styles.profitContent}>
        <View style={styles.profitItem}>
          <CustomText style={styles.profitLabel}>{`${t('myGames.investCompany')}`}</CustomText>
          <CustomText style={styles.profitValue}>{profit.investCompanyProfitStr}</CustomText>
        </View>
        <View style={styles.profitItem}>
          <CustomText style={styles.profitLabel}>{`${t('myGames.docCompany')}`}</CustomText>
          <CustomText style={styles.profitValue}>{profit.docCompanyProfitStr}</CustomText>
        </View>
        <View style={styles.profitItem}>
          <CustomText style={styles.profitLabel}>{`${t('myGames.operationCompany')}:${
            profit.operationCompanyName
          }`}</CustomText>
          <CustomText style={styles.profitValue}>{profit.operationCompanyProfitStr}</CustomText>
        </View>
        <View style={styles.profitItem}>
          <CustomText style={styles.profitLabel}>{`${t('myGames.playerCompany')}:${
            profit.playCompanyName
          }`}</CustomText>
          <CustomText style={styles.profitValue}>{profit.playCompanyProfitStr}</CustomText>
        </View>
        {renderInvestCompanyProfit(profit)}
        {renderInvestPersonMyGames(profit)}
        {renderDocCompanyProfit(profit)}
      </View>
    );
  }, [loading, profit, renderInvestPersonMyGames, renderDocCompanyProfit, renderInvestCompanyProfit, t]);

  return (
    <SlideModal visible={visible} onClose={onClose} title={t('myGames.profitDetails')}>
      {renderContent()}
    </SlideModal>
  );
});

const styles = StyleSheet.create({
  profitContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
  },
  profitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  profitLabel: {
    fontSize: 15,
    color: THEME_COLORS.text.secondary,
    flex: 1,
  },
  profitValue: {
    fontSize: 15,
    fontWeight: '500',
    color: THEME_COLORS.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: THEME_COLORS.text.primary,
  },
  noProfitContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noProfitText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: THEME_COLORS.text.secondary,
    marginTop: 15,
  },
});

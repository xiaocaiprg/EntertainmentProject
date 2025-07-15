import React, { useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomText from '../../../../components/CustomText';
import SlideModal from '../../../../components/SlideModal';
import { THEME_COLORS } from '../../../../utils/styles';
import { PaymentSourceType } from '../../../../interface/Common';

/**
 * 支付方式选项
 */
const PAYMENT_OPTIONS = [
  {
    label: '积分',
    value: PaymentSourceType.AVAILABLE_POINTS,
  },
  {
    label: '额度',
    value: PaymentSourceType.CREDIT_POINTS,
  },
];

interface PaymentMethodSelectorProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (paymentType: PaymentSourceType) => void;
  isSubmitting: boolean;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = React.memo((props) => {
  const { visible, onClose, onConfirm, isSubmitting } = props;
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentSourceType>(PaymentSourceType.AVAILABLE_POINTS);

  const handlePaymentTypeSelect = useCallback((type: PaymentSourceType) => {
    setSelectedPaymentType(type);
  }, []);

  const handleConfirm = useCallback(() => {
    onConfirm(selectedPaymentType);
  }, [onConfirm, selectedPaymentType]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const renderContent = useCallback(() => {
    return (
      <View style={styles.container}>
        <CustomText style={styles.title}>请选择支付方式</CustomText>

        {PAYMENT_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[styles.paymentOption, selectedPaymentType === option.value && styles.selectedPaymentOption]}
            onPress={() => handlePaymentTypeSelect(option.value)}
          >
            <View style={styles.paymentOptionContent}>
              <CustomText
                style={[
                  styles.paymentOptionText,
                  selectedPaymentType === option.value && styles.selectedPaymentOptionText,
                ]}
              >
                {option.label}
              </CustomText>
              {selectedPaymentType === option.value && <Icon name="check" size={20} color={THEME_COLORS.primary} />}
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <CustomText style={styles.confirmButtonText}>确认出资</CustomText>
          )}
        </TouchableOpacity>
      </View>
    );
  }, [selectedPaymentType, handlePaymentTypeSelect, handleConfirm, isSubmitting]);

  return (
    <SlideModal visible={visible} onClose={handleClose} title="选择支付方式">
      {renderContent()}
    </SlideModal>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  paymentOption: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  selectedPaymentOption: {
    borderColor: THEME_COLORS.primary,
    backgroundColor: '#f0f8ff',
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentOptionText: {
    fontSize: 15,
    color: THEME_COLORS.text.primary,
  },
  selectedPaymentOptionText: {
    color: THEME_COLORS.primary,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: THEME_COLORS.primary,
    borderRadius: 8,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentMethodSelector;

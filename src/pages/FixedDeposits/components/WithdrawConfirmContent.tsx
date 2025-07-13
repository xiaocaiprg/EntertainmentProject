import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '../../../components/CustomText';
import CustomTextInput from '../../../components/CustomTextInput';
import PayPasswordInput from '../../../bizComponents/PayPasswordInput';
import { FixAccountDto } from '../../../interface/Account';

interface WithdrawConfirmContentProps {
  selectedDeposit: FixAccountDto | null;
  withdrawAmount: string;
  onWithdrawAmountChange: (amount: string) => void;
  withdrawAmountError: string;
  payPassword: string;
  onPayPasswordChange: (password: string) => void;
}

export const WithdrawConfirmContent: React.FC<WithdrawConfirmContentProps> = React.memo((props) => {
  const {
    selectedDeposit,
    withdrawAmount,
    onWithdrawAmountChange,
    withdrawAmountError,
    payPassword,
    onPayPasswordChange,
  } = props;

  return (
    <View>
      {/* 支取金额输入 */}
      <View style={styles.withdrawAmountContainer}>
        <CustomText style={styles.withdrawAmountLabel}>支取金额:</CustomText>
        <CustomTextInput
          style={[styles.withdrawAmountInput, withdrawAmountError ? styles.inputError : null]}
          value={withdrawAmount}
          onChangeText={onWithdrawAmountChange}
          placeholder="请输入支取金额"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
        {withdrawAmountError ? <CustomText style={styles.errorText}>{withdrawAmountError}</CustomText> : null}
        {selectedDeposit && <CustomText style={styles.amountHint}>可支取金额: {selectedDeposit.amount}</CustomText>}
      </View>

      {/* 支付密码输入 */}
      <View style={styles.payPasswordContainer}>
        <CustomText style={styles.payPasswordLabel}>支付密码:</CustomText>
        <PayPasswordInput value={payPassword} onChangeText={onPayPasswordChange} maxLength={6} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  withdrawAmountContainer: {
    marginBottom: 15,
  },
  withdrawAmountLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  withdrawAmountInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 5,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    fontSize: 12,
    color: '#e74c3c',
    marginBottom: 5,
  },
  amountHint: {
    fontSize: 12,
    color: '#666',
  },
  payPasswordContainer: {
    marginTop: 15,
  },
  payPasswordLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    fontWeight: '500',
  },
});

export default WithdrawConfirmContent;

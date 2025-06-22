import React, { useState, useRef, useCallback } from 'react';
import { View, TextInput, StyleSheet, ViewStyle } from 'react-native';
import CustomText from '../../../components/CustomText';

interface PayPasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  maxLength?: number;
  placeholder?: string;
  errorMessage?: string;
  style?: ViewStyle;
}

const PayPasswordInput: React.FC<PayPasswordInputProps> = React.memo((props) => {
  const { value, onChangeText, maxLength = 6, errorMessage, style } = props;
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handlePress = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleChangeText = useCallback(
    (text: string) => {
      // 只允许数字
      const numericText = text.replace(/[^0-9]/g, '');
      if (numericText.length <= maxLength) {
        onChangeText(numericText);
      }
    },
    [onChangeText, maxLength],
  );

  const renderBoxes = useCallback(() => {
    const boxes = [];
    for (let i = 0; i < maxLength; i++) {
      const hasValue = i < value.length;
      const isActive = isFocused && i === value.length;
      boxes.push(
        <View key={i} style={[styles.boxContainer, isActive && styles.activeBox]}>
          {hasValue && <View style={styles.dot} />}
        </View>,
      );
    }
    return boxes;
  }, [value.length, maxLength, isFocused]);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputContainer} onTouchStart={handlePress}>
        <TextInput
          ref={inputRef}
          style={styles.hiddenInput}
          value={value}
          onChangeText={handleChangeText}
          keyboardType="numeric"
          secureTextEntry={false}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder=""
        />
        <View style={styles.boxesContainer}>{renderBoxes()}</View>
      </View>
      {errorMessage ? <CustomText style={styles.errorText}>{errorMessage}</CustomText> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  inputContainer: {
    position: 'relative',
    height: 50,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
  },
  boxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 10,
  },
  boxContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  activeBox: {
    borderColor: '#6c5ce7',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default PayPasswordInput;

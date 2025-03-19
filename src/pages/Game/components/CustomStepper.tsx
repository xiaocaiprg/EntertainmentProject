import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * 步进器组件属性类型
 */
interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

/**
 * 自定义步进器组件
 */
export const CustomStepper: React.FC<StepperProps> = React.memo(({ value, onChange, min, max }) => {
  const handleDecrease = useCallback((): void => {
    if (value > min) {
      onChange(value - 1);
    }
  }, [value, min, onChange]);

  const handleIncrease = useCallback((): void => {
    if (value < max) {
      onChange(value + 1);
    }
  }, [value, max, onChange]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, value <= min ? styles.disabled : {}]}
        onPress={handleDecrease}
        disabled={value <= min}
      >
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
      </View>
      <TouchableOpacity
        style={[styles.button, value >= max ? styles.disabled : {}]}
        onPress={handleIncrease}
        disabled={value >= max}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
    width: 120,
  },
  button: {
    width: 36,
    height: 36,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  valueContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: 36,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  disabled: {
    opacity: 0.5,
  },
});

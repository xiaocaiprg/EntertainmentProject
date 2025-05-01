import React, { useCallback, useMemo, useEffect } from 'react';
import { Modal, StyleSheet, TouchableOpacity, ScrollView, Animated, GestureResponderEvent, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export interface OverlayModalProps {
  visible: boolean;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  height?: number | `${number}%`;
  showCloseButton?: boolean;
  onSelect?: (item: any) => void;
  onClose: () => void;
  backgroundFromTop?: number;
}

export const OverlayModal = React.memo((props: OverlayModalProps) => {
  const { visible, onClose, children, position = 'bottom', height = '50%', showCloseButton, backgroundFromTop } = props;

  const slideAnim = React.useRef(new Animated.Value(0)).current;

  const handleClose = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  }, [onClose, slideAnim]);

  const handleContainerPress = useCallback(
    (e: GestureResponderEvent) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose],
  );

  const contentContainerStyle = useMemo(() => {
    const baseStyle = {
      ...styles.contentContainer,
      height,
    };

    if (position === 'top') {
      return {
        ...baseStyle,
        top: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
      };
    } else {
      return {
        ...baseStyle,
        bottom: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      };
    }
  }, [position, height]);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.modalContainer}>
        {backgroundFromTop !== undefined && (
          <TouchableOpacity activeOpacity={1} onPress={handleClose}>
            <View style={{ height: backgroundFromTop, backgroundColor: 'transparent' }} />
          </TouchableOpacity>
        )}
        <TouchableOpacity activeOpacity={1} style={styles.overlayContainer} onPress={handleContainerPress}>
          <Animated.View style={contentContainerStyle}>
            {showCloseButton && (
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Icon name="close" size={20} color="#000" />
              </TouchableOpacity>
            )}
            <ScrollView style={styles.scrollContent}>{children}</ScrollView>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flex: 1,
  },
});

export default OverlayModal;

import React, { useState, useCallback, useEffect } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, PermissionsAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomText from './CustomText';
import { fileUpload } from '../api/services/commonService';
import { uploadMatchFile } from '../api/services/gameService';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import { THEME_COLORS } from '../utils/styles';
import { isAndroid } from '../utils/platform';
import { useTranslation } from '../hooks/useTranslation';

interface ImageUploadModalProps {
  visible: boolean;
  onClose: () => void;
  matchId: number | null;
  onUploadSuccess?: () => void;
  onUploadFail?: () => void;
  existingImages?: string[];
}

interface ImageItem {
  uri: string;
  isExisting: boolean;
  id?: string; // 用于标识已有图片
}

const getImageUploadParam = (img: { uri: string }) => {
  return {
    file: {
      uri: img.uri,
      name: `photo_${Date.now()}.jpg`,
      type: 'image/jpeg',
    },
  };
};

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  visible,
  onClose,
  matchId,
  onUploadSuccess,
  onUploadFail,
  existingImages = [],
}) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const { t } = useTranslation();

  // 初始化图片列表，将已有图片转换为ImageItem格式
  useEffect(() => {
    const existingImageItems: ImageItem[] = existingImages.map((url, index) => ({
      uri: url,
      isExisting: true,
      id: `existing-${index}`,
    }));
    setImages(existingImageItems);
  }, [existingImages]);

  const handlePickImage = useCallback(
    async (fromCamera: boolean) => {
      const requestAndroidCameraPermission = async () => {
        if (isAndroid()) {
          try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
              title: t('myGames.cameraPermissionTitle'),
              message: t('myGames.cameraPermissionMessage'),
              buttonNeutral: t('common.askMeLater'),
              buttonNegative: t('common.cancel'),
              buttonPositive: t('common.ok'),
            });
            return granted === PermissionsAndroid.RESULTS.GRANTED;
          } catch (err) {
            console.warn(err);
            return false;
          }
        }
        return true;
      };

      try {
        if (fromCamera) {
          const hasPermission = await requestAndroidCameraPermission();
          if (!hasPermission) {
            Alert.alert(t('common.permissionDenied'), t('myGames.cameraPermissionDenied'));
            return;
          }
        }

        const picker = fromCamera ? launchCamera : launchImageLibrary;
        const result = await picker({ mediaType: 'photo', selectionLimit: 0 });
        const assets = result.assets ?? [];
        if (assets.length > 0) {
          const newImages: ImageItem[] = assets.map((a: Asset) => ({
            uri: a.uri || '',
            isExisting: false,
          }));
          setImages((prev) => [...prev, ...newImages]);
        }
      } catch (error) {
        console.error('Image picker error:', error);
      }
    },
    [t],
  );

  const handleRemoveImage = useCallback((idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleUpload = useCallback(async () => {
    if (!matchId) {
      return;
    }
    setUploading(true);
    try {
      // 分离已有图片和新图片
      const existingImageUrls = images.filter((img) => img.isExisting).map((img) => img.uri);

      const newImages = images.filter((img) => !img.isExisting);

      // 上传新图片到S3
      const uploadedNewImages = await Promise.all(
        newImages.map(async (img) => {
          const fileObj = getImageUploadParam(img);
          const url = await fileUpload(fileObj);
          return url;
        }),
      );
      // 合并已有图片和新上传的图片
      const allImageUrls = [...existingImageUrls, ...uploadedNewImages];
      // 调用uploadMatchFile进行全量更新
      await uploadMatchFile({ id: matchId, fileUrlList: allImageUrls });
      Alert.alert(t('common.success'), t('myGames.uploadSuccess'));
      setImages([]);
      // 抛出上传成功事件
      onUploadSuccess?.();
    } catch (e: any) {
      Alert.alert(t('common.error'), e.message);
      onUploadFail?.();
    }
    setUploading(false);
  }, [images, matchId, onUploadSuccess, onUploadFail, t]);

  // 处理关闭弹窗
  const handleClose = useCallback(() => {
    if (!uploading) {
      onClose();
    }
  }, [uploading, onClose]);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <CustomText style={styles.title}>{t('myGames.uploadImage')}</CustomText>
            <TouchableOpacity onPress={handleClose} disabled={uploading}>
              <Icon name="close" size={24} color={uploading ? THEME_COLORS.text.light : THEME_COLORS.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* 图片说明 */}
          <View style={styles.infoContainer}>
            <CustomText style={styles.infoText}>{t('myGames.imageUploadInfo')}</CustomText>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
            {images.map((img, idx) => (
              <View key={img.id || `new-${idx}`} style={styles.imageWrapper}>
                <Image source={{ uri: img.uri }} style={styles.image} />
                <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemoveImage(idx)} disabled={uploading}>
                  <Icon name="cancel" size={20} color={uploading ? THEME_COLORS.text.light : THEME_COLORS.danger} />
                </TouchableOpacity>
                {img.isExisting && (
                  <View style={styles.existingTag}>
                    <CustomText style={styles.existingTagText}>{t('myGames.existing')}</CustomText>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={[styles.addBtn, uploading && styles.disabledBtn]}
              onPress={() => handlePickImage(false)}
              disabled={uploading}
            >
              <Icon
                name="photo-library"
                size={36}
                color={uploading ? THEME_COLORS.text.light : THEME_COLORS.text.light}
              />
              <CustomText style={[styles.addBtnText, uploading && styles.disabledText]}>
                {t('myGames.fromGallery')}
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addBtn, uploading && styles.disabledBtn]}
              onPress={() => handlePickImage(true)}
              disabled={uploading}
            >
              <Icon
                name="photo-camera"
                size={36}
                color={uploading ? THEME_COLORS.text.light : THEME_COLORS.text.light}
              />
              <CustomText style={[styles.addBtnText, uploading && styles.disabledText]}>
                {t('myGames.takePhoto')}
              </CustomText>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.uploadBtn, uploading && styles.disabledBtn]}
            onPress={handleUpload}
            disabled={uploading}
          >
            <CustomText style={styles.uploadBtnText}>
              {uploading ? t('common.uploading') : t('common.submit')}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: THEME_COLORS.background,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 10,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.border.light,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
  },
  infoContainer: {
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  infoText: {
    fontSize: 14,
    color: THEME_COLORS.text.secondary,
    lineHeight: 20,
  },
  imageScroll: {
    paddingVertical: 10,
  },
  imageWrapper: {
    width: 90,
    height: 90,
    marginRight: 10,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME_COLORS.border.medium,
  },
  removeBtn: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  existingTag: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  existingTagText: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
  },
  addBtn: {
    width: 90,
    height: 90,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME_COLORS.border.medium,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#f8f9fa',
  },
  addBtnText: {
    marginTop: 5,
    fontSize: 12,
    color: THEME_COLORS.text.light,
  },
  statsContainer: {
    marginTop: 10,
    paddingHorizontal: 5,
  },
  statsText: {
    fontSize: 14,
    color: THEME_COLORS.text.secondary,
    textAlign: 'center',
  },
  uploadBtn: {
    width: '100%',
    backgroundColor: THEME_COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledBtn: {
    backgroundColor: THEME_COLORS.disabled,
  },
  uploadBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    color: THEME_COLORS.text.light,
  },
});

export default ImageUploadModal;

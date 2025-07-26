import React, { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import ImageView from 'react-native-image-viewing';
import CustomText from '../../../../components/CustomText';
import { useTranslation } from '../../../../hooks/useTranslation';

interface ImageGalleryProps {
  fileUrlList?: string[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = React.memo(({ fileUrlList }) => {
  const { t } = useTranslation();
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  // 渲染图片项
  const renderImageItem = useCallback(({ item, index }: { item: string; index: number }) => {
    const handleImagePress = () => {
      setImageIndex(index);
      setImageViewerVisible(true);
    };

    return (
      <TouchableOpacity style={styles.imageItem} onPress={handleImagePress} activeOpacity={0.8}>
        <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
      </TouchableOpacity>
    );
  }, []);

  // 关闭图片查看器
  const handleCloseImageViewer = useCallback(() => {
    setImageViewerVisible(false);
  }, []);

  // 如果没有图片，不渲染任何内容
  if (!fileUrlList || fileUrlList.length === 0) {
    return null;
  }

  return (
    <>
      <View style={styles.imageGalleryContainer}>
        <CustomText style={styles.sectionTitle}>{t('challengeDetail.uploadedImages')}</CustomText>
        <FlatList
          data={fileUrlList}
          renderItem={renderImageItem}
          keyExtractor={(item, index) => `image-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imageListContainer}
        />
      </View>

      {/* 图片查看器 */}
      <ImageView
        images={fileUrlList.map((url) => ({ uri: url }))}
        imageIndex={imageIndex}
        visible={imageViewerVisible}
        onRequestClose={handleCloseImageViewer}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
        backgroundColor="rgba(0, 0, 0, 0.9)"
        animationType="fade"
        presentationStyle="fullScreen"
      />
    </>
  );
});

const styles = StyleSheet.create({
  imageGalleryContainer: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  imageListContainer: {},
  imageItem: {
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  image: {
    width: 80,
    height: 80,
  },
});

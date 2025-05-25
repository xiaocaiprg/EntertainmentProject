import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { View, ScrollView, TouchableOpacity, ImageBackground, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from '../../../hooks/useTranslation';
import { SCREEN_WIDTH } from '../../../utils/platform';
import CustomText from '../../../components/CustomText';

export const HotActivities = React.memo(() => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  // 模拟热门活动数据
  const activities = useMemo(
    () => [
      {
        id: 1,
        title: '周末锦标赛',
        image: 'https://junlongpro.s3.ap-southeast-1.amazonaws.com/banner1.png',
        date: '2025',
      },
      {
        id: 2,
        title: '会员专享活动',
        image: 'https://junlongpro.s3.ap-southeast-1.amazonaws.com/banner2.png',
        date: '2025',
      },
    ],
    [],
  );

  const scaleValues = useRef(activities.map(() => new Animated.Value(1))).current; // Initialize scale animated values for each card

  const cardWidth = 240;
  const cardMargin = 15;
  const snapToInterval = cardWidth + cardMargin;

  const handleScroll = useCallback(
    (event: any) => {
      const scrollPosition = event.nativeEvent.contentOffset.x;
      const firstItemPadding = (SCREEN_WIDTH - (cardWidth + cardMargin * 2)) / 2;
      const adjustedScrollPosition = scrollPosition + firstItemPadding;
      const currentIndex = Math.max(0, Math.round(adjustedScrollPosition / snapToInterval));
      setActiveIndex(currentIndex);
    },
    [snapToInterval, cardWidth, cardMargin],
  );

  useEffect(() => {
    activities.forEach((_, index) => {
      Animated.spring(scaleValues[index], {
        toValue: index === activeIndex ? 1 : 0.9,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }).start();
    });
  }, [activeIndex, activities, scaleValues]);

  return (
    <View style={styles.hotActivitiesContainer}>
      <CustomText style={styles.sectionTitle}>{t('home.hotActivities')}</CustomText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={snapToInterval}
        snapToAlignment="start"
        contentContainerStyle={styles.scrollViewContent}
      >
        {activities.map((activity, index) => {
          return (
            <Animated.View
              key={activity.id}
              style={[styles.activityCard, { transform: [{ scale: scaleValues[index] }] }]}
            >
              <TouchableOpacity onPress={() => setActiveIndex(index)} style={{ flex: 1 }}>
                <ImageBackground source={{ uri: activity.image }} style={styles.activityImage}>
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']}>
                    <View style={styles.activityContent}>
                      <CustomText style={styles.activityTitle}>{activity.title}</CustomText>
                      <CustomText style={styles.activityDate}>{activity.date}</CustomText>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  hotActivitiesContainer: {
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  scrollViewContent: {
    paddingHorizontal: 5,
  },
  activityCard: {
    width: 240,
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
  },
  activityImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  activityContent: {
    padding: 10,
  },
  activityTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  activityDate: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
});

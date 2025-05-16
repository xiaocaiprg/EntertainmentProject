import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from '../../../hooks/useTranslation';

export const HotActivities = React.memo(() => {
  const { t } = useTranslation();

  // 模拟热门活动数据
  const activities = useMemo(
    () => [
      {
        id: 1,
        title: '周末锦标赛',
        image:
          'https://images.unsplash.com/photo-1518998053901-5348d3961a04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Y2FzaW5vfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
        date: '2023-06-10',
      },
      {
        id: 2,
        title: 'VIP专享活动',
        image:
          'https://images.unsplash.com/photo-1566694271452-944f28ed4d6a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2FzaW5vfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
        date: '2023-06-15',
      },
    ],
    [],
  );

  return (
    <View style={styles.hotActivitiesContainer}>
      <Text style={styles.sectionTitle}>{t('home.hotActivities')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activitiesScrollView}>
        {activities.map((activity) => (
          <TouchableOpacity key={activity.id} style={styles.activityCard}>
            <ImageBackground source={{ uri: activity.image }} style={styles.activityImage}>
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.activityGradient}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  hotActivitiesContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  activitiesScrollView: {
    marginTop: 5,
  },
  activityCard: {
    width: 240,
    height: 140,
    borderRadius: 12,
    marginRight: 15,
    overflow: 'hidden',
  },
  activityImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  activityGradient: {
    padding: 15,
    justifyContent: 'flex-end',
    height: 80,
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

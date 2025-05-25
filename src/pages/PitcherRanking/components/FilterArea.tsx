import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { OverlayModal } from '../../../components/OverlayModal';
import { THEME_COLORS } from '../../../utils/styles';
import { useTranslation } from '../../../hooks/useTranslation';
import { getAddressList } from '../../../api/services/gameService';
import { AddressInfo } from '../../../interface/Game';
import { isIOS } from '../../../utils/platform';
import CustomText from '../../../components/CustomText';

interface FilterAreaProps {
  selectedTimeRange: number;
  onTimeRangeChange: (timeRange: number) => void;
  selectedLocation: number;
  onLocationChange: (locationId: number) => void;
}
const LOCATION_MODAL_HEIGHT = 30;

export const FilterArea = React.memo((props: FilterAreaProps) => {
  const { selectedTimeRange, onTimeRangeChange, selectedLocation, onLocationChange } = props;

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [filterAreaTop, setFilterAreaTop] = useState(0);
  const [locations, setLocations] = useState<AddressInfo[]>([]);

  const filterAreaRef = useRef<View>(null);
  const { t } = useTranslation();

  const timeRangeOptions = useMemo(
    () => [
      { id: 1, label: '1天' },
      { id: 3, label: '3天' },
      { id: 7, label: '7天' },
      { id: 30, label: '30天' },
      { id: 90, label: '90天' },
      { id: 180, label: '180天' },
    ],
    [],
  );

  useEffect(() => {
    getAddressList({ pageNum: 1, pageSize: 999 }).then((res) => {
      setLocations(res?.records || []);
    });
  }, []);

  // 测量筛选区域位置
  useEffect(() => {
    if (filterAreaRef.current && showLocationModal) {
      filterAreaRef.current.measure((x, y, width, height, pageX, pageY) => {
        setFilterAreaTop(pageY);
      });
    }
  }, [showLocationModal]);

  // 获取当前选中的地点名称
  const selectedLocationName = useMemo(() => {
    if (selectedLocation === -1) {
      return t('pitcher_ranking.selectLocation');
    }
    if (selectedLocation === 0) {
      return t('pitcher_ranking.allLocations');
    }
    if (selectedLocation > 0 && locations.length > 0) {
      const selected = locations.find((item) => item.id === selectedLocation);
      return selected?.name || t('pitcher_ranking.selectLocation');
    }
    return t('pitcher_ranking.selectLocation');
  }, [selectedLocation, locations, t]);

  const handleSelectLocation = useCallback(
    (id?: number) => {
      id !== undefined && onLocationChange(id);
      setShowLocationModal(false);
    },
    [onLocationChange],
  );

  const handleSelectAllLocations = useCallback(() => {
    onLocationChange(0);
    setShowLocationModal(false);
  }, [onLocationChange]);

  return (
    <>
      <View style={styles.filterContainer} ref={filterAreaRef}>
        <TouchableOpacity style={styles.locationSelector} onPress={() => setShowLocationModal(true)}>
          <CustomText style={styles.locationText}>{selectedLocationName}</CustomText>
          <Icon name="arrow-drop-down" size={24} color={THEME_COLORS.primary} />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeRangeContainer}>
        {timeRangeOptions.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.timeRangeItem, selectedTimeRange === item.id && styles.selectedTimeRangeItem]}
            onPress={() => onTimeRangeChange(item.id)}
          >
            <CustomText style={[styles.timeRangeText, selectedTimeRange === item.id && styles.selectedTimeRangeText]}>
              {item.label}
            </CustomText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <OverlayModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        position="top"
        height={350}
        showCloseButton={false}
        backgroundFromTop={isIOS() ? filterAreaTop + LOCATION_MODAL_HEIGHT : filterAreaTop + LOCATION_MODAL_HEIGHT - 25}
      >
        <ScrollView style={styles.locationListContainer}>
          <TouchableOpacity
            style={[styles.locationItem, selectedLocation === 0 && styles.selectedLocationItem]}
            onPress={handleSelectAllLocations}
          >
            <CustomText style={[styles.locationItemText, selectedLocation === 0 && styles.selectedLocationItemText]}>
              {t('pitcher_ranking.allLocations') || '全部'}
            </CustomText>
          </TouchableOpacity>
          {locations.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={[styles.locationItem, selectedLocation === location.id && styles.selectedLocationItem]}
              onPress={() => handleSelectLocation(location.id)}
            >
              <CustomText
                style={[styles.locationItemText, selectedLocation === location.id && styles.selectedLocationItemText]}
              >
                {location.name}
              </CustomText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </OverlayModal>
    </>
  );
});

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 2,
    height: LOCATION_MODAL_HEIGHT,
  },
  locationText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  timeRangeItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  selectedTimeRangeItem: {
    borderBottomColor: THEME_COLORS.primary,
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedTimeRangeText: {
    color: THEME_COLORS.primary,
    fontWeight: '500',
  },
  locationListContainer: {
    flex: 1,
  },
  locationItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedLocationItem: {
    backgroundColor: '#f5f5f5',
  },
  locationItemText: {
    fontSize: 14,
    color: '#333',
  },
  selectedLocationItemText: {
    color: THEME_COLORS.primary,
    fontWeight: '500',
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
});

export default FilterArea;

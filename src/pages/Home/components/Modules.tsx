import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { ModuleConfig, ModuleType } from '../../../interface/Role';
import { useTranslation } from '../../../hooks/useTranslation';
import CustomText from '../../../components/CustomText';

interface ModulesProps {
  accessibleModules: ModuleConfig[];
  navigation: any;
}

export const Modules = React.memo((props: ModulesProps) => {
  const { t } = useTranslation();
  const { accessibleModules, navigation } = props;
  // 分组模块
  const moduleGroups = [
    {
      title: t('home.challengeGroup'),
      modules: accessibleModules.filter((m) =>
        [
          ModuleType.CHALLENGE_NEW,
          ModuleType.CHALLENGE_EXISTING,
          ModuleType.ALL_CHALLENGE,
          ModuleType.CHANGE_RECORDER_CHALLENGE,
          ModuleType.FUNDRAISING_CHALLENGE,
        ].includes(m.type),
      ),
    },
    {
      title: t('home.managementGroup'),
      modules: accessibleModules.filter((m) =>
        [ModuleType.TURNOVER_QUERY, ModuleType.PITCHER_RANKING].includes(m.type),
      ),
    },
    {
      title: t('home.raceGroup'),
      modules: accessibleModules.filter((m) =>
        [ModuleType.CREATE_RACE, ModuleType.ALL_RACE, ModuleType.RACE_POOL_LIST].includes(m.type),
      ),
    },
  ];

  // 构建图标名称映射
  const getIconName = (moduleType: ModuleType) => {
    const iconMap: Record<ModuleType, string> = {
      [ModuleType.CHALLENGE_NEW]: 'plus-circle',
      [ModuleType.CHALLENGE_EXISTING]: 'clipboard-list',
      [ModuleType.ALL_CHALLENGE]: 'list-alt',
      [ModuleType.CHANGE_RECORDER_CHALLENGE]: 'exchange-alt',
      [ModuleType.FUNDRAISING_CHALLENGE]: 'hand-holding-usd',
      [ModuleType.TURNOVER_QUERY]: 'search-dollar',
      [ModuleType.PITCHER_RANKING]: 'trophy',
      [ModuleType.CREATE_RACE]: 'plus-square',
      [ModuleType.ALL_RACE]: 'flag-checkered',
      [ModuleType.RACE_POOL_LIST]: 'coins',
    };

    return iconMap[moduleType] || 'star';
  };
  // 检查登录态和权限并跳转
  const handleModulePress = useCallback(
    (moduleType: ModuleType) => {
      switch (moduleType) {
        case ModuleType.CHALLENGE_NEW:
          navigation.navigate('NewChallenge');
          break;
        case ModuleType.CHALLENGE_EXISTING:
          navigation.navigate('ExistingChallenge');
          break;
        case ModuleType.ALL_CHALLENGE:
          navigation.navigate('AllChallenge');
          break;
        case ModuleType.CHANGE_RECORDER_CHALLENGE:
          navigation.navigate('ChangeRecorderChallenge');
          break;
        case ModuleType.FUNDRAISING_CHALLENGE:
          navigation.navigate('FundraisingChallenge');
          break;
        case ModuleType.TURNOVER_QUERY:
          navigation.navigate('TurnoverQuery');
          break;
        case ModuleType.PITCHER_RANKING:
          navigation.navigate('PitcherRanking');
          break;
        case ModuleType.CREATE_RACE:
          navigation.navigate('CreateRace');
          break;
        case ModuleType.ALL_RACE:
          navigation.navigate('AllRace');
          break;
        case ModuleType.RACE_POOL_LIST:
          navigation.navigate('RacePoolList');
          break;
        default:
          break;
      }
    },
    [navigation],
  );
  // 功能图标数据
  const moduleIcons = useMemo(() => {
    return {
      [ModuleType.CHALLENGE_NEW]: {
        icon: 'plus-circle',
        gradient: ['#4e54c8', '#8f94fb'],
      },
      [ModuleType.CHALLENGE_EXISTING]: {
        icon: 'clipboard-list',
        gradient: ['#11998e', '#38ef7d'],
      },
      [ModuleType.ALL_CHALLENGE]: {
        icon: 'list-alt',
        gradient: ['#f46b45', '#eea849'],
      },
      [ModuleType.CHANGE_RECORDER_CHALLENGE]: {
        icon: 'exchange-alt',
        gradient: ['#614385', '#516395'],
      },
      [ModuleType.FUNDRAISING_CHALLENGE]: {
        icon: 'hand-holding-usd',
        gradient: ['#fc4a1a', '#f7b733'],
      },
      [ModuleType.TURNOVER_QUERY]: {
        icon: 'search-dollar',
        gradient: ['#12c2e9', '#c471ed'],
      },
      [ModuleType.PITCHER_RANKING]: {
        icon: 'trophy',
        gradient: ['#b24592', '#f15f79'],
      },
      [ModuleType.CREATE_RACE]: {
        icon: 'plus-square',
        gradient: ['#2193b0', '#6dd5ed'],
      },
      [ModuleType.ALL_RACE]: {
        icon: 'flag-checkered',
        gradient: ['#ee9ca7', '#ffdde1'],
      },
      [ModuleType.RACE_POOL_LIST]: {
        icon: 'coins',
        gradient: ['#396afc', '#2948ff'],
      },
    };
  }, []);

  return (
    <View style={styles.modulesContainer}>
      {moduleGroups.map(
        (group, groupIndex) =>
          group.modules.length > 0 && (
            <View key={groupIndex}>
              <CustomText style={styles.groupTitle}>{group.title}</CustomText>
              <View style={styles.moduleGrid}>
                {group.modules.map((module) => (
                  <TouchableOpacity
                    key={module.id}
                    onPress={() => handleModulePress(module.type)}
                    style={styles.moduleWrapper}
                  >
                    <LinearGradient
                      colors={moduleIcons[module.type]?.gradient}
                      style={styles.moduleButton}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <FontAwesome5 name={getIconName(module.type)} size={20} color="#fff" solid />
                    </LinearGradient>
                    <CustomText style={styles.moduleButtonText}>{t(module.title)}</CustomText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ),
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  modulesContainer: {
    paddingHorizontal: 20,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  moduleWrapper: {
    width: 70,
    marginRight: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  moduleButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  moduleButtonText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

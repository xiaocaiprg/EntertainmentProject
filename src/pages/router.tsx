import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { PageSource } from '../interface/Points';
import { HomeScreen } from './Home/index';
import { MyScreen } from './MyPages/My/index';
// import { TournamentScreen } from './Tournament/index';
import { AuthScreen } from './Auth/AuthScreen';
import { Game } from './Game/index';
import { NewChallengeScreen } from './Challenge/NewChallenge/index';
import { ExistingChallengeScreen } from './Challenge/ExistingChallenge/index';
import { ChallengeDetail } from './Challenge/ChallengeDetail/index';
import { ChangeRecorderChallenge } from './Challenge/ChangeRecorderChallenge/index';
import { AssignPitcherChallengeScreen } from './Challenge/AssignPitcherChallenge/index';
import { AllChallengeScreen } from './Challenge/AllChallenge/index';
import { FundraisingChallengeScreen } from './Challenge/FundraisingChallenge/index';
import { InvestmentDetailScreen } from './Challenge/InvestmentDetail/index';
import { MyGamesScreen } from './MyPages/MyGames/index';
import { RoundDetailScreen } from './RoundDetail/index';
import { TurnoverQueryScreen } from './TurnoverQuery/index';
import { SettingsScreen } from './Settings/index';
import { AccountSecurity } from './Settings/AccountSecurity';
import { PaymentManager } from './Settings/PaymentManager';
import { PitcherRankingScreen } from './Rank/PitcherRanking/index';
import { MyPointsScreen } from './MyPages/MyPoints/index';
import { PointsTransferScreen } from './Points/PointsTransfer/index';
import { CreditTransferScreen } from './Points/CreditTransfer/index';
import { FrozenPointsScreen } from './Points/FrozenPoints/index';
import { MyProfitScreen } from './MyPages/MyProfit/index';
import { CreateRaceScreen } from './Race/CreateRace/index';
import { AllRaceScreen } from './Race/AllRace/index';
import { RaceDetailScreen } from './Race/RaceDetail/index';
import { RacePoolListScreen } from './Race/RacePoolList/index';
import { PeakRecordScreen } from './Rank/PeakRecord/index';
import { GroupManagementScreen } from './GroupManagement/index';
import { CompanyManagementScreen } from './Company/CompanyManagement/index';
import { CompanyDetailScreen } from './Company/CompanyDetail/index';
import { FixedDepositsScreen } from './FixedDeposits/index';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../context/AuthProvider';
import { RoleProvider } from '../context/RoleContext';
import { LanguageProvider } from '../context/LanguageContext';
import { isIOS } from '../utils/platform';
import { THEME_COLORS } from '../utils/styles';
import { GameRouteParams } from './Game/types/common';
import { useTranslation } from '../hooks/useTranslation';

// 定义导航参数类型
export type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
  Game: GameRouteParams;
  NewChallenge: { raceId?: number };
  ExistingChallenge: undefined;
  ChallengeDetail: { matchId: number };
  AllChallenge: undefined;
  ChangeRecorderChallenge: undefined;
  AssignPitcherChallenge: undefined;
  FundraisingChallenge: undefined;
  InvestmentDetail: { matchId: number };
  MyGames: undefined;
  RoundDetail: { matchId: number };
  TurnoverQuery: undefined;
  Settings: undefined;
  AccountSecurity: undefined;
  PaymentManager: undefined;
  PitcherRanking: undefined;
  MyPoints: { code?: string; source?: PageSource };
  PointsTransfer: { code?: string; availablePoints?: number; name?: string };
  CreditTransfer: undefined;
  FrozenPoints: undefined;
  MyProfit: undefined;
  CreateRace: undefined;
  AllRace: undefined;
  RaceDetail: { raceId: number };
  RacePoolList: undefined;
  PeakRecord: undefined;
  GroupManagement: undefined;
  CompanyManagement: { groupCode?: string };
  CompanyDetail: { code: string };
  FixedDeposits: undefined;
};

// 通用导航类型
export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<RootStackParamList, T>;

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

// 主页面底部Tab导航
function MainTabs() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: THEME_COLORS.primary,
        tabBarInactiveTintColor: '#95a5a6',
        tabBarStyle: {
          backgroundColor: THEME_COLORS.cardBackground,
          borderTopWidth: 1,
          borderTopColor: '#ecf0f1',
          paddingBottom: isIOS() ? 20 : 5,
          paddingTop: 5,
          height: isIOS() ? 80 : 60,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t('navigation.home'),
          tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
          headerShown: false,
        }}
      />
      {/* <Tab.Screen
        name="Tournament"
        component={TournamentScreen}
        options={{
          tabBarLabel: t('navigation.tournament'),
          tabBarIcon: ({ color, size }) => <Icon name="emoji-events" color={color} size={size} />,
          headerShown: false,
        }}
      /> */}
      <Tab.Screen
        name="My"
        component={MyScreen}
        options={{
          tabBarLabel: t('navigation.my'),
          tabBarIcon: ({ color, size }) => <FontAwesome name="user" color={color} size={size} />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

// 主导航栈
function AppNavigator() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <NavigationContainer>
          <AuthProvider>
            <RoleProvider>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen name="Auth" component={AuthScreen} />
                <Stack.Screen name="Game" component={Game} />
                <Stack.Screen name="NewChallenge" component={NewChallengeScreen} />
                <Stack.Screen name="ExistingChallenge" component={ExistingChallengeScreen} />
                <Stack.Screen name="ChallengeDetail" component={ChallengeDetail} />
                <Stack.Screen name="AllChallenge" component={AllChallengeScreen} />
                <Stack.Screen name="ChangeRecorderChallenge" component={ChangeRecorderChallenge} />
                <Stack.Screen name="AssignPitcherChallenge" component={AssignPitcherChallengeScreen} />
                <Stack.Screen name="FundraisingChallenge" component={FundraisingChallengeScreen} />
                <Stack.Screen name="InvestmentDetail" component={InvestmentDetailScreen} />
                <Stack.Screen name="MyGames" component={MyGamesScreen} />
                <Stack.Screen name="RoundDetail" component={RoundDetailScreen} />
                <Stack.Screen name="TurnoverQuery" component={TurnoverQueryScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="AccountSecurity" component={AccountSecurity} />
                <Stack.Screen name="PaymentManager" component={PaymentManager} />
                <Stack.Screen name="PitcherRanking" component={PitcherRankingScreen} />
                <Stack.Screen name="MyPoints" component={MyPointsScreen} />
                <Stack.Screen name="PointsTransfer" component={PointsTransferScreen} />
                <Stack.Screen name="CreditTransfer" component={CreditTransferScreen} />
                <Stack.Screen name="FrozenPoints" component={FrozenPointsScreen} />
                <Stack.Screen name="MyProfit" component={MyProfitScreen} />
                <Stack.Screen name="CreateRace" component={CreateRaceScreen} />
                <Stack.Screen name="AllRace" component={AllRaceScreen} />
                <Stack.Screen name="RaceDetail" component={RaceDetailScreen} />
                <Stack.Screen name="RacePoolList" component={RacePoolListScreen} />
                <Stack.Screen name="PeakRecord" component={PeakRecordScreen} />
                <Stack.Screen name="GroupManagement" component={GroupManagementScreen} />
                <Stack.Screen name="CompanyManagement" component={CompanyManagementScreen} />
                <Stack.Screen name="CompanyDetail" component={CompanyDetailScreen} />
                <Stack.Screen name="FixedDeposits" component={FixedDepositsScreen} />
              </Stack.Navigator>
            </RoleProvider>
          </AuthProvider>
        </NavigationContainer>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

export default AppNavigator;

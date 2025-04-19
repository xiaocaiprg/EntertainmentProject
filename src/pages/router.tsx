import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { HomeScreen } from './Home/index';
import { MyScreen } from './My/index';
// import { TournamentScreen } from './Tournament/index';
import { AuthScreen } from './Auth/AuthScreen';
import { Game } from './Game/index';
import { NewChallengeScreen } from './NewChallenge/index';
import { ExistingChallengeScreen } from './ExistingChallenge/index';
import { GameHistory } from './GameHistory/index';
import { ChallengeDetail } from './ChallengeDetail/index';
import { CompletedFundingChallengeScreen } from './CompletedFundingChallenge/index';
import { AllChallengeScreen } from './AllChallenge/index';
import { FundraisingChallengeScreen } from './FundraisingChallenge/index';
import { MyGamesScreen } from './MyGames/index';
import { RoundDetailScreen } from './RoundDetail/index';
import { TurnoverQueryScreen } from './TurnoverQuery/index';
import { SettingsScreen } from './Settings/index';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../context/AuthProvider';
import { RoleProvider } from '../context/RoleContext';
import { LanguageProvider } from '../context/LanguageContext';
import { isIOS } from '../utils/platform';
import { THEME_COLORS } from '../utils/styles';
import { GameRouteParams } from './Game/types';
import { useTranslation } from '../hooks/useTranslation';

// 定义导航参数类型
type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
  Game: GameRouteParams;
  NewChallenge: undefined;
  ExistingChallenge: undefined;
  GameHistory: undefined;
  ChallengeDetail: { matchId: number };
  AllChallenge: undefined;
  CompletedFundingChallenge: undefined;
  FundraisingChallenge: undefined;
  MyGames: undefined;
  RoundDetail: { matchId: number };
  TurnoverQuery: undefined;
  Settings: undefined;
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
                <Stack.Screen name="GameHistory" component={GameHistory} />
                <Stack.Screen name="ChallengeDetail" component={ChallengeDetail} />
                <Stack.Screen name="AllChallenge" component={AllChallengeScreen} />
                <Stack.Screen name="CompletedFundingChallenge" component={CompletedFundingChallengeScreen} />
                <Stack.Screen name="FundraisingChallenge" component={FundraisingChallengeScreen} />
                <Stack.Screen name="MyGames" component={MyGamesScreen} />
                <Stack.Screen name="RoundDetail" component={RoundDetailScreen} />
                <Stack.Screen name="TurnoverQuery" component={TurnoverQueryScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
              </Stack.Navigator>
            </RoleProvider>
          </AuthProvider>
        </NavigationContainer>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

export default AppNavigator;

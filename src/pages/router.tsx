import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './Home/index';
import { MyScreen } from './My/index';
import { TournamentScreen } from './Tournament/index';
import { AuthScreen } from './Auth/AuthScreen';
import { Game } from './Game/index';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../context/AuthContext';
import { isIOS } from '../utils/platform';
import { THEME_COLORS } from '../utils/styles';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 主页面底部Tab导航
function MainTabs() {
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
          tabBarLabel: '首页',
          tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Tournament"
        component={TournamentScreen}
        options={{
          tabBarLabel: '赛事',
          tabBarIcon: ({ color, size }) => <Icon name="emoji-events" color={color} size={size} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="My"
        component={MyScreen}
        options={{
          tabBarLabel: '我的',
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
    <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="Game" component={Game} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
}

export default AppNavigator;

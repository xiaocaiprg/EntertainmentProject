/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
// import 'react-native-reanimated';
import React from 'react';
import { Text, TextInput } from 'react-native';
import AppNavigator from './src/pages/router';
import './src/i18n';

// 设置Text和TextInput不随系统字体大小变化
// @ts-ignore
Text.defaultProps = Text.defaultProps || {};
// @ts-ignore
Text.defaultProps.allowFontScaling = false;
// @ts-ignore
TextInput.defaultProps = TextInput.defaultProps || {};
// @ts-ignore
TextInput.defaultProps.allowFontScaling = false;

function App(): React.JSX.Element {
  return <AppNavigator />;
}

export default App;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
// import 'react-native-reanimated';
import React from 'react';
import AppNavigator from './src/pages/router';
import { LanguageProvider } from './src/context/LanguageContext';
import './src/i18n';

function App(): React.JSX.Element {
  return (
    <LanguageProvider>
      <AppNavigator />
    </LanguageProvider>
  );
}

export default App;

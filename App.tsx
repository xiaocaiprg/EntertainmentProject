/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import React from 'react';
// import { StatusBar } from 'react-native';
import AppNavigator from './src/pages/router';

function App(): React.JSX.Element {
  return (
    // <>
    //   <StatusBar barStyle="default" backgroundColor="#6c5ce7" />
    <AppNavigator />
    // </>
  );
}

export default App;

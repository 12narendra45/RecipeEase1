// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function App() {
  return (
     <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    <NavigationContainer>
      <StackNavigator/>
    </NavigationContainer>
    </SafeAreaView>
  );
}

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import BottomTabBar from './src/navigation/BottomTabBar';
import FavoriteStorageSync from './src/redux/FavoriteStorageSync';
import { store } from './src/redux';
import LoginScreen from './src/screens/LoginScreen/LoginScreen';
import { RootStackParamList } from './src/types/navigation';
import SplashScreen from './src/screens/SplashScreen/SplashScreen';
import EventDetailScreen from './src/screens/EventDetailScreen/EventDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <FavoriteStorageSync />
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="BottomTabBar" component={BottomTabBar} />
            <Stack.Screen
              name="EventDetailScreen"
              component={EventDetailScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;

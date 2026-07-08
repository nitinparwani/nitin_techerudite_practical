import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SearchScreen from '../screens/SearchScreen/SearchScreen';
import EventListingScreen from '../screens/EventListingScreen/EventListingScreen';
import { Fonts } from '../assets/fonts';
import { commonColors } from '../theme/common';
import { ms } from 'react-native-size-matters';
import {
  EventTabIcon,
  FavouriteTabIcon,
  ProfileTabIcon,
  SearchTabIcon,
} from '../assets/icons/TabIcons';
import { BottomTabParamList } from '../types/navigation';
import FavouriteScreen from '../screens/FavouriteScreen/FavouriteScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();


const renderTabBarIcon = (routeName: string, focused: boolean) => {
  const color = focused ? commonColors.darkBlack : commonColors.lightGrey;
  const iconProps = { width: ms(18), height: ms(18) };

  if (routeName === 'SearchScreen') {
    return <SearchTabIcon {...iconProps} color={color} />;
  }

  if (routeName === 'EventListingScreen') {
    return <EventTabIcon {...iconProps} color={color} />;
  }

  if (routeName === 'FavouriteScreen') {
    return <FavouriteTabIcon {...iconProps} color={color} focused={focused} />;
  }

  return <ProfileTabIcon {...iconProps} color={color} />;
};

function BottomTabBar() {
  return (
    <Tab.Navigator
      initialRouteName="EventListingScreen"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: commonColors.darkBlack,
        tabBarInactiveTintColor: commonColors.lightGrey,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem,
        tabBarIcon: ({ focused }) => renderTabBarIcon(route.name, focused),
      })}
    >
      <Tab.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ tabBarLabel: 'SEARCH', animation: 'fade', }}
      />
      <Tab.Screen
        name="EventListingScreen"
        component={EventListingScreen}
        options={{ tabBarLabel: 'EVENTS' }}
      />
      <Tab.Screen
        name="FavouriteScreen"
        component={FavouriteScreen}
        options={{ tabBarLabel: 'FAVOURITES' }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ tabBarLabel: 'PROFILE' }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabBar;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: commonColors.lightWhite,
    height:ms(75)
  },
  tabItem: {
    justifyContent: 'center',
  },
  tabLabel: {
    fontFamily: Fonts.medium,
    fontSize: ms(12),
    letterSpacing: 0,
    marginTop: ms(3),
  },
});

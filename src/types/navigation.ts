import { NavigatorScreenParams } from '@react-navigation/native';
import { EventItem } from './event';

export type RootStackParamList = {
  SplashScreen: undefined;
  LoginScreen: undefined;
  BottomTabBar: NavigatorScreenParams<BottomTabParamList> | undefined;
  EventDetailScreen: {
    event: EventItem;
  };
};

export type BottomTabParamList = {
  SearchScreen: undefined;
  EventListingScreen: undefined;
  FavouriteScreen: undefined;
  ProfileScreen: undefined;
};

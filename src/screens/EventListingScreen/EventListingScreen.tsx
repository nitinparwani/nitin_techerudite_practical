import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ms } from 'react-native-size-matters';
import { Fonts } from '../../assets/fonts';
import { NewSearch } from '../../assets/icons';
import EventCard from '../../components/EventCard/EventCard';
import Header from '../../components/Header/Header';
import { useEventsListingQuery } from '../../redux/services/authApi';
import { hydrateFavorites } from '../../redux/slices/favoriteSlice';
import { AppDispatch } from '../../redux';
import { commonColors } from '../../theme/common';
import { BottomTabParamList } from '../../types/navigation';
import { useDispatch } from 'react-redux';

type EventListingNavigationProp = BottomTabNavigationProp<
  BottomTabParamList,
  'EventListingScreen'
>;

const EventListingScreen = () => {
  const { data, isError } = useEventsListingQuery();
  const events = data?.data?.events ?? [];
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<EventListingNavigationProp>();

  useEffect(() => {
    if (events.length > 0) {
      dispatch(hydrateFavorites(events));
    }
  }, [dispatch, events]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header />
      <View style={styles.intro}>
        <Text style={styles.greeting}>Hello Renzo!</Text>
        <Text style={styles.subTitle}>
          Are you ready to dance? Explore today's movements.
        </Text>

        <Pressable
          onPress={() => navigation.navigate('SearchScreen')}
          style={styles.searchBox}
        >
          <NewSearch width={ms(24)} height={ms(24)} />
          <Text style={styles.searchPlaceholder}>Search events...</Text>
        </Pressable>
      </View>
      <FlatList
        data={events}
        keyExtractor={item => `${item.event_id}-${item.event_date_id}`}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => <EventCard item={item} />}
        ListEmptyComponent={
          <View style={styles.stateContainer}>
         
              <Text style={styles.stateText}>
                {isError ? 'Unable to load events.' : 'No events found.'}
              </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default EventListingScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: commonColors.white,
  },
  intro: {
    paddingHorizontal: ms(20),
  },
  list: {
    flex: 1,
  },
  content: {
    paddingHorizontal: ms(20),
    paddingBottom: ms(18),
    flexGrow: 1,
  },
  greeting: {
    color: commonColors.greyishBlack,
    fontFamily: Fonts.medium,
    fontSize: ms(24),
    marginBottom: ms(5),
  },
  subTitle: {
    color: commonColors.black2,
    fontFamily: Fonts.regular,
    fontSize: ms(16),
    lineHeight: ms(25),
    marginBottom: ms(15),
    maxWidth: ms(310),
  },
  searchBox: {
    alignItems: 'center',
    borderColor: '#E2E5EA',
    borderRadius: ms(7),
    borderWidth: 1,
    flexDirection: 'row',
    height: ms(48),
    marginBottom: ms(5),
    paddingHorizontal: ms(17),
  },
  searchPlaceholder: {
    color: commonColors.placeholder,
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: ms(16),
    marginLeft: ms(4),
    paddingVertical: 0,
  },
  stateContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: ms(32),
  },
  stateText: {
    color: commonColors.grey,
    fontFamily: Fonts.medium,
    fontSize: ms(14),
  },
});

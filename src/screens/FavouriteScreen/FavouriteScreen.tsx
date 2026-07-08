import React, { useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ms } from 'react-native-size-matters';
import { Fonts } from '../../assets/fonts';
import EventCard from '../../components/EventCard/EventCard';
import Header from '../../components/Header/Header';
import { useEventsListingQuery } from '../../redux/services/authApi';
import { hydrateFavorites } from '../../redux/slices/favoriteSlice';
import { AppDispatch, RootState } from '../../redux';
import { commonColors } from '../../theme/common';
import { useDispatch, useSelector } from 'react-redux';

const FavouriteScreen = () => {
  const { data, isError } = useEventsListingQuery();
  const events = data?.data?.events ?? [];
  const dispatch = useDispatch<AppDispatch>();
  const favoriteEvents = useSelector((state: RootState) =>
    Object.values(state.favorite.items),
  );

  useEffect(() => {
    if (events.length > 0) {
      dispatch(hydrateFavorites(events));
    }
  }, [dispatch, events]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header />
      <View style={styles.intro}>
        <Text style={styles.greeting}>Your Favorite Events!</Text>
        <Text style={styles.subTitle}>
          Find your favorite events here....
        </Text>
      </View>
      <FlatList
        data={favoriteEvents}
        keyExtractor={item => `${item.event_id}-${item.event_date_id}`}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => <EventCard item={item} />}
      
        ListEmptyComponent={
          <View style={styles.stateContainer}>
     
              <Text style={styles.stateText}>
                {isError
                  ? 'Unable to load events.'
                  : 'No favorite events found.'}
              </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default FavouriteScreen;

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

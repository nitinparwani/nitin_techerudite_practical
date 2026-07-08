import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ms } from 'react-native-size-matters';
import { Fonts } from '../../assets/fonts';
import { Cross, NewSearch } from '../../assets/icons';
import EventCard from '../../components/EventCard/EventCard';
import Header from '../../components/Header/Header';
import { useEventsListingQuery } from '../../redux/services/authApi';
import { hydrateFavorites } from '../../redux/slices/favoriteSlice';
import { AppDispatch } from '../../redux';
import { commonColors } from '../../theme/common';
import { EventItem } from '../../types/event';
import { useDispatch } from 'react-redux';

const getSearchText = (item: EventItem) => {
  const keywordText = item.keywords.join(' ');
  const danceStyleText = item.danceStyles.map(style => style.ds_name).join(' ');
  return [
    item.event_name,
    item.description,
    item.city,
    item.country,
    keywordText,
    danceStyleText,
  ]
    .join(' ')
    .toLowerCase();
};

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const { data, isError } = useEventsListingQuery();
  const events = data?.data?.events ?? [];
  const dispatch = useDispatch<AppDispatch>();
  const trimmedQuery = query.trim().toLowerCase();
  const filteredEvents = useMemo(() => {
    if (!trimmedQuery) {
      return events;
    }

    return events.filter(item => getSearchText(item).includes(trimmedQuery));
  }, [events, trimmedQuery]);

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

        <View style={styles.searchBox}>
          <NewSearch width={ms(24)} height={ms(24)} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            value={query}
            onChangeText={setQuery}
            placeholderTextColor={commonColors.placeholder}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery('')}
              style={styles.clearButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Cross width={ms(18)} height={ms(18)} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <FlatList
        data={filteredEvents}
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
                  : trimmedQuery
                    ? 'No matching events found.'
                    : 'No events found.'}
              </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default SearchScreen;

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
  searchInput: {
    color: commonColors.darkBlack,
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: ms(16),
    marginLeft: ms(4),
    paddingVertical: 0,
  },
  clearButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: ms(8),
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

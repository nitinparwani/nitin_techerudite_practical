import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import { Calendar, Download, Fav, Location, Unfav } from '../../assets/icons';
import { Fonts } from '../../assets/fonts';
import { EventItem } from '../../types/event';
import { Images } from '../../assets/images';
import { commonColors } from '../../theme/common';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux';
import {
  getEventFavoriteKey,
  toggleFavorite,
} from '../../redux/slices/favoriteSlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type EventCardProps = {
  item: EventItem;
};
type EventCardNavigationProp = NativeStackNavigationProp<RootStackParamList>;
const READABLE_DATE_INPUT_FORMAT = 'DD.MM.YY';

const getEventDate = (item: EventItem) => {
  const start = moment(item.readable_from_date, READABLE_DATE_INPUT_FORMAT);
  const hasEndDate = !!item.readable_to_date;
  const end = hasEndDate
    ? moment(item.readable_to_date, READABLE_DATE_INPUT_FORMAT)
    : null;

  if (!start.isValid()) {
    return item.readable_from_date; 
  }

  if (!end || !end.isValid()) {
    return start.format('D MMM YYYY');
  }

  if (start.isSame(end, 'year') && start.isSame(end, 'month')) {
    return `${start.format('D')} - ${end.format('D MMM YYYY')}`;
  }

  if (start.isSame(end, 'year')) {
    return `${start.format('D MMM')} - ${end.format('D MMM YYYY')}`;
  }

  return `${start.format('D MMM YYYY')} - ${end.format('D MMM YYYY')}`;
};

const getEventPrice = (item: EventItem) => {
  const { event_price_from: from, event_price_to: to } = item;
  return `€${from} - €${to}`;
};

const getEventTags = (item: EventItem) => {
  const danceStyleTags = item.danceStyles.map(style => style.ds_name);
  return Array.from(new Set([...item.keywords, ...danceStyleTags]));
};

const EventCard = ({ item }: EventCardProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<EventCardNavigationProp>();
  const favoriteKey = getEventFavoriteKey(item);
  const isFavorite = useSelector(
    (state: RootState) =>
      state.favorite.favoriteIds[favoriteKey] ?? item.isFavorite === 1,
  );
  const date = getEventDate(item);
  const price = getEventPrice(item);
  const tags = getEventTags(item);
  const location = `${item.city}, ${item.country}`;
  const hasImage = item.event_profile_img && !imageFailed;

  useEffect(() => {
    setImageFailed(false);
  }, [item.event_profile_img]);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('EventDetailScreen', { event: item })}
    >
      <View style={styles.poster}>
        {hasImage ? (
          <Image
            source={{ uri: item.event_profile_img }}
            style={styles.posterImage}
            resizeMode="cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <View style={styles.noImage}>
            <Image source={Images.noImage} style={styles.noImageIcon} />
          </View>
        )}
        <View style={styles.posterActions}>
          <IconButton>
            <Download width={ms(16)} height={ms(16)} />
          </IconButton>
          <IconButton onPress={() => dispatch(toggleFavorite(item))}>
            {isFavorite ? (
              <Fav width={ms(16)} height={ms(16)} />
            ) : (
              <Unfav width={ms(16)} height={ms(16)} />
            )}
          </IconButton>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.tagRow}>
          {tags.map(tag => (
            <View key={`${item.event_date_id}-${tag}`} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.eventTitle} numberOfLines={1}>
          {item.event_name}
        </Text>

        <View style={styles.metaRow}>
          <Location width={ms(12)} height={ms(15)} />
          <Text style={styles.metaText} numberOfLines={1}>
            {location}
          </Text>
        </View>

        <View style={styles.footerRow}>
          <View style={styles.dateRow}>
            <Calendar width={ms(14)} height={ms(15)} />
            <Text style={styles.metaText} numberOfLines={1}>
              {date}
            </Text>
          </View>
          <View style={styles.priceDivider} />
          <Text style={styles.price}>{price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const IconButton = ({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    style={styles.iconButton}
    activeOpacity={0.75}
    onPress={onPress}
  >
    {children}
  </TouchableOpacity>
);

export default EventCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: commonColors.white,
    borderColor: commonColors.border,
    borderRadius: ms(7),
    borderWidth: 0.5,
    flexDirection: 'row',
    height: ms(123),
    marginBottom: ms(14),
    overflow: 'hidden',
  },
  poster: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: ms(130),
  },
  posterImage: {
    height: '100%',
    width: '100%',
  },
  noImage: {
    alignItems: 'center',
    backgroundColor: commonColors.light,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  noImageIcon: {
    height: ms(34),
    opacity: 0.45,
    width: ms(34),
  },
  posterActions: {
    flexDirection: 'row',
    gap: ms(6),
    position: 'absolute',
    right: ms(5),
    top: ms(6),
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: commonColors.white,
    borderRadius: ms(4),
    height: ms(24),
    justifyContent: 'center',
    width: ms(24),
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: ms(12),
    paddingVertical: ms(12),
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(7),
    height: ms(20),
    overflow: 'hidden',
  },
  tag: {
    backgroundColor: commonColors.bluish,
    borderColor: commonColors.border2,
    borderRadius: ms(9),
    borderWidth: 1,
    paddingHorizontal: ms(8),
    paddingVertical: ms(2),
  },
  tagText: {
    color: commonColors.text,
    fontFamily: Fonts.medium,
    fontSize: ms(11),
  },
  eventTitle: {
    color: commonColors.darkBlack,
    fontFamily: Fonts.medium,
    fontSize: ms(16),
    marginTop: ms(8),
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: ms(6),
  },
  metaText: {
    color: commonColors.text3,
    flexShrink: 1,
    fontFamily: Fonts.regular,
    fontSize: ms(12),
    marginLeft: ms(4),
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: ms(8),
  },
  dateRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: ms(4),
  },
  priceDivider: {
    backgroundColor: commonColors.divider,
    height: ms(18),
    marginHorizontal: ms(9),
    width: 1,
  },
  price: {
    color: commonColors.text2,
    fontFamily: Fonts.bold,
    fontSize: ms(16),
  },
});

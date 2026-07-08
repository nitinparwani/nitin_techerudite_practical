import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ms } from 'react-native-size-matters';
import {
  BackIcon,
  Calendar,
  Download,
  Fav,
  Location,
  StaticMap,
  Unfav,
} from '../../assets/icons';
import { Fonts } from '../../assets/fonts';
import { Images } from '../../assets/images';
import Button from '../../components/Button/Button';
import { AppDispatch, RootState } from '../../redux';
import {
  getEventFavoriteKey,
  toggleFavorite,
} from '../../redux/slices/favoriteSlice';
import { commonColors } from '../../theme/common';
import { EventItem } from '../../types/event';
import { RootStackParamList } from '../../types/navigation';
import { useDispatch, useSelector } from 'react-redux';

type EventDetailRouteProp = RouteProp<
  RootStackParamList,
  'EventDetailScreen'
>;
type EventDetailNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const READABLE_DATE_INPUT_FORMAT = 'DD.MM.YY';
const EVENT_TIME_LABEL = '21:00 onwards';

const formatEventDate = (item: EventItem) => {
  const start = moment(item.readable_from_date, READABLE_DATE_INPUT_FORMAT);
  const end = item.readable_to_date
    ? moment(item.readable_to_date, READABLE_DATE_INPUT_FORMAT)
    : null;

  if (!start.isValid()) {
    return `${item.readable_from_date}, ${EVENT_TIME_LABEL}`;
  }

  if (!end || !end.isValid()) {
    return `${start.format('D MMM YYYY')}, ${EVENT_TIME_LABEL}`;
  }

  if (start.isSame(end, 'year') && start.isSame(end, 'month')) {
    return `${start.format('D')} - ${end.format(
      'D MMM YYYY',
    )}, ${EVENT_TIME_LABEL}`;
  }

  if (start.isSame(end, 'year')) {
    return `${start.format('D MMM')} - ${end.format(
      'D MMM YYYY',
    )}, ${EVENT_TIME_LABEL}`;
  }

  return `${start.format('D MMM YYYY')} - ${end.format(
    'D MMM YYYY',
  )}, ${EVENT_TIME_LABEL}`;
};

const formatEventPrice = (item: EventItem) => {
  const { event_price_from: from, event_price_to: to } = item;
  return `€${from} - €${to}`;
};

const getEventTags = (item: EventItem) => {
  const danceStyleTags = item.danceStyles.map(style => style.ds_name);
  return Array.from(new Set([...item.keywords, ...danceStyleTags])).slice(0, 4);
};

const getOrganizerName = (eventName: string) => {
  const [namePrefix] = eventName.split(':');
  return eventName.includes(':') ? `${namePrefix} International` : eventName;
};

const EventDetailScreen = () => {
  const route = useRoute<EventDetailRouteProp>();
  const navigation = useNavigation<EventDetailNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { event } = route.params;
  const [imageFailed, setImageFailed] = useState(false);
  const favoriteKey = getEventFavoriteKey(event);
  const isFavorite = useSelector(
    (state: RootState) =>
      state.favorite.favoriteIds[favoriteKey] ?? event.isFavorite === 1,
  );
  const[isFav,setIsFav] = useState(isFavorite)
  const location = `${event.city}, ${event.country}`;
  const tags = useMemo(() => getEventTags(event), [event]);
  const description = event.description.replace(/\r\n/g, '\n').trim();
  const organizerName = getOrganizerName(event.event_name);
  const organizerInitial = organizerName.charAt(0).toUpperCase();

  useEffect(() => {
    setImageFailed(false);
  }, [event.event_profile_img]);

  const onPressItem = () =>{
    dispatch(toggleFavorite(event))
    setIsFav(!isFav)
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <BackIcon width={ms(24)} height={ms(24)} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.hero}>
          {event.event_profile_img && !imageFailed ? (
            <Image
              source={{ uri: event.event_profile_img }}
              style={styles.heroImage}
              resizeMode="cover"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <View style={styles.noImage}>
              <Image source={Images.noImage} style={styles.noImageIcon} />
            </View>
          )}

          <View style={styles.heroActions}>
            <IconButton>
              <Download width={ms(21)} height={ms(21)} />
            </IconButton>
            <IconButton onPress={onPressItem}>
              {isFav ? (
                <Fav width={ms(21)} height={ms(21)} />
              ) : (
                <Unfav width={ms(21)} height={ms(21)} />
              )}
            </IconButton>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.tagRow}>
            {tags.map(tag => (
              <View key={`${event.event_date_id}-${tag}`} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.title}>{event.event_name}</Text>
          <Text style={styles.price}>{formatEventPrice(event)}</Text>

          <InfoRow
            icon={<Calendar width={ms(20)} height={ms(20)} />}
            label="DATE & TIME"
            value={formatEventDate(event)}
          />
          <InfoRow
            icon={<Location width={ms(20)} height={ms(20)} />}
            label="LOCATION"
            value={location}
          />

          <View style={styles.map}>
            <StaticMap width="100%" height={ms(192)} />
          </View>

          <Text style={styles.sectionTitle}>About the Event</Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.organizerCard}>
            <View style={styles.organizerLogo}>
              <Text style={styles.organizerInitial}>{organizerInitial}</Text>
            </View>
            <View style={styles.organizerInfo}>
              <Text style={styles.organizedBy}>ORGANIZED BY</Text>
              <Text style={styles.organizerName}>{organizerName}</Text>
              <Text style={styles.viewProfile}>View Profile</Text>
            </View>
          </View>

          <Button
            title="Share tickets"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
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

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIcon}>{icon}</View>
    <View style={styles.infoTextWrap}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

export default EventDetailScreen;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: commonColors.solidWhite,
    flex: 1,
  },
  header: {
    backgroundColor: commonColors.solidWhite,
    height: ms(50),
    justifyContent: 'center',
    paddingHorizontal: ms(20),
  },
  backButton: {
    alignItems: 'center',
    height: ms(32),
    justifyContent: 'center',
    width: ms(32),
  },
  content: {
    backgroundColor: commonColors.solidWhite,
    paddingBottom: ms(30),
  },
  hero: {
    backgroundColor: commonColors.greyishBlack,
    height: ms(250),
    position: 'relative',
    width: '100%',
  },
  heroImage: {
    height: '100%',
    width: '100%',
  },
  noImage: {
    alignItems: 'center',
    backgroundColor: commonColors.lightWhite,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  noImageIcon: {
    height: ms(54),
    opacity: 0.45,
    width: ms(54),
  },
  heroActions: {
    flexDirection: 'row',
    gap: ms(8),
    position: 'absolute',
    right: ms(10),
    top: ms(16),
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: commonColors.actionBackground,
    borderRadius: ms(11),
    height: ms(41),
    justifyContent: 'center',
    width: ms(41),
  },
  body: {
    paddingHorizontal: ms(21),
    paddingTop: ms(24),
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(7),
  },
  tag: {
    backgroundColor: commonColors.bluish,
    borderColor: commonColors.border2,
    borderRadius: ms(9),
    borderWidth: 1,
    paddingHorizontal: ms(9),
    paddingVertical: ms(2),
  },
  tagText: {
    color: commonColors.text,
    fontFamily: Fonts.medium,
    fontSize: ms(11),
  },
  title: {
    color: commonColors.darkBlack,
    fontFamily: Fonts.bold,
    fontWeight:"700",
    fontSize: ms(24),
    lineHeight: ms(37),
    marginTop: ms(14),
  },
  price: {
    color: commonColors.greyishBlack,
    fontFamily: Fonts.bold,
    fontWeight:"700",
    fontSize: ms(20),
    marginTop: ms(12),
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: ms(21),
  },
  infoIcon: {
    alignItems: 'center',
    backgroundColor: commonColors.newGrey,
    borderRadius: ms(4),
    height: ms(48),
    justifyContent: 'center',
    width: ms(48),
  },
  infoTextWrap: {
    flex: 1,
    marginLeft: ms(16),
  },
  infoLabel: {
    color: commonColors.grey,
    fontFamily: Fonts.medium,
    fontSize: ms(11),
    letterSpacing: ms(1),
  },
  infoValue: {
    color: commonColors.greyishBlack,
    fontFamily: Fonts.regular,
    fontSize: ms(18),
    lineHeight: ms(24),
    marginTop: ms(3),
  },
  map: {
    borderRadius: ms(2),
    height: ms(192),
    marginTop: ms(24),
    overflow: 'hidden',
    width: '100%',
  },
  sectionTitle: {
    color: commonColors.greyishBlack,
    fontFamily: Fonts.medium,
    fontSize: ms(24),
    fontWeight:"500",
    marginTop: ms(26),
  },
  description: {
    color: commonColors.descriptionText,
    fontFamily: Fonts.regular,
    fontSize: ms(16),
    lineHeight: ms(26),
    marginTop: ms(13),
  },
  organizerCard: {
    alignItems: 'center',
    backgroundColor: commonColors.cardBackground,
    borderRadius: ms(7),
    flexDirection: 'row',
    marginTop: ms(24),
    paddingHorizontal: ms(24),
    paddingVertical: ms(24),
  },
  organizerLogo: {
    alignItems: 'center',
    backgroundColor: commonColors.darkBlack,
    borderRadius: ms(9),
    height: ms(64),
    justifyContent: 'center',
    width: ms(64),
  },
  organizerInitial: {
    color: commonColors.solidWhite,
    fontFamily: Fonts.medium,
    fontSize: ms(30),
  },
  organizerInfo: {
    flex: 1,
    marginLeft: ms(15),
  },
  organizedBy: {
    color: commonColors.grey,
    fontFamily: Fonts.regular,
    fontSize: ms(12),
    letterSpacing: ms(1),
  },
  organizerName: {
    color: commonColors.greyishBlack,
    fontFamily: Fonts.medium,
    fontSize: ms(20),
    lineHeight: ms(27),
    marginTop: ms(2),
  },
  viewProfile: {
    color: commonColors.darkBlack,
    fontFamily: Fonts.regular,
    fontSize: ms(12),
    marginTop: ms(3),
    textDecorationLine: 'underline',
  },

});

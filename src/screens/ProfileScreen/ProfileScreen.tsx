import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ms } from 'react-native-size-matters';
import { SvgProps } from 'react-native-svg';
import { Fonts } from '../../assets/fonts';
import {
    Edit,
    HelpSupport,
    Logout,
    MyTickets,
    Notify,
    Payments,
    Profile as ProfileIcon,
    RightIcon,
} from '../../assets/icons';
import Header from '../../components/Header/Header';
import {
    AUTH_STORAGE_KEY,
    getStoredAuthData,
    LoginUser,
} from '../../redux/services/authApi';
import { commonColors } from '../../theme/common';

type ProfileAction = {
  title: string;
  Icon: React.FC<SvgProps>;
  destructive?: boolean;
  onPress?: () => void;
};

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = React.useState<LoginUser | null>(null);

  React.useEffect(() => {
    const loadUser = async () => {
      const authData = await getStoredAuthData();
      setUser(authData?.user ?? null);
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      }),
    );
  };

  const actions: ProfileAction[] = [
    { title: 'My Tickets', Icon: MyTickets },
    { title: 'Payment Methods', Icon: Payments },
    { title: 'Notification Settings', Icon: Notify },
    { title: 'Help & Support', Icon: HelpSupport },
    {
      title: 'Logout',
      Icon: Logout,
      destructive: true,
      onPress: handleLogout,
    },
  ];
  const fullName = [user?.usr_fname, user?.usr_lname]
    .filter(Boolean)
    .join(' ');
  const displayName = fullName || user?.usr_username || 'Dance Enthusiast';
  const email = user?.usr_email || 'abc@gmail.com';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header/>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        <View style={styles.profileHeader}>
          <View style={styles.avatarFrame}>
            <View style={styles.avatar}>
                <ProfileIcon
                  width={ms(56)}
                  height={ms(56)}
                />
            </View>
            <TouchableOpacity activeOpacity={0.75} style={styles.editButton}>
              <Edit width={ms(15)} height={ms(15)} />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        <View style={styles.menuCard}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={action.title}
              activeOpacity={0.75}
              style={[
                styles.menuItem,
                index === actions.length - 1 && styles.menuItemLast,
              ]}
              onPress={action.onPress}
            >
              <action.Icon
                width={ms(22)}
                height={ms(22)}
              />
              <Text
                style={[
                  styles.menuText,
                  action.destructive && styles.logoutText,
                ]}
              >
                {action.title}
              </Text>
              {!action.destructive && (
                <RightIcon width={ms(8)} height={ms(12)} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: commonColors.solidWhite,
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: ms(28),
    paddingHorizontal: ms(20),
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: ms(40),
  },
  avatarFrame: {
    alignItems: 'center',
    backgroundColor: commonColors.solidWhite,
    borderColor: commonColors.profileBorder,
    borderRadius: ms(13),
    borderWidth: 1.5,
    height: ms(128),
    justifyContent: 'center',
    position: 'relative',
    width: ms(128),
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: commonColors.iconBackground,
    borderRadius: ms(10),
    height: '90%',
    justifyContent: 'center',
    width: '90%',
  },
  avatarImage: {
    borderRadius: ms(10),
    height: '100%',
    width: '100%',
  },
  editButton: {
    alignItems: 'center',
    backgroundColor: commonColors.darkBlack,
    borderColor: commonColors.solidWhite,
    borderWidth: ms(4),
    bottom: ms(2),
    height: ms(35),
    justifyContent: 'center',
    position: 'absolute',
    right: ms(2),
    width: ms(35),
  },
  name: {
    color: commonColors.darkBlack,
    fontFamily: Fonts.bold,
    fontSize: ms(26),
    lineHeight: ms(36),
    marginTop: ms(12),
    textAlign: 'center',
    fontWeight:'600'
  },
  email: {
    color: commonColors.grey,
    fontFamily: Fonts.regular,
    fontSize: ms(16),
    marginTop: ms(5),
    textAlign: 'center',
  },
  menuCard: {
    borderColor: commonColors.profileBorder,
    borderRadius: ms(7),
    borderWidth: 1,
    marginTop: ms(27),
    overflow: 'hidden',
    backgroundColor:commonColors.bg_grey
  },
  menuItem: {
    alignItems: 'center',
    borderBottomColor: commonColors.divider,
    borderBottomWidth: 1,
    flexDirection: 'row',
    padding: ms(23),
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuText: {
    color: commonColors.greyishBlack,
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: ms(16),
    marginLeft: ms(16),
  },
  logoutText: {
    color: commonColors.error,
  },
});

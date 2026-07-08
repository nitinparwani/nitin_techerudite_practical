import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ms } from 'react-native-size-matters';
import { Elevate, Pile } from '../../assets/icons';
import { Fonts } from '../../assets/fonts';
import { Images } from '../../assets/images';
import { getStoredAuthToken } from '../../redux/services/authApi';
import { commonColors } from '../../theme/common';
import { RootStackParamList } from '../../types/navigation';

type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SplashScreen'
>;

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

useEffect(() => {
  const SPLASH_DELAY = 1000;

  const navigateFromSplash = async () => {
    const token = await getStoredAuthToken();

    navigation.reset({
      index: 0,
      routes: [
        token
          ? {
              name: 'BottomTabBar',
              params: { screen: 'EventListingScreen' },
            }
          : { name: 'LoginScreen' },
      ],
    });
  };

  const timeoutId = setTimeout(navigateFromSplash, SPLASH_DELAY);

  return () => clearTimeout(timeoutId);
}, [navigation]);

  return (
    <ImageBackground
      source={Images.bg}
      style={styles.hero}
      imageStyle={styles.heroImage}
    >
      <SafeAreaView style={styles.main}>
        <View style={styles.logoContainer}>
          <Pile height={ms(100)} width={ms(144)} style={styles.pileText} />
          <Elevate height={ms(13)} width={ms(299)} style={styles.elevateText} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.tagline}>Your Dance - Your Stage</Text>
          <Text style={styles.subTagline}>DISCOVER · BOOK · MOVE</Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  heroImage: {
    resizeMode: 'cover',
    opacity: 0.38,
  },
  logoContainer: {
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: ms(46),
    alignItems: 'center',
  },
  pileText: {
    alignSelf: 'center',
  },
  elevateText: {
    marginTop: ms(16),
    alignSelf: 'center',
  },
  tagline: {
    color: commonColors.grey,
    fontFamily: Fonts.medium,
    fontSize: ms(16),
    letterSpacing: ms(0.3),
  },
  subTagline: {
    color: commonColors.lightGrey,
    fontFamily: Fonts.regular,
    fontSize: ms(10),
    letterSpacing: ms(3),
    marginTop: ms(8),
  },
});

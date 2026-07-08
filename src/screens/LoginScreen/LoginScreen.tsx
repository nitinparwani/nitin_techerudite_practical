import React, { useState } from 'react';
import {
  Alert,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Apple, Elevate, Fb, Google, Pile } from '../../assets/icons';
import { Images } from '../../assets/images';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ms } from 'react-native-size-matters';
import { commonColors } from '../../theme/common';
import TextInput from '../../components/TextInput/TextInput';
import { Fonts } from '../../assets/fonts';
import Button from '../../components/Button/Button';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_STORAGE_KEY, useLoginMutation } from '../../redux/services/authApi';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'LoginScreen'
>;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const socialOptions = [
    { id: 'google', Icon: Google, label: 'Sign in with Google' },
    { id: 'apple', Icon: Apple, label: 'Sign in with Apple' },
    { id: 'facebook', Icon: Fb, label: 'Sign in with Facebook' },
  ];
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    try {
      const response = await login({ email, password }).unwrap();
      if (!response.success) {
        Alert.alert('Login failed', response.message || 'Please try again.');
        return;
      }
      if (!Array.isArray(response.data)) {
        await AsyncStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify(response.data),
        );
      }
     navigation.reset({
       index: 0,
       routes: [{ name: 'BottomTabBar' }],
     });
    } catch (error) {
      const err = error as { data?: { message?: string } };
      Alert.alert(
        'Login failed',
        err?.data?.message || 'Please check your email and password.',
      );
    }
  };

  return (
    <ImageBackground
      source={Images.bg}
      style={styles.hero}
      imageStyle={styles.heroImage}
    >
      <SafeAreaView style={styles.main}>
        <Pile style={styles.pileText} />
        <Elevate style={styles.elevateText} />
        <View style={styles.container}>
          <TextInput
            label="Email"
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            error={emailError}
          />

          <TextInput
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            containerStyle={{ marginTop: ms(20) }}
          />
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
          <Button title="Sign In" loading={isLoading} onPress={handleLogin} />
          <Text style={styles.notMember}>
            Not a member?{' '}
            <Text style={[styles.notMember, { color: commonColors.darkBlack }]}>
              Sign Up Here
            </Text>
          </Text>
          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or Sign In with</Text>
            <View style={styles.dividerLine} />
          </View>
          <View style={styles.socialRow}>
            {socialOptions.map(({ id, Icon, label }) => (
              <TouchableOpacity
                key={id}
                style={styles.socialButton}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityLabel={label}
              >
                <Icon width={ms(24)} height={ms(24)} />
              </TouchableOpacity>
            ))}
          </View>
          <Pressable style={styles.guestBtn}>
            <Text style={styles.guestText}>Enter as Guest</Text>
            </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  hero: {
    height: '100%',
    justifyContent: 'flex-start',
  },
  heroImage: {
    resizeMode: 'cover',
    opacity: 0.3,
  },
  pileText: {
    marginTop: ms(70),
    alignSelf: 'center',
  },
  elevateText: {
    marginTop: ms(10),
    alignSelf: 'center',
  },
  container: {
    backgroundColor: commonColors.white,
    borderWidth: 0.5,
    borderColor: commonColors.black,
    marginHorizontal: ms(19),
    marginVertical: ms(48),
    padding: ms(20),
    borderRadius: ms(8),
    zIndex: 1000,
  },
  forgotPassword: {
    fontSize: ms(12),
    fontFamily: Fonts.medium,
    textAlign: 'right',
    letterSpacing: ms(0.5),
    color: commonColors.grey,
    marginTop: ms(5),
  },
  notMember: {
    fontSize: ms(12),
    fontFamily: Fonts.medium,
    letterSpacing: ms(0.5),
    color: commonColors.grey,
    marginTop: ms(8),
    textAlign: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ms(24),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: commonColors.border,
    opacity: 0.7,
  },
  dividerText: {
    marginHorizontal: ms(12),
    fontSize: ms(12),
    color: commonColors.grey,
    fontFamily: Fonts.medium,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(24),
    marginTop: ms(32),
    paddingBottom: ms(10),
  },
  socialButton: {
    width: ms(56),
    height: ms(56),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: commonColors.white,
    borderWidth: 1,
    borderColor: commonColors.black,
    borderRadius: ms(12),
  },
  guestBtn:{
    backgroundColor:commonColors.bluish,
    padding:ms(13),
    borderRadius:ms(30),
    borderWidth:0.8,
    borderColor:commonColors.border,
    marginTop:ms(20)
  },
  guestText:{
    fontSize: ms(12),
    fontFamily: Fonts.medium,
    letterSpacing: ms(0.5),
    color: commonColors.grey,
    textAlign: 'center',
  }
});

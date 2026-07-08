import React from 'react';
import {
    ActivityIndicator,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle,
} from 'react-native';
import { moderateScale, ms } from 'react-native-size-matters';
import { commonColors } from '../../theme/common';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}
export default function Button({
  title,
  loading = false,
  style,
  textStyle,
  disabled,
  onPress,
  activeOpacity = 0.85,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles.primary,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={activeOpacity}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={commonColors.white}
        />
      ) : (
        <Text
          style={[
            styles.text,
            styles.primaryText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    borderRadius: moderateScale(8),
    paddingVertical: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:ms(30)
  },
  primary: {
    backgroundColor: commonColors.darkBlack,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  primaryText: {
    color: commonColors.white,
  },
});
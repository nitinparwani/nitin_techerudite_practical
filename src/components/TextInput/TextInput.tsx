import React, { useState } from 'react';
import {
    TextInput as RNTextInput,
    TextInputProps as RNTextInputProps,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

import { moderateScale, ms } from 'react-native-size-matters';
import { Fonts } from '../../assets/fonts';
import { commonColors } from '../../theme/common';
import { Eye, HideEye } from '../../assets/icons';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  secureTextEntry?: boolean;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<TextStyle>;
}

export default function TextInput({
  label,
  secureTextEntry = false,
  error,
  containerStyle,
  style,
  ...rest
}: TextInputProps) {
  const [hidden, setHidden] = useState<boolean>(secureTextEntry);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View
        style={[
          styles.inputWrapper,
          error ? styles.inputWrapperError : null,
        ]}
      >
        <RNTextInput
          style={[styles.input, style]}
          placeholderTextColor={commonColors.placeholder}
          secureTextEntry={secureTextEntry && hidden}
          autoCapitalize={secureTextEntry ? 'none' : rest.autoCapitalize}
          {...rest}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setHidden((v) => !v)}
            style={styles.eyeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
          >
            {hidden ? (
              <HideEye width={moderateScale(20)} height={moderateScale(20)} />
            ) : (
              <Eye width={moderateScale(23)} height={moderateScale(23)} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: moderateScale(13),
    color: commonColors.grey,
    marginBottom: moderateScale(8),
    fontFamily:Fonts.regular
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: commonColors.border,
    borderRadius: moderateScale(12),
    paddingHorizontal: ms(16),
    paddingVertical: moderateScale(14),
  },
  inputWrapperError: {
    borderColor: commonColors.error,
  },
  input: {
    flex: 1,
    fontSize: moderateScale(15),
    color: commonColors.darkBlack,
    paddingRight: moderateScale(12),
    padding: 0,
  },
  eyeButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginTop: moderateScale(6),
    fontSize: moderateScale(12),
    color: commonColors.error,
  },
});

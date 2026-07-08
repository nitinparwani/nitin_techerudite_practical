import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ms } from 'react-native-size-matters';
import { Pile } from '../../assets/icons';
import { commonColors } from '../../theme/common';

const Header = () => {
  return (
    <View style={styles.container}>
      <Pile width={ms(32)} height={ms(32)} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: ms(10),
    backgroundColor:commonColors.lightWhite
  },
});

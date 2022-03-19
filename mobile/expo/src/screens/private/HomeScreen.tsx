import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '../../components/public/AppButton';

export const HomeScreen: React.FC = () => {
  function onPressLogout() {
    console.log("Logout");
  }

  return (
    <View style={styles.screen}>
      <AppButton onPress={onPressLogout}>
        Sair
      </AppButton>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

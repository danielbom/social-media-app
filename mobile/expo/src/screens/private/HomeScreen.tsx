import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '../../components/app/AppButton';
import { useRouting } from '../../hooks/useRouting';

export const HomeScreen: React.FC = () => {
  const routing = useRouting();

  function onPressLogout() {
    routing.unauthorize();
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

import React from 'react';

import { TemplateScreen } from './TemplateScreen';
import { AppButton } from '../../components/public/AppButton';
import { StyleSheet, View } from 'react-native';
import { Paragraph } from 'react-native-paper';

export const StartScreen: React.FC = () => {
  function onPressLogin() {
    console.log("Login");
  }
  function onPressRegister() {
    console.log("Register");
  }

  return (
    <TemplateScreen headerText="Rede Social">
      <Paragraph style={styles.text}>
        Uma rede social de exemplo
      </Paragraph>
      <View style={styles.buttons}>
        <AppButton mode="contained" onPress={onPressLogin}>
          Entrar
        </AppButton>
        <View style={styles.separator} />
        <AppButton mode="outlined" onPress={onPressRegister}>
          Registar
        </AppButton>
      </View>
    </TemplateScreen>
  );
};

const styles = StyleSheet.create({
  buttons: {
    paddingVertical: 16
  },
  separator: {
    height: 8
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 12,
  },
});
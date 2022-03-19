import React from 'react';

import { TemplateScreen } from './TemplateScreen';
import { AppButton } from '../../components/app/AppButton';
import { StyleSheet, View } from 'react-native';
import { Paragraph } from 'react-native-paper';
import { useAppNavigation } from '../../hooks/useAppNavigation';

type StartScreenFreeProps = {
  onPressLogin: () => void;
  onPressRegister: () => void;
}

export const StartScreenFree: React.FC<StartScreenFreeProps> = ({
  onPressLogin,
  onPressRegister,
}) => {
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
}

export const StartScreen: React.FC = () => {
  const navigation = useAppNavigation();

  return (
    <StartScreenFree
      onPressLogin={() => {
        navigation.replace("Login");
      }}
      onPressRegister={() => {
        navigation.replace("Register");
      }}
    />
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
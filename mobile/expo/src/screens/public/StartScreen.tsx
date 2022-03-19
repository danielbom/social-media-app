import React from 'react';
import { StartScreenFree } from '../../components/screens/StartScreenFree';
import { useAppNavigation } from '../../hooks/useAppNavigation';

export const StartScreen: React.FC = () => {
  const navigation = useAppNavigation();

  return (
    <StartScreenFree
      onPressLogin={() => {
        navigation.replace('Login');
      }}
      onPressRegister={() => {
        navigation.replace('Register');
      }}
    />
  );
};

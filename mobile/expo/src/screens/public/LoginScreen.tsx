import React from 'react';
import { LoginScreenFree } from '../../components/screens/LoginScreenFree';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { useRouting } from '../../hooks/useRouting';

export const LoginScreen = () => {
  const routing = useRouting();
  const navigation = useAppNavigation();

  return (
    <LoginScreenFree
      onSubmit={values => {
        console.log(values);
        routing.authorize();
      }}
      onPressBackButton={() => {
        navigation.replace('Start');
      }}
      onPressRegister={() => {
        navigation.replace('Register');
      }}
      onPressResetPassword={() => {
        navigation.replace('ResetPassword');
      }}
    />
  );
};

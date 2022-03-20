import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { RoutingProvider } from '../contexts/RoutingContext';
import { store } from '../store';
import { AppRouter } from './AppRouter';

export const AppRoot: React.FC = () => {
  return (
    <ReduxProvider store={store}>
      <RoutingProvider>
        <AppRouter />
      </RoutingProvider>
    </ReduxProvider>
  );
};

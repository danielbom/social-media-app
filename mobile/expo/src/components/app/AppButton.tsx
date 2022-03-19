import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

type AppSubmitProps = {
  onPress?: () => any;
  mode?: 'text' | 'outlined' | 'contained' | undefined;
};

export const AppButton: React.FC<AppSubmitProps> = ({
  mode,
  children,
  onPress,
}) => {
  return (
    <Button
      mode={mode || 'contained'}
      labelStyle={styles.text}
      onPress={onPress}>
      {children}
    </Button>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
  },
});

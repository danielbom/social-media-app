import React from 'react';
import {
  StyleSheet,
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { theme } from '../../core/theme';

type AppLinkProps = {
  textProps?: TextProps;
} & TouchableOpacityProps;

export const AppLink: React.FC<AppLinkProps> = ({
  children,
  textProps,
  ...props
}) => {
  const {
    style: textStyles,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    children: _,
    ...textPropsRest
  } = textProps || {};

  return (
    <TouchableOpacity {...props}>
      <Text style={[styles.link, textStyles]} {...textPropsRest}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

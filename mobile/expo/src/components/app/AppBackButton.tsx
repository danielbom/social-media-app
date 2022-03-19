import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  OpaqueColorValue,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

type AppBackButtonProps = {
  size?: number;
  color?: string | OpaqueColorValue;
} & TouchableOpacityProps;

export const AppBackButton: React.FC<AppBackButtonProps> = ({
  size,
  color,
  ...props
}) => {
  return (
    <TouchableOpacity {...props}>
      <Ionicons name="arrow-back" size={size ?? 24} color={color ?? 'black'} />
    </TouchableOpacity>
  );
};

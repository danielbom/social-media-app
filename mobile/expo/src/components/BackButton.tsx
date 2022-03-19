import { Ionicons } from '@expo/vector-icons';
import { OpaqueColorValue, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type BackButtonProps = {
  size?: number;
  color?: string | OpaqueColorValue;
} & TouchableOpacityProps

export const BackButton: React.FC<BackButtonProps> = ({ size, color, ...props }) => {
  return (
    <TouchableOpacity {...props}>
      <Ionicons
        name="arrow-back"
        size={size ?? 24}
        color={color ?? "black"}
      />
    </TouchableOpacity>
  );
}

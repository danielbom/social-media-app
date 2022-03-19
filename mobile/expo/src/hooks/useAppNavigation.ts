import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppStackParamList } from "../screens/AppRouter";

export const useAppNavigation = () => {
  return useNavigation<NativeStackNavigationProp<AppStackParamList>>();
}

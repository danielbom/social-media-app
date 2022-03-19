import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import { StartScreen } from './public/StartScreen';
import { LoginScreen } from './public/LoginScreen';
import { RegisterScreen } from './public/RegisterScreen';
import { ResetPasswordScreen } from './public/ResetPasswordScreen';

type WithoutParams = undefined;

export type AppStackParamList = {
  Start: WithoutParams;
  Login: WithoutParams;
  Register: WithoutParams;
  ResetPassword: WithoutParams;
};

const PublicStack = createNativeStackNavigator<AppStackParamList>();

export const AppRouter: React.FC = () => {
  return (
    <NavigationContainer>
      <PublicStack.Navigator initialRouteName='Start' screenOptions={{ headerShown: false }}>
        <PublicStack.Screen name="Start" component={StartScreen} />
        <PublicStack.Screen name="Login" component={LoginScreen} />
        <PublicStack.Screen name="Register" component={RegisterScreen} />
        <PublicStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      </PublicStack.Navigator>
    </NavigationContainer>
  );
}

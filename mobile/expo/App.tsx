import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { StyleSheet, SafeAreaView } from 'react-native';
import { theme } from './src/core/theme';
import { LoginScreen } from './src/screens/public/LoginScreen';
import { RegisterScreen } from './src/screens/public/RegisterScreen';
import { ResetPasswordScreen } from './src/screens/public/ResetPasswordScreen';
import { StartScreen } from './src/screens/public/StartScreen';
import { HomeScreen } from './src/screens/private/HomeScreen';

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <LoginScreen />
        {/* <RegisterScreen /> */}
        {/* <ResetPasswordScreen /> */}
        {/* <StartScreen /> */}
        {/* <HomeScreen /> */}
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  }
});

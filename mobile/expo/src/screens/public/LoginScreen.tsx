import { LoginScreenFree } from "../../components/screens/LoginScreenFree";
import { useAppNavigation } from "../../hooks/useAppNavigation";

export const LoginScreen = () => {
  const navigation = useAppNavigation();

  return (
    <LoginScreenFree
      onSubmit={(values) => {
        console.log(values)
      }}
      onPressBackButton={() => {
        navigation.replace("Start");
      }}
      onPressRegister={() => {
        navigation.replace("Register");
      }}
      onPressResetPassword={() => {
        navigation.replace("ResetPassword");
      }}
    />
  );
};

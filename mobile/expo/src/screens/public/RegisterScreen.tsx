import { RegisterScreenFree } from "../../components/screens/RegisterScreenFree";
import { useAppNavigation } from "../../hooks/useAppNavigation";

export const RegisterScreen = () => {
  const navigation = useAppNavigation();

  return (
    <RegisterScreenFree
      onSubmit={(values) => {
        console.log(values)
      }}
      onPressBackButton={() => {
        navigation.replace("Start");
      }}
      onPressLogin={() => {
        navigation.replace("Login");
      }}
    />
  );
};

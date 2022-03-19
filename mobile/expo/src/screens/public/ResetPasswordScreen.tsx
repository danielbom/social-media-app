import { ResetPasswordScreenFree } from "../../components/screens/ResetPasswordScreenFree";
import { useAppNavigation } from "../../hooks/useAppNavigation";

export const ResetPasswordScreen = () => {
  const navigation = useAppNavigation();

  return (
    <ResetPasswordScreenFree
      onSubmit={(values) => {
        console.log(values)
      }}
      onPressBackButton={() => {
        navigation.replace("Start");
      }}
    />
  );
};

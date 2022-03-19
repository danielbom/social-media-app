import React, { useRef } from 'react';
import * as Yup from "yup";
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Formik, FormikHelpers } from 'formik';

import { FormikTextInput } from '../../components/formik/FormitTextInput';
import { TemplateScreen } from './TemplateScreen';
import { AppLink } from '../../components/app/AppLink';
import { AppButton } from '../../components/app/AppButton';
import { useAppNavigation } from '../../hooks/useAppNavigation';

type Values = {
  username: string;
  password: string;
};

type RegisterScreenFreeProps = {
  onSubmit: (values: Values, formikHelpers: FormikHelpers<Values>) => void;
  onPressBackButton: () => void;
  onPressLogin: () => void;
};

export const RegisterScreenFree: React.FC<RegisterScreenFreeProps> = ({
  onSubmit,
  onPressBackButton,
  onPressLogin,
}) => {
  const ref2 = useRef<TextInput>(null);
  const initialValues = { username: '', password: '' };
  const validationSchema = Yup.object({
    username: Yup.string().required('Campo obrigatório'),
    password: Yup
      .string()
      .required('Campo obrigatório')
      .min(8, 'Mínimo de 8 caracteres')
  });

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      {form => {
        async function onPressSubmit() {
          await form.submitForm();
        }

        return (
          <TemplateScreen
            headerText="Crie sua conta"
            onPressBackButton={onPressBackButton}
          >
            <FormikTextInput
              label="Usuário"
              name="username"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => ref2.current?.focus()}
              containerStyles={styles.input}
            />
            <FormikTextInput
              inputRef={ref2}
              label="Senha"
              name="password"
              secureTextEntry
              returnKeyType="done"
              containerStyles={styles.input}
              onSubmitEditing={() => onPressSubmit()}
            />

            <AppButton onPress={onPressSubmit}>
              Salvar
            </AppButton>

            <View style={styles.loginContainer}>
              <Text>Você já possui uma conta? </Text>

              <AppLink onPress={onPressLogin}>
                Entrar
              </AppLink>
            </View>
          </TemplateScreen>
        )
      }}
    </Formik>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 12,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
});

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

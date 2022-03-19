import React, { useRef } from 'react';
import * as Yup from 'yup';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Formik, FormikHelpers } from 'formik';

import { theme } from '../../core/theme';
import { AppLink } from '../../components/app/AppLink';
import { AppButton } from '../../components/app/AppButton';
import { FormikTextInput } from '../../components/formik/FormitTextInput';
import { TemplateScreen } from './TemplateScreen';

type Values = {
  username: string;
  password: string;
};

type LoginScreenFreeProps = {
  onSubmit: (values: Values, formikHelpers: FormikHelpers<Values>) => void;
  onPressBackButton: () => void;
  onPressRegister: () => void;
  onPressResetPassword: () => void;
};

export const LoginScreenFree: React.FC<LoginScreenFreeProps> = ({
  onSubmit,
  onPressBackButton,
  onPressRegister,
  onPressResetPassword,
}) => {
  const ref2 = useRef<TextInput>(null);
  const initialValues = { username: '', password: '' };
  const validationSchema = Yup.object({
    username: Yup.string().required('Campo obrigatório'),
    password: Yup.string()
      .required('Campo obrigatório')
      .min(8, 'Mínimo de 8 caracteres'),
  });

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}>
      {form => {
        async function onPressSubmit() {
          await form.submitForm();
        }

        return (
          <TemplateScreen
            headerText="Bem-vindo de volta!"
            onPressBackButton={onPressBackButton}>
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

            <View style={styles.forgotPassword}>
              <TouchableOpacity onPress={onPressResetPassword}>
                <Text style={styles.forgot}>Esqueceu sua senha?</Text>
              </TouchableOpacity>
            </View>

            <AppButton onPress={onPressSubmit}>Entrar</AppButton>

            <View style={styles.registerContainer}>
              <Text>Ainda não possui uma conta? </Text>
              <AppLink onPress={onPressRegister}>Registrar</AppLink>
            </View>
          </TemplateScreen>
        );
      }}
    </Formik>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  input: {
    marginBottom: 12,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.subtitle,
  },
});

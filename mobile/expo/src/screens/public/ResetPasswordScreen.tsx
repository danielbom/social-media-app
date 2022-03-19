import React from 'react';
import * as Yup from "yup";
import { StyleSheet } from 'react-native';
import { Formik, FormikHelpers } from 'formik';

import { FormikTextInput } from '../../components/formik/FormitTextInput';
import { TemplateScreen } from './TemplateScreen';
import { AppButton } from '../../components/app/AppButton';

type Values = {
  username: string;
};

type ResetPasswordScreenServerlessProps = {
  onSubmit: (values: Values, formikHelpers: FormikHelpers<Values>) => void;
};

export const ResetPasswordScreenServerless: React.FC<ResetPasswordScreenServerlessProps> = ({
  onSubmit,
}) => {
  const initialValues = { username: '' };
  const validationSchema = {
    username: Yup.string().required('Campo obrigatório'),
  };

  function onPressBackButton() {
    console.log("BackButton");
  }

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
            headerText="Recuperar senha"
            onPressBackButton={onPressBackButton}
          >
            <FormikTextInput
              label="Usuário"
              name="username"
              autoCapitalize="none"
              returnKeyType="next"
              containerStyles={styles.input}
              description="Você receberá um email com instruções para atualizar sua senha."
            />

            <AppButton onPress={onPressSubmit}>
              Enviar pedido
            </AppButton>
          </TemplateScreen>
        )
      }}
    </Formik>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 24,
  },
});

export const ResetPasswordScreen = () => {
  return (
    <ResetPasswordScreenServerless
      onSubmit={(values) => {
        console.log(values)
      }}
    />
  );
};

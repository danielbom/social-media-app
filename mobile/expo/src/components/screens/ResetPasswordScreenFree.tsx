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

type ResetPasswordScreenFreeProps = {
  onSubmit: (values: Values, formikHelpers: FormikHelpers<Values>) => void;
  onPressBackButton: () => void;
};

export const ResetPasswordScreenFree: React.FC<ResetPasswordScreenFreeProps> = ({
  onSubmit,
  onPressBackButton
}) => {
  const initialValues = { username: '' };
  const validationSchema = Yup.object({
    username: Yup.string().required('Campo obrigatório'),
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
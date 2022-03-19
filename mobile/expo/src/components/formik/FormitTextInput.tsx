import React from 'react';
import { useField } from 'formik';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import { TextInput as PaperTextInput } from 'react-native-paper';
import { TextInputProps } from 'react-native-paper/lib/typescript/components/TextInput/TextInput';
import { theme } from '../../core/theme';
import { FormikDescription } from './FormikDescription';

import { FormikError } from './FormikError';

type FormikTextFieldProps = {
  name: string;
  description?: string;
  autoComplete?: boolean;
  inputRef?: React.Ref<TextInput>;
  containerStyles?: StyleProp<ViewStyle>;
} & Omit<TextInputProps, 'theme'>;

export const FormikTextInput: React.FC<FormikTextFieldProps> = ({
  name,
  description,
  autoComplete,
  inputRef,
  containerStyles,
  ...props
}) => {
  const [field, meta] = useField(name);

  return (
    <View style={[styles.container, containerStyles]}>
      <PaperTextInput
        // Styles
        mode="outlined"
        underlineColor="transparent"
        style={[styles.input, props.style]}
        selectionColor={theme.colors.primary}
        // Control Value
        value={field.value}
        onChangeText={field.onChange(name)}
        onBlur={field.onBlur(name)}
        // Forced mapping
        autoComplete={autoComplete || false}
        ref={inputRef}
        {...props}
      />
      <FormikDescription description={description} />
      <FormikError meta={meta} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  description: {
    color: theme.colors.subtitle,
    fontSize: 13,
    paddingTop: 8,
  },
});

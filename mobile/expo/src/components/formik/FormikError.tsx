import { FieldMetaProps } from "formik";
import { StyleSheet, Text } from 'react-native';
import { theme } from "../../core/theme";

type FormikErrorProps = {
  meta: FieldMetaProps<any>
}

export const FormikError: React.FC<FormikErrorProps> = ({ meta }) => {
  if (meta && meta.touched && meta.error) {
    return <Text style={styles.error}>{meta.error}</Text>
  }
  return null;
};

const styles = StyleSheet.create({
  error: {
    color: theme.colors.error,
    fontSize: 13,
    paddingTop: 8,
    paddingStart: 6
  },
})

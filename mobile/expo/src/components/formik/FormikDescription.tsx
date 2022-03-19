import React from 'react';
import { StyleSheet, Text } from 'react-native';

type FormikDescriptionProps = {
  description?: string;
};

export const FormikDescription: React.FC<FormikDescriptionProps> = ({
  description,
}) => {
  if (description) {
    return <Text style={styles.description}>{description}</Text>;
  }
  return null;
};

const styles = StyleSheet.create({
  description: {
    fontSize: 13,
    paddingBottom: 8,
    paddingStart: 6,
  },
});

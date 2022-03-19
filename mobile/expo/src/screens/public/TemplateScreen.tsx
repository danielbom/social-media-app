import React from 'react';
import { Keyboard, KeyboardAvoidingView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

import { BackButton } from '../../components/BackButton';
import { theme } from '../../core/theme';

type TemplateScreenProps = {
  headerText?: string;
  onPressBackButton?: () => any;
};

export const TemplateScreen: React.FC<TemplateScreenProps> = ({
  children,
  headerText,
  onPressBackButton
}) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.screen}>
        <View style={styles.screenHeader}>
          {onPressBackButton ? <BackButton onPress={onPressBackButton} /> : null}
        </View>
        <View style={styles.center}>
          <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding">
              <View style={styles.headerContainer}>
                <View style={styles.headerLogo}>
                  <Text style={styles.headerLogoText}>Logo</Text>
                </View>
                <Text style={styles.headerText}>
                  {headerText}
                </Text>
              </View>
              {children}
            </KeyboardAvoidingView>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  screenHeader: {
    paddingTop: 24,
    paddingHorizontal: 24
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: 20,
    width: '100%',
    maxWidth: 340,
  },
  headerContainer: {
    alignItems: "center"
  },
  headerLogo: {
    height: 110,
    width: 110,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary
  },
  headerLogoText: {
    color: "#fff"
  },
  headerText: {
    fontSize: 21,
    fontWeight: 'bold',
    paddingVertical: 12,
  },
});

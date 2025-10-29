import { Text, Spacer, Flex, useColor, Button, Input } from "@artsy/palette-mobile"
import { BackButton } from "app/system/navigation/BackButton"
import { useScreenDimensions } from "app/utils/hooks"
import { useFormikContext } from "formik"
import React from "react"
import { KeyboardAvoidingView, ScrollView } from "react-native"
import { ForgotPasswordFormProps, ForgotPasswordValuesSchema } from "./ForgotPassword"

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  navigation,
  requestedPasswordReset,
  inputRef,
}) => {
  const { values, handleSubmit, handleChange, validateForm, isValid, dirty, isSubmitting } =
    useFormikContext<ForgotPasswordValuesSchema>()
  const color = useColor()

  return (
    <Flex flex={1} backgroundColor="background" flexGrow={1} pb={1}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingTop: useScreenDimensions().safeAreaInsets.top }}
          keyboardShouldPersistTaps="always"
        >
          <Flex flex={1} px={2} pt={6} justifyContent="flex-start">
            <Text variant="lg-display">Forgot Password?</Text>
            <Text pt={0.5} color="mono100" variant="xs">
              Please enter the email address associated with your Artsy account to receive a reset
              link.
            </Text>
            <Spacer y={2} />

            {!!requestedPasswordReset ? (
              <Text color="blue100">Password reset link sent. Please check your email.</Text>
            ) : (
              <Input
                ref={inputRef}
                autoCapitalize="none"
                autoComplete="email"
                enableClearButton
                keyboardType="email-address"
                onChangeText={(text) => {
                  handleChange("email")(text.trim())
                }}
                onSubmitEditing={() => {
                  if (dirty) {
                    handleSubmit()
                  }
                }}
                onBlur={() => {
                  validateForm()
                }}
                blurOnSubmit={false} // This is needed to avoid UI jump when the user submits
                placeholder="Email address"
                placeholderTextColor={color("mono30")}
                value={values.email}
                returnKeyType="done"
                spellCheck={false}
                autoCorrect={false}
                textContentType="emailAddress"
                testID="email-address"
              />
            )}
          </Flex>
        </ScrollView>
        <BackButton onPress={() => navigation.goBack()} />
        <Flex px={2} paddingBottom={2}>
          {!!requestedPasswordReset ? (
            <>
              <Button
                variant="fillDark"
                onPress={() => navigation.goBack()}
                block
                haptic="impactMedium"
                testID="returnToLoginButton"
              >
                Return to login
              </Button>
              <Spacer y={1} />
              <Button
                onPress={() => handleSubmit()}
                block
                haptic="impactMedium"
                disabled={!isValid || !dirty}
                loading={isSubmitting}
                testID="resetButton"
                variant="outline"
              >
                Send Again
              </Button>
            </>
          ) : (
            <Button
              onPress={() => handleSubmit()}
              block
              variant="fillDark"
              haptic="impactMedium"
              disabled={!isValid || !dirty}
              loading={isSubmitting}
              testID="resetButton"
            >
              Send Reset Link
            </Button>
          )}
        </Flex>
      </KeyboardAvoidingView>
    </Flex>
  )
}

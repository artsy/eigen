import { StackScreenProps } from "@react-navigation/stack"
import { useFormikContext } from "formik"
import { Input } from "lib/Components/Input/Input"
import { color } from "palette"
import React from "react"
import {
  OnboardingCreateAccountNavigationStack,
  OnboardingCreateAccountScreenWrapper,
  UserSchema,
} from "./OnboardingCreateAccount"

export interface OnboardingCreateAccountEmailParams {
  navigateToWelcomeScreen: () => void
}

interface OnboardingCreateAccountEmailProps
  extends StackScreenProps<OnboardingCreateAccountNavigationStack, "OnboardingCreateAccountEmail"> {}

export const OnboardingCreateAccountEmail: React.FC<OnboardingCreateAccountEmailProps> = ({ route }) => {
  const { values, handleChange, errors, setErrors, handleSubmit } = useFormikContext<UserSchema>()

  return (
    <OnboardingCreateAccountScreenWrapper
      onBackButtonPress={route.params.navigateToWelcomeScreen}
      title="Sign up with email"
    >
      <Input
        autoCapitalize="none"
        autoCompleteType="email"
        enableClearButton
        autoFocus
        keyboardType="email-address"
        onChangeText={(text) => {
          // Hide error when the user starts to type again
          if (errors.email) {
            setErrors({
              email: undefined,
            })
          }
          handleChange("email")(text.trim())
        }}
        onSubmitEditing={handleSubmit}
        blurOnSubmit={false}
        placeholder="Email address"
        placeholderTextColor={color("black30")}
        value={values.email}
        returnKeyType="next"
        spellCheck={false}
        autoCorrect={false}
        textContentType="emailAddress"
        error={errors.email}
        testID="emailInput"
      />
    </OnboardingCreateAccountScreenWrapper>
  )
}

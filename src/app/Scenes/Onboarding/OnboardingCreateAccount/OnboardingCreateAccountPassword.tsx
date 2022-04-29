import { StackScreenProps } from "@react-navigation/stack"
import { useFormikContext } from "formik"
import { Input } from "palette"
import { useColor } from "palette/hooks"
import React from "react"
import {
  OnboardingCreateAccountNavigationStack,
  OnboardingCreateAccountScreenWrapper,
  UserSchema,
} from "./OnboardingCreateAccount"

interface OnboardingCreateAccountPasswordProps
  extends StackScreenProps<
    OnboardingCreateAccountNavigationStack,
    "OnboardingCreateAccountPassword"
  > {}

export const OnboardingCreateAccountPassword: React.FC<OnboardingCreateAccountPasswordProps> = ({
  navigation,
}) => {
  const color = useColor()
  const { values, handleSubmit, handleChange, errors, setErrors } = useFormikContext<UserSchema>()

  return (
    <OnboardingCreateAccountScreenWrapper
      onBackButtonPress={navigation.goBack}
      title="Create a Password"
      caption="Password must be at least 8 characters and include a lowercase letter, uppercase letter, and digit."
    >
      <Input
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        autoFocus
        onChangeText={(text) => {
          // Hide error when the user starts to type again
          if (errors.password) {
            setErrors({
              password: undefined,
            })
          }
          handleChange("password")(text)
        }}
        onSubmitEditing={handleSubmit}
        blurOnSubmit={false}
        placeholder="Password"
        placeholderTextColor={color("black30")}
        secureTextEntry
        returnKeyType="done"
        // We need to to set textContentType to password here
        // enable autofill of login details from the device keychain.
        textContentType="password"
        value={values.password}
        error={errors.password}
        testID="passwordInput"
      />
    </OnboardingCreateAccountScreenWrapper>
  )
}

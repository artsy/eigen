import { Input, useColor } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { useFormikContext } from "formik"
import {
  OnboardingCreateAccountNavigationStack,
  OnboardingCreateAccountScreenWrapper,
  UserSchema,
} from "./OnboardingCreateAccount"

type OnboardingCreateAccountPasswordProps = StackScreenProps<
  OnboardingCreateAccountNavigationStack,
  "OnboardingCreateAccountPassword"
>

export const OnboardingCreateAccountPassword: React.FC<OnboardingCreateAccountPasswordProps> = ({
  navigation,
}) => {
  const color = useColor()
  const { handleSubmit, handleChange, errors, setErrors } = useFormikContext<UserSchema>()

  return (
    <OnboardingCreateAccountScreenWrapper
      onBackButtonPress={navigation.goBack}
      title="Create a Password"
      caption="Password must be at least 8 characters and include a lowercase letter, uppercase letter, and digit."
    >
      <Input
        autoCapitalize="none"
        autoComplete="password"
        title="Password"
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
        placeholderTextColor={color("mono30")}
        placeholder="Password"
        secureTextEntry
        returnKeyType="done"
        // We need to to set textContentType to password here
        // enable autofill of login details from the device keychain.
        textContentType="password"
        error={errors.password}
        testID="passwordInput"
      />
    </OnboardingCreateAccountScreenWrapper>
  )
}

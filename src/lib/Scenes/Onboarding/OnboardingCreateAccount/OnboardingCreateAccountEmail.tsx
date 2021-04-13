import { StackScreenProps } from "@react-navigation/stack"
import { useFormikContext } from "formik"
import { Input } from "lib/Components/Input/Input"
import { BackButton } from "lib/navigation/BackButton"
import { color, Flex, Spacer, Text } from "palette"
import React from "react"
import { OnboardingCreateAccountNavigationStack, UserSchema } from "./OnboardingCreateAccount"

export interface OnboardingCreateAccountEmailParams {
  navigateToWelcomeScreen: () => void
}

interface OnboardingCreateAccountEmailProps
  extends StackScreenProps<OnboardingCreateAccountNavigationStack, "OnboardingCreateAccountEmail"> {}

export const OnboardingCreateAccountEmail: React.FC<OnboardingCreateAccountEmailProps> = ({ route }) => {
  const { values, handleSubmit, handleChange, validateForm, errors } = useFormikContext<UserSchema>()

  return (
    <Flex flex={1} justifyContent="center" alignItems="center" backgroundColor="white">
      <BackButton onPress={route.params.navigateToWelcomeScreen} />
      <Flex flex={1} px={1.5} paddingTop={60} justifyContent="flex-start" flexGrow={1}>
        <Text variant="largeTitle">Log in with email</Text>
        <Spacer mt={50} />
        <Input
          autoCapitalize="none"
          autoCompleteType="email"
          enableClearButton
          keyboardType="email-address"
          onChangeText={(text) => {
            handleChange("email")(text.trim())
          }}
          onSubmitEditing={() => {
            handleSubmit()
          }}
          onBlur={() => {
            validateForm()
          }}
          blurOnSubmit={false} // This is needed to avoid UI jump when the user submits
          placeholder="Email address"
          placeholderTextColor={color("black30")}
          title="Email"
          value={values.email}
          returnKeyType="next"
          spellCheck={false}
          autoCorrect={false}
          // We need to to set textContentType to username (instead of emailAddress) here
          // enable autofill of login details from the device keychain.
          textContentType="username"
          error={errors.email}
        />
      </Flex>
    </Flex>
  )
}

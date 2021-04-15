import { StackScreenProps } from "@react-navigation/stack"
import { useFormikContext } from "formik"
import { Input } from "lib/Components/Input/Input"
import { BackButton } from "lib/navigation/BackButton"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, color, Flex, Spacer, Text } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { OnboardingCreateAccountNavigationStack, UserSchema } from "./OnboardingCreateAccount"

interface OnboardingCreateAccountPasswordProps
  extends StackScreenProps<OnboardingCreateAccountNavigationStack, "OnboardingCreateAccountPassword"> {}

export const OnboardingCreateAccountPassword: React.FC<OnboardingCreateAccountPasswordProps> = ({ navigation }) => {
  const { values, handleSubmit, handleChange, validateForm, errors, setErrors } = useFormikContext<UserSchema>()

  return (
    <Flex backgroundColor="white" flexGrow={1}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingTop: useScreenDimensions().safeAreaInsets.top,
          justifyContent: "flex-start",
        }}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <BackButton onPress={navigation.goBack} />
        <Spacer mt={60} />
        <Box height={130}>
          <Text variant="largeTitle">Create a password</Text>
          <Spacer mt={1.5} />
          <Text variant="caption" color={color("black60")}>
            Password must be at least 8 characters and include a lowercase letter, uppercase letter, and digit.
          </Text>
        </Box>
        <Spacer mt={50} />
        <Input
          autoCapitalize="none"
          autoCompleteType="password"
          autoCorrect={false}
          autoFocus
          onChangeText={(text) => {
            // Hide error when the user starts to type again
            if (errors.password) {
              setErrors({
                password: undefined,
              })
              validateForm()
            }
            handleChange("password")(text)
          }}
          onSubmitEditing={handleSubmit}
          onBlur={() => validateForm()}
          placeholder="Password"
          placeholderTextColor={color("black30")}
          secureTextEntry
          returnKeyType="done"
          // We need to to set textContentType to password here
          // enable autofill of login details from the device keychain.
          textContentType="password"
          value={values.password}
          error={errors.password}
        />
      </ScrollView>
    </Flex>
  )
}

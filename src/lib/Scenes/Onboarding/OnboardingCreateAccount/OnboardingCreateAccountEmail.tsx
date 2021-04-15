import { StackScreenProps } from "@react-navigation/stack"
import { useFormikContext } from "formik"
import { Input } from "lib/Components/Input/Input"
import { BackButton } from "lib/navigation/BackButton"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, color, Flex, Spacer, Text } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { OnboardingCreateAccountNavigationStack, UserSchema } from "./OnboardingCreateAccount"

export interface OnboardingCreateAccountEmailParams {
  navigateToWelcomeScreen: () => void
}

interface OnboardingCreateAccountEmailProps
  extends StackScreenProps<OnboardingCreateAccountNavigationStack, "OnboardingCreateAccountEmail"> {}

export const OnboardingCreateAccountEmail: React.FC<OnboardingCreateAccountEmailProps> = ({ route }) => {
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
        keyboardShouldPersistTaps="always"
      >
        <BackButton onPress={route.params.navigateToWelcomeScreen} />
        <Spacer mt={60} />
        <Box height={130}>
          <Text variant="largeTitle">Sign up with email</Text>
        </Box>
        <Spacer mt={50} />
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
          onSubmitEditing={() => {
            handleSubmit()
          }}
          onBlur={() => {
            validateForm()
          }}
          blurOnSubmit={false}
          placeholder="Email address"
          placeholderTextColor={color("black30")}
          value={values.email}
          returnKeyType="next"
          spellCheck={false}
          autoCorrect={false}
          textContentType="username"
          error={errors.email}
        />
      </ScrollView>
    </Flex>
  )
}

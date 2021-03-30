import { StackScreenProps } from "@react-navigation/stack"
import { Formik } from "formik"
import { Input } from "lib/Components/Input/Input"
import { BackButton } from "lib/navigation/BackButton"
import { GlobalStore } from "lib/store/GlobalStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Button, color, Flex, Spacer, Text } from "palette"
import React, { useRef, useState } from "react"
import { ScrollView, View } from "react-native"
import * as Yup from "yup"
import { Touchable } from "../../../palette/elements/Touchable/Touchable"
import { OnboardingNavigationStack } from "./Onboarding"

interface OnboardingLoginProps extends StackScreenProps<OnboardingNavigationStack, "OnboardingLogin"> {}

interface OnboardingLoginForm {
  email: string
  password: string
}

export const loginSchema = Yup.object().shape({
  email: Yup.string().email("Please provide a valid email address"),
  password: Yup.string().test("password", "Password field is required", (value) => value !== ""),
})

export const OnboardingLogin: React.FC<OnboardingLoginProps> = ({ navigation }) => {
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const passwordInputRef = useRef<Input>(null)
  const emailInputRef = useRef<Input>(null)

  const handleLogin = async ({ email, password }: OnboardingLoginForm) => {
    try {
      setIsLoading(true)
      const res = await GlobalStore.actions.auth.signIn({
        email,
        password,
      })

      if (!res) {
        setShowErrorMessage(true)
      }
    } finally {
      passwordInputRef.current?.focus()
      setIsLoading(false)
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{ email: "", password: "" }}
      onSubmit={handleLogin}
      validationSchema={loginSchema}
      validateOnChange={false}
      validateOnBlur
    >
      {({ handleChange, handleSubmit, values, validateForm, errors, dirty, isValid }) => (
        <View style={{ flex: 1, backgroundColor: "white", flexGrow: 1 }}>
          <ScrollView
            contentContainerStyle={{ paddingTop: useScreenDimensions().safeAreaInsets.top }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
          >
            <BackButton onPress={() => navigation.goBack()} />
            <Flex flex={1} px={1.5} paddingTop={60} justifyContent="flex-start" flexGrow={1}>
              <Text variant="largeTitle">Log in with email</Text>
              <Spacer mt={50} />
              <Box>
                <Input
                  ref={emailInputRef}
                  autoCapitalize="none"
                  autoCompleteType="email"
                  enableClearButton
                  keyboardType="email-address"
                  onChangeText={(text) => {
                    // hide the error message when the user starts typing again
                    if (showErrorMessage) {
                      setShowErrorMessage(false)
                    }
                    handleChange("email")(text.trim())
                  }}
                  onSubmitEditing={() => {
                    validateForm()
                    passwordInputRef.current?.focus()
                  }}
                  onBlur={() => validateForm()}
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
                <Spacer mt={2} />
                <Input
                  autoCapitalize="none"
                  autoCompleteType="password"
                  autoCorrect={false}
                  onChangeText={(text) => {
                    // hide the error message when the user starts typing again
                    if (showErrorMessage) {
                      setShowErrorMessage(false)
                    }
                    handleChange("password")(text)
                  }}
                  onSubmitEditing={() => validateForm().then(() => handleSubmit())}
                  placeholder="Password"
                  placeholderTextColor={color("black30")}
                  ref={passwordInputRef}
                  secureTextEntry
                  title="Password"
                  returnKeyType="done"
                  // We need to to set textContentType to password here
                  // enable autofill of login details from the device keychain.
                  textContentType="password"
                  canHidePassword
                  value={values.password}
                  error={showErrorMessage ? "Incorrect email or password" : undefined}
                />
              </Box>
              <Spacer mt={4} />
              <Touchable
                onPress={() => {
                  navigation.navigate("OnboardingForgotPassword")
                }}
              >
                <Text variant="text" color="black60" style={{ textDecorationLine: "underline" }}>
                  Forgot password?
                </Text>
              </Touchable>
            </Flex>
          </ScrollView>
          <Flex alignSelf="flex-end" px={1.5} paddingBottom={1.5}>
            <Button
              onPress={() => validateForm().then(() => handleSubmit())}
              block
              haptic="impactMedium"
              disabled={!(isValid && dirty)}
              loading={isLoading}
            >
              Log in
            </Button>
          </Flex>
        </View>
      )}
    </Formik>
  )
}

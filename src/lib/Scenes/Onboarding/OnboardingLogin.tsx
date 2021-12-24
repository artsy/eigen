import { StackScreenProps } from "@react-navigation/stack"
import { FormikProvider, useFormik } from "formik"
import { BackButton } from "lib/navigation/BackButton"
import { GlobalStore } from "lib/store/GlobalStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Button, Flex, Input, Spacer, Text, useColor } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { ScrollView, View } from "react-native"
import * as Yup from "yup"
import { Touchable } from "../../../palette/elements/Touchable/Touchable"
import { OnboardingNavigationStack } from "./Onboarding"
import { OnboardingSocialPick } from "./OnboardingSocialPick"

export const OnboardingLogin: React.FC = () => <OnboardingSocialPick mode="login" />

interface OnboardingLoginProps extends StackScreenProps<OnboardingNavigationStack, "OnboardingLoginWithEmail"> {}

interface OnboardingLoginValuesSchema {
  email: string
  password: string
}

const loginSchemaFirstTry = Yup.object().shape({
  email: Yup.string(),
  password: Yup.string().test("password", "Password field is required", (value) => value !== ""),
})
const loginSchema = loginSchemaFirstTry.shape({
  email: Yup.string().email("Please provide a valid email address"),
})

export const OnboardingLoginWithEmail: React.FC<OnboardingLoginProps> = ({ navigation, route }) => {
  const color = useColor()
  const passwordInputRef = useRef<Input>(null)
  const emailInputRef = useRef<Input>(null)

  const [firstTry, setFirstTry] = useState(true)
  const formik = useFormik<OnboardingLoginValuesSchema>({
    initialValues: { email: "", password: "" },
    initialErrors: {},
    validationSchema: firstTry ? loginSchemaFirstTry : loginSchema,
    onSubmit: async ({ email, password }, { setStatus, validateForm }) => {
      setFirstTry(false)
      const res = await GlobalStore.actions.auth.signIn({ oauthProvider: "email", email, password })
      console.warn({ res })
      if (!res) {
        // For security purposes, we are returning a generic error message
        setStatus("Incorrect email or password")
        await validateForm()
      }
    },
  })
  const { values, status, handleSubmit, setStatus, handleChange, errors, isValid, dirty, isSubmitting } = formik

  /**
   * When we land on OnboardingLogin from the OnboardingCreateAccount
   * withFadeAnimation is set to true therefore if the user presses
   * on the back button to navigate to the welcome screen, the screen
   * fades instead of translating horizontally. To avoid that we need
   * to overwrite withFadeAnimation param once the screen shows up
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.setParams({ withFadeAnimation: false })
    }, 1000)
    if (route.params?.email) {
      handleChange("email")(route.params.email)
    }

    // When the user presses back on the back button immediately
    // after opening the screen, we need to clear the timeout to avoid
    // setting params on an unmounted screen
    return clearTimeout(timeout)
  }, [])

  return (
    <FormikProvider value={formik}>
      <View style={{ flex: 1, backgroundColor: "white", flexGrow: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingTop: useScreenDimensions().safeAreaInsets.top, paddingHorizontal: 20 }}
          keyboardShouldPersistTaps="always"
        >
          <Spacer mt={60} />
          <Text variant="lg">Log In</Text>
          <Spacer mt={50} />
          <Box>
            <Input
              ref={emailInputRef}
              autoCapitalize="none"
              autoCompleteType="email"
              // There is no need to autofocus here if we are getting
              // the email already from the navigation params
              autoFocus={!route.params?.email}
              keyboardType="email-address"
              onChangeText={(text) => {
                setStatus(undefined)
                handleChange("email")(text.trim())
              }}
              onSubmitEditing={() => {
                passwordInputRef.current?.focus()
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
            <Spacer mt={2} />
            <Input
              autoCapitalize="none"
              autoCompleteType="password"
              autoCorrect={false}
              // If we have the email already prefilled from the navigation params
              // we want the autoFocus to be on the password
              autoFocus={!!route.params?.email}
              onChangeText={(text) => {
                setStatus(undefined)
                handleChange("password")(text)
              }}
              onSubmitEditing={handleSubmit}
              placeholder="Password"
              placeholderTextColor={color("black30")}
              ref={passwordInputRef}
              secureTextEntry
              title="Password"
              returnKeyType="done"
              // We need to to set textContentType to password here
              // enable autofill of login details from the device keychain.
              textContentType="password"
              value={values.password}
              error={status ?? errors.password}
            />
          </Box>
          <Spacer mt={4} />
          <Touchable onPress={() => navigation.navigate("ForgotPassword", { email: values.email })}>
            <Text variant="sm" color="black60" style={{ textDecorationLine: "underline" }}>
              Forgot password?
            </Text>
          </Touchable>
        </ScrollView>
        <BackButton onPress={() => navigation.goBack()} />
        <Flex px={2} paddingBottom={2}>
          <Button
            onPress={handleSubmit}
            block
            haptic="impactMedium"
            disabled={!(isValid && dirty) || isSubmitting} // isSubmitting to prevent weird appearances of the errors caused by async submiting
            loading={isSubmitting}
            testID="loginButton"
            variant="fillDark"
          >
            Log in
          </Button>
        </Flex>
      </View>
    </FormikProvider>
  )
}

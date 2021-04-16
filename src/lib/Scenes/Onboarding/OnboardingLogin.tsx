import { StackScreenProps } from "@react-navigation/stack"
import { FormikProvider, useFormik, useFormikContext } from "formik"
import { Input } from "lib/Components/Input/Input"
import { BackButton } from "lib/navigation/BackButton"
import { GlobalStore } from "lib/store/GlobalStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Button, color, Flex, Spacer, Text } from "palette"
import React, { useEffect, useRef } from "react"
import { ScrollView, View } from "react-native"
import * as Yup from "yup"
import { Touchable } from "../../../palette/elements/Touchable/Touchable"
import { OnboardingNavigationStack } from "./Onboarding"

export interface OnboardingLoginProps extends StackScreenProps<OnboardingNavigationStack, "OnboardingLogin"> {}

export interface OnboardingLoginValuesSchema {
  email: string
  password: string
}

export const loginSchema = Yup.object().shape({
  email: Yup.string().email("Please provide a valid email address"),
  password: Yup.string().test("password", "Password field is required", (value) => value !== ""),
})

export const OnboardingLoginForm: React.FC<OnboardingLoginProps> = ({ navigation }) => {
  const {
    values,
    handleSubmit,
    handleChange,
    validateForm,
    errors,
    isValid,
    dirty,
    isSubmitting,
    setErrors,
  } = useFormikContext<OnboardingLoginValuesSchema>()

  const passwordInputRef = useRef<Input>(null)
  const emailInputRef = useRef<Input>(null)

  /**
   * When we land on OnboardingLogin from the OnboardingCreatAccount
   * withFadeAnimation is set to true therefore if the user presses
   * on the back button to navigate to the welcome screen, the screen
   * fades instead of translating horizontally. To avoid that we need
   * to overwrite withFadeAnimation param once the screen shows up
   */
  useEffect(() => {
    setTimeout(() => {
      navigation.setParams({ withFadeAnimation: false })
    }, 1000)
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: "white", flexGrow: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: useScreenDimensions().safeAreaInsets.top, paddingHorizontal: 15 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <BackButton onPress={() => navigation.goBack()} />
        <Spacer mt={60} />
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
            ref={passwordInputRef}
            secureTextEntry
            title="Password"
            returnKeyType="done"
            // We need to to set textContentType to password here
            // enable autofill of login details from the device keychain.
            textContentType="password"
            value={values.password}
            error={errors.password}
          />
        </Box>
        <Spacer mt={4} />
        <Touchable
          onPress={() => {
            navigation.navigate("ForgotPassword")
          }}
        >
          <Text variant="text" color="black60" style={{ textDecorationLine: "underline" }}>
            Forgot password?
          </Text>
        </Touchable>
      </ScrollView>
      <Flex alignSelf="flex-end" px={1.5} paddingBottom={1.5}>
        <Button
          onPress={handleSubmit}
          block
          haptic="impactMedium"
          disabled={!(isValid && dirty)}
          loading={isSubmitting}
          testID="loginButton"
        >
          Log in
        </Button>
      </Flex>
    </View>
  )
}

const initialValues: OnboardingLoginValuesSchema = { email: "", password: "" }

export const OnboardingLogin: React.FC<OnboardingLoginProps> = ({ navigation, route }) => {
  const formik = useFormik<OnboardingLoginValuesSchema>({
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    initialValues,
    initialErrors: {},
    onSubmit: async ({ email, password }, { setErrors, validateForm }) => {
      await validateForm()
      const res = await GlobalStore.actions.auth.signIn({
        email,
        password,
      })
      if (!res) {
        // For security purposes, we are returning a generic error message
        setErrors({ password: "Incorrect email or password" })
      }
    },
    validationSchema: loginSchema,
  })

  return (
    <FormikProvider value={formik}>
      <OnboardingLoginForm navigation={navigation} route={route} />
    </FormikProvider>
  )
}

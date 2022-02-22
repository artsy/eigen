import { StackScreenProps } from "@react-navigation/stack"
import { BackButton } from "app/navigation/BackButton"
import { GlobalStore } from "app/store/GlobalStore"
import { useScreenDimensions } from "app/utils/useScreenDimensions"
import { FormikProvider, useFormik, useFormikContext } from "formik"
import { Box, Button, Flex, Input, Spacer, Text, useColor } from "palette"
import React, { useEffect, useRef } from "react"
import { ScrollView, View } from "react-native"
import * as Yup from "yup"
import { Touchable } from "../../../palette/elements/Touchable/Touchable"
import { OnboardingNavigationStack } from "./Onboarding"
import { OnboardingSocialPick } from "./OnboardingSocialPick"

export const OnboardingLogin: React.FC = () => {
  return <OnboardingSocialPick mode="login" />
}

export interface OnboardingLoginProps
  extends StackScreenProps<OnboardingNavigationStack, "OnboardingLoginWithEmail"> {}

export interface OnboardingLoginValuesSchema {
  email: string
  password: string
}

export const loginSchema = Yup.object().shape({
  email: Yup.string().email("Please provide a valid email address"),
  password: Yup.string().test("password", "Password field is required", (value) => value !== ""),
})

export const OnboardingLoginWithEmailForm: React.FC<OnboardingLoginProps> = ({
  navigation,
  route,
}) => {
  const color = useColor()
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
    <View style={{ flex: 1, backgroundColor: "white", flexGrow: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: useScreenDimensions().safeAreaInsets.top,
          paddingHorizontal: 20,
        }}
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
            // If we have the email already prefilled from the navigation params
            // we want the autoFocus to be on the password
            autoFocus={!!route.params?.email}
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
  )
}

const initialValues: OnboardingLoginValuesSchema = { email: "", password: "" }

export const OnboardingLoginWithEmail: React.FC<OnboardingLoginProps> = ({ navigation, route }) => {
  const formik = useFormik<OnboardingLoginValuesSchema>({
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    initialValues,
    initialErrors: {},
    onSubmit: async ({ email, password }, { setErrors, validateForm }) => {
      validateForm()
      const res = await GlobalStore.actions.auth.signIn({
        oauthProvider: "email",
        email,
        password,
      })

      if (res === "otp_missing") {
        navigation.navigate("OnboardingLoginWithOTP", { email, password, otpMode: "standard" })
      } else if (res === "on_demand_otp_missing") {
        navigation.navigate("OnboardingLoginWithOTP", { email, password, otpMode: "on_demand" })
      }

      if (res !== "success" && res !== "otp_missing" && res !== "on_demand_otp_missing") {
        // For security purposes, we are returning a generic error message
        setErrors({ password: "Incorrect email or password" })
      }
    },
    validationSchema: loginSchema,
  })

  return (
    <FormikProvider value={formik}>
      <OnboardingLoginWithEmailForm navigation={navigation} route={route} />
    </FormikProvider>
  )
}

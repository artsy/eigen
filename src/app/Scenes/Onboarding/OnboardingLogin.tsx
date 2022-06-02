import { useNavigation } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { GlobalStore } from "app/store/GlobalStore"
import { useFormik } from "formik"
import { Button, Input, Screen, Spacer, Text, useColor } from "palette"
import { useEffect, useRef } from "react"
import { Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import * as Yup from "yup"
import { OnboardingNavigationStack } from "./Onboarding"
import { OnboardingSocialPick } from "./OnboardingSocialPick"

export const OnboardingLogin: React.FC = () => <OnboardingSocialPick mode="login" />

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

const initialValues: OnboardingLoginValuesSchema = { email: "", password: "" }

export const OnboardingLoginWithEmail: React.FC<OnboardingLoginProps> = ({ route }) => {
  const color = useColor()
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const f = useFormik({
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
        setErrors({ password: "Incorrect email or password" }) // pragma: allowlist secret
      }
    },
    validationSchema: loginSchema,
  })
  const emailInputRef = useRef<Input>(null)
  const passwordInputRef = useRef<Input>(null)

  // When we land on OnboardingLogin from the OnboardingCreateAccount
  // withFadeAnimation is set to true therefore if the user presses
  // on the back button to navigate to the welcome screen, the screen
  // fades instead of translating horizontally. To avoid that we need
  // to overwrite withFadeAnimation param once the screen shows up
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.setParams({ withFadeAnimation: false })
    }, 1000)
    if (route.params?.email) {
      f.handleChange("email")(route.params.email)
    }

    // When the user presses back on the back button immediately
    // after opening the screen, we need to clear the timeout to avoid
    // setting params on an unmounted screen
    return clearTimeout(timeout)
  }, [])

  return (
    <Screen>
      <Screen.FloatingHeader onBack={() => navigation.goBack()} />
      <Screen.Body {...(Platform.OS === "ios" && { scroll: true })}>
        <Spacer y={insets.top + 44} />

        <Text variant="lg">Log In</Text>

        <Spacer y="6" />

        <Input
          ref={emailInputRef}
          autoCapitalize="none"
          autoComplete="email"
          // There is no need to autofocus here if we are getting
          // the email already from the navigation params
          autoFocus={!route.params?.email}
          keyboardType="email-address"
          onChangeText={(text) => f.handleChange("email")(text.trim())}
          onSubmitEditing={() => {
            f.validateForm()
            passwordInputRef.current?.focus()
          }}
          onBlur={() => f.validateForm()}
          blurOnSubmit={false} // This is needed to avoid UI jump when the user submits
          placeholder="Email address"
          placeholderTextColor={color("black30")}
          title="Email"
          value={f.values.email}
          returnKeyType="next"
          spellCheck={false}
          autoCorrect={false}
          // We need to to set textContentType to username (instead of emailAddress) here
          // enable autofill of login details from the device keychain.
          textContentType="username"
          error={f.errors.email}
        />

        <Spacer y="2" />

        <Input
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          // If we have the email already prefilled from the navigation params
          // we want the autoFocus to be on the password
          autoFocus={!!route.params?.email}
          onChangeText={(text) => {
            // Hide error when the user starts to type again
            if (f.errors.password) {
              f.setErrors({
                password: undefined,
              })
              f.validateForm()
            }
            f.handleChange("password")(text)
          }}
          onSubmitEditing={f.handleSubmit}
          onBlur={() => f.validateForm()}
          placeholder="Password"
          placeholderTextColor={color("black30")}
          ref={passwordInputRef}
          secureTextEntry
          title="Password"
          returnKeyType="done"
          // We need to to set textContentType to password here
          // enable autofill of login details from the device keychain.
          textContentType="password"
          value={f.values.password}
          error={f.errors.password}
        />

        <Spacer y="4" />

        <Text
          variant="sm"
          color="black60"
          underline
          onPress={() => navigation.navigate("ForgotPassword")}
          testID="forgot-password"
        >
          Forgot password?
        </Text>

        <Spacer y="4" />

        <Screen.BottomView>
          <Button
            onPress={f.handleSubmit}
            block
            haptic="impactMedium"
            disabled={!(f.isValid && f.dirty) || f.isSubmitting} // isSubmitting to prevent weird appearances of the errors caused by async submiting
            loading={f.isSubmitting}
            testID="loginButton"
            variant="fillDark"
          >
            Log in
          </Button>
        </Screen.BottomView>
      </Screen.Body>
    </Screen>
  )
}

import { BackButton, Button, Flex, Spacer, Text, Touchable, useTheme } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { OnboardingHomeNavigationStack } from "app/Scenes/Onboarding/OnboardingHome"
import { GlobalStore } from "app/store/GlobalStore"
import { showBlockedAuthError } from "app/utils/auth/authHelpers"
import { FormikProvider, useFormik, useFormikContext } from "formik"
import * as Yup from "yup"

type LoginPasswordStepProps = StackScreenProps<OnboardingHomeNavigationStack, "LoginPasswordStep">

interface LoginPasswordStepFormValues {
  password: string
}

export const LoginPasswordStep: React.FC<LoginPasswordStepProps> = ({ navigation, route }) => {
  const formik = useFormik<LoginPasswordStepFormValues>({
    initialValues: { password: "" },
    onSubmit: async ({ password }, { setErrors }) => {
      const res = await GlobalStore.actions.auth.signIn({
        oauthProvider: "email",
        oauthMode: "email",
        email: route.params.email,
        password,
      })

      if (res === "otp_missing") {
        navigation.navigate("LoginOTPStep", {
          otpMode: "standard",
          email: route.params.email,
          password,
        })
      } else if (res === "on_demand_otp_missing") {
        navigation.navigate("LoginOTPStep", {
          otpMode: "on_demand",
          email: route.params.email,
          password,
        })
      }

      if (res === "auth_blocked") {
        showBlockedAuthError("sign in")
        return
      }

      if (res !== "success" && res !== "otp_missing" && res !== "on_demand_otp_missing") {
        // For security purposes, we are returning a generic error message
        setErrors({ password: "Incorrect email or password" }) // pragma: allowlist secret
      }
    },
    validationSchema: Yup.string().test(
      "password",
      "Password field is required",
      (value) => value !== ""
    ),
  })

  return (
    <BottomSheetScrollView>
      <FormikProvider value={formik}>
        <LoginPasswordStepForm />
      </FormikProvider>
    </BottomSheetScrollView>
  )
}

const LoginPasswordStepForm: React.FC = () => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    isValid,
    dirty,
    validateForm,
    setErrors,
  } = useFormikContext<LoginPasswordStepFormValues>()

  const { color, space } = useTheme()

  const navigation = useNavigation<StackNavigationProp<OnboardingHomeNavigationStack>>()

  const handleBackButtonPress = () => {
    navigation.goBack()
  }

  return (
    <Flex padding={2} gap={space(1)}>
      <BackButton onPress={handleBackButtonPress} />
      <Text variant="sm-display">Welcome back to Artsy</Text>

      <BottomSheetInput
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
            validateForm()
          }
          handleChange("password")(text)
        }}
        onSubmitEditing={() => {
          if (dirty && !!values.password) {
            handleSubmit()
          }
        }}
        onBlur={() => validateForm()}
        placeholderTextColor={color("black30")}
        secureTextEntry
        title="Password"
        returnKeyType="done"
        // We need to to set textContentType to password here
        // enable autofill of login details from the device keychain.
        textContentType="password"
        error={values.password.length > 0 || touched.password ? errors.password : undefined}
        testID="password"
      />

      <Spacer y={4} />

      <Touchable
        onPress={() => {
          navigation.navigate("ForgotPasswordStep")
        }}
      >
        <Text variant="sm" color="black60" underline>
          Forgot password?
        </Text>
      </Touchable>

      <Button block width={100} onPress={handleSubmit} disabled={!isValid}>
        Continue
      </Button>
    </Flex>
  )
}

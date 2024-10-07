import {
  BackButton,
  Button,
  Flex,
  Input,
  SimpleMessage,
  Spacer,
  Text,
  Touchable,
  useTheme,
} from "@artsy/palette-mobile"
import {
  useAuthNavigation,
  useAuthScreen,
} from "app/Scenes/Onboarding/Auth2/hooks/useAuthNavigation"
import { useInputAutofocus } from "app/Scenes/Onboarding/Auth2/hooks/useInputAutofocus"
import { GlobalStore } from "app/store/GlobalStore"
import { Formik, useFormikContext } from "formik"
import { useRef, useState } from "react"
import * as Yup from "yup"

interface LoginOTPStepFormValues {
  otp: string
}

export const LoginOTPStep: React.FC = () => {
  const screen = useAuthScreen()

  return (
    <Formik<LoginOTPStepFormValues>
      initialValues={{ otp: "" }}
      validateOnChange={false}
      validationSchema={Yup.object().shape({
        otp: Yup.string().required("This field is required"),
      })}
      onSubmit={async ({ otp }, { setErrors, resetForm }) => {
        const res = await GlobalStore.actions.auth.signIn({
          oauthProvider: "email",
          oauthMode: "email",
          email: screen.params?.email,
          password: screen.params?.password,
          otp: otp.trim(),
        })

        if (res === "invalid_otp") {
          setErrors({ otp: "Invalid two-factor authentication code" })
        } else if (res !== "success") {
          setErrors({ otp: "Something went wrong. Please try again, or contact support@artsy.net" })
        }

        if (res === "success") {
          resetForm()
        }
      }}
    >
      <LoginOTPStepForm />
    </Formik>
  )
}

const LoginOTPStepForm: React.FC = () => {
  const [recoveryCodeMode, setRecoveryCodeMode] = useState(false)

  const {
    errors,
    handleChange,
    handleSubmit,
    isValid,
    setErrors,
    validateForm,
    values,
    resetForm,
  } = useFormikContext<LoginOTPStepFormValues>()

  const navigation = useAuthNavigation()
  const screen = useAuthScreen()
  const otpRef = useRef<Input>(null)

  const { color } = useTheme()

  useInputAutofocus({
    screenName: "LoginOTPStep",
    inputRef: otpRef,
  })

  const handleBackButtonPress = () => {
    navigation.goBack()
    resetForm()
  }

  return (
    <Flex padding={2}>
      <BackButton onPress={handleBackButtonPress} />

      <Input
        autoCapitalize="none"
        autoComplete="one-time-code"
        autoCorrect={false}
        blurOnSubmit={false}
        error={errors.otp}
        keyboardType={recoveryCodeMode ? "ascii-capable" : "number-pad"}
        placeholder={recoveryCodeMode ? "Enter a recovery code" : "Enter an authentication code"}
        placeholderTextColor={color("black30")}
        ref={otpRef}
        returnKeyType="done"
        title={recoveryCodeMode ? "Recovery code" : "Authentication code"}
        value={values.otp}
        onChangeText={(text) => {
          // Hide error when the user starts to type again
          if (errors.otp) {
            setErrors({ otp: undefined })
            validateForm()
          }
          handleChange("otp")(text)
        }}
        onBlur={() => validateForm()}
      />

      <Spacer y={1} />

      {screen.params?.otpMode === "on_demand" && (
        <>
          <Spacer y={2} />

          <SimpleMessage testID="on_demand_message">
            Your safety and security are important to us. Please check your email for a one-time
            authentication code to complete your login.
          </SimpleMessage>
        </>
      )}

      <Spacer y={2} />

      <Button block width={100} onPress={handleSubmit} disabled={!isValid}>
        Continue
      </Button>

      <Spacer y={2} />

      <Touchable
        onPress={() => {
          setRecoveryCodeMode((mode) => !mode)
        }}
      >
        <Text variant="xs" color="black60" underline>
          {recoveryCodeMode ? "Enter authentication code" : "Enter recovery code instead"}
        </Text>
      </Touchable>
    </Flex>
  )
}

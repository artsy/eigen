import { BackButton, Button, Flex, Input, Spacer, Text, useTheme } from "@artsy/palette-mobile"
import {
  useAuthNavigation,
  useAuthScreen,
} from "app/Scenes/Onboarding/Screens/Auth/hooks/useAuthNavigation"
import { useInputAutofocus } from "app/Scenes/Onboarding/Screens/Auth/hooks/useInputAutofocus"
import { GlobalStore } from "app/store/GlobalStore"
import { Formik, useFormikContext } from "formik"
import { useEffect, useRef } from "react"
import * as Yup from "yup"

interface ForgotPasswordStepFormValues {
  email: string
}

export const ForgotPasswordStep: React.FC = () => {
  const navigation = useAuthNavigation()
  const screen = useAuthScreen()

  return (
    <Formik<ForgotPasswordStepFormValues>
      initialValues={{ email: screen.params?.email ?? "" }}
      onSubmit={async ({ email }, { setErrors }) => {
        const res = await GlobalStore.actions.auth.forgotPassword({
          email,
        })

        if (!res) {
          setErrors({
            email:
              "Couldn't send reset password link. Please try again, or contact support@artsy.net",
          })
        } else {
          navigation.setParams({ requestedPasswordReset: true })
        }
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Please provide a valid email address")
          .required("Email field is required"),
      })}
    >
      <ForgotPasswordStepForm />
    </Formik>
  )
}

const ForgotPasswordStepForm: React.FC = () => {
  const {
    dirty,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    isValid,
    validateForm,
    values,
    resetForm,
    setValues,
  } = useFormikContext<ForgotPasswordStepFormValues>()

  const navigation = useAuthNavigation()
  const screen = useAuthScreen()
  const { color } = useTheme()
  const forgotPasswordRef = useRef<Input>(null)

  const handleBackButtonPress = () => {
    navigation.goBack()
    resetForm({ values: { email: screen.params?.email ?? "" } })
  }

  const handleReturnToLoginPress = () => {
    navigation.navigate({ name: "LoginWelcomeStep" })
    resetForm({ values: { email: screen.params?.email ?? "" } })
  }

  const requestedPasswordReset = screen.params?.requestedPasswordReset

  useInputAutofocus({
    screenName: "ForgotPasswordStep",
    inputRef: forgotPasswordRef,
  })

  useEffect(() => {
    setValues({ email: screen.params?.email ?? "" })
  }, [screen.params?.email])

  return (
    <Flex padding={2}>
      <BackButton onPress={handleBackButtonPress} />
      <Spacer y={1} />

      <Flex flex={1} justifyContent="flex-start">
        <Text variant="sm-display">Forgot Password?</Text>

        {!requestedPasswordReset && (
          <Text pt={0.5} color="mono100" variant="xs">
            Please enter the email address associated with your Artsy account to receive a reset
            link.
          </Text>
        )}

        {!!requestedPasswordReset ? (
          <Text color="blue100" mt={1} variant="sm">
            Password reset link sent—check your email. Please note, you must wait 5 minutes to
            receive another link.
          </Text>
        ) : (
          <>
            <Spacer y={2} />
            <Input
              accessibilityHint="Enter your email address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              blurOnSubmit={false} // This is needed to avoid UI jump when the user submits
              enableClearButton
              keyboardType="email-address"
              placeholder="Email address"
              placeholderTextColor={color("mono30")}
              ref={forgotPasswordRef}
              returnKeyType="done"
              spellCheck={false}
              testID="email-address"
              textContentType="emailAddress"
              error={errors.email}
              defaultValue={values.email}
              onKeyPress={(e) => {
                // Avoid spaces from being submitted
                if (e.nativeEvent.key === "Space") {
                  e.preventDefault()
                }
              }}
              onChangeText={(text) => {
                handleChange("email")(text.trim())
              }}
              onSubmitEditing={() => {
                if (dirty) {
                  handleSubmit()
                }
              }}
              onBlur={() => {
                validateForm()
              }}
            />
          </>
        )}
      </Flex>

      <Spacer y={2} />

      {!!requestedPasswordReset ? (
        <>
          <Spacer y={2} />

          <Button
            variant="fillDark"
            onPress={handleReturnToLoginPress}
            block
            haptic="impactMedium"
            testID="returnToLoginButton"
          >
            Return to Login
          </Button>

          <Spacer y={1} />

          <Button
            onPress={() => handleSubmit()}
            block
            haptic="impactMedium"
            loading={isSubmitting}
            testID="resetButton"
            variant="outline"
          >
            Send Again
          </Button>
        </>
      ) : (
        <Button
          onPress={() => handleSubmit()}
          block
          variant="fillDark"
          haptic="impactMedium"
          disabled={!isValid}
          loading={isSubmitting}
          testID="resetButton"
        >
          Send Reset Link
        </Button>
      )}
    </Flex>
  )
}

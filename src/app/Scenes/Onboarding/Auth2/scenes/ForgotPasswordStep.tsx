import { BackButton, Button, Flex, Input, Spacer, Text, useTheme } from "@artsy/palette-mobile"
import {
  useAuthNavigation,
  useAuthScreen,
} from "app/Scenes/Onboarding/Auth2/hooks/useAuthNavigation"
import { useInputAutofocus } from "app/Scenes/Onboarding/Auth2/hooks/useInputAutofocus"
import { GlobalStore } from "app/store/GlobalStore"
import { Formik, useFormikContext } from "formik"
import { useRef } from "react"
import * as Yup from "yup"

interface ForgotPasswordStepFormValues {
  email: string
}

export const ForgotPasswordStep: React.FC = () => {
  const navigation = useAuthNavigation()

  return (
    <Formik<ForgotPasswordStepFormValues>
      initialValues={{ email: "" }}
      onSubmit={async ({ email }, { setErrors, resetForm }) => {
        const res = await GlobalStore.actions.auth.forgotPassword({
          email,
        })

        if (!res) {
          setErrors({
            email:
              "Couldn’t send reset password link. Please try again, or contact support@artsy.net",
          })
        } else {
          navigation.navigate({
            name: "ForgotPasswordStep",
            params: { requestedPasswordReset: true },
          })

          resetForm()
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
    handleChange,
    handleSubmit,
    isSubmitting,
    isValid,
    validateForm,
    values,
    resetForm,
  } = useFormikContext<ForgotPasswordStepFormValues>()

  const navigation = useAuthNavigation()
  const screen = useAuthScreen()
  const { color } = useTheme()
  const forgotPasswordRef = useRef<Input>(null)

  const handleBackButtonPress = () => {
    navigation.goBack()
    resetForm()
  }

  const requestedPasswordReset = screen.params?.requestedPasswordReset

  useInputAutofocus({
    screenName: "ForgotPasswordStep",
    inputRef: forgotPasswordRef,
  })

  return (
    <Flex padding={2}>
      <BackButton onPress={handleBackButtonPress} />

      <Spacer y={1} />

      <Flex flex={1} justifyContent="flex-start">
        <Text variant="lg-display">Forgot Password?</Text>

        {!requestedPasswordReset && (
          <Text pt={0.5} color="black100" variant="xs">
            Please enter the email address associated with your Artsy account to receive a reset
            link.
          </Text>
        )}

        {!!requestedPasswordReset ? (
          <Text color="blue100" mt={1} variant="sm">
            Password reset link sent. Please check your email.
          </Text>
        ) : (
          <>
            <Spacer y={2} />
            <Input
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              blurOnSubmit={false} // This is needed to avoid UI jump when the user submits
              enableClearButton
              keyboardType="email-address"
              placeholder="Email address"
              placeholderTextColor={color("black30")}
              ref={forgotPasswordRef}
              returnKeyType="done"
              spellCheck={false}
              testID="email-address"
              textContentType="emailAddress"
              value={values.email}
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
            onPress={() => navigation.navigate({ name: "LoginWelcomeStep" })}
            block
            haptic="impactMedium"
            testID="returnToLoginButton"
          >
            Return to login
          </Button>

          <Spacer y={1} />

          <Button
            onPress={handleSubmit}
            block
            haptic="impactMedium"
            disabled={!isValid || !dirty}
            loading={isSubmitting}
            testID="resetButton"
            variant="outline"
          >
            Send Again
          </Button>
        </>
      ) : (
        <Button
          onPress={handleSubmit}
          block
          variant="fillDark"
          haptic="impactMedium"
          disabled={!isValid || !dirty}
          loading={isSubmitting}
          testID="resetButton"
        >
          Send Reset Link
        </Button>
      )}
    </Flex>
  )
}

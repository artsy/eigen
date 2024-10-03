import { BackButton, Button, Flex, Input, Spacer, Text, useTheme } from "@artsy/palette-mobile"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { AuthNavigationStack } from "app/Scenes/Onboarding/Auth2/AuthScenes"
import { useAuthNavigation } from "app/Scenes/Onboarding/Auth2/hooks/useAuthNavigation"
import { OnboardingNavigationStack } from "app/Scenes/Onboarding/Onboarding"
import { GlobalStore } from "app/store/GlobalStore"
import { FormikProvider, useFormik, useFormikContext } from "formik"
import * as Yup from "yup"

interface ForgotPasswordStepFormValues {
  email: string
}

export const ForgotPasswordStep: React.FC = () => {
  const navigation = useAuthNavigation()

  const formik = useFormik<ForgotPasswordStepFormValues>({
    initialValues: { email: "" },
    onSubmit: async ({ email }, { setErrors }) => {
      const res = await GlobalStore.actions.auth.forgotPassword({
        email,
      })
      if (!res) {
        // For security purposes, we are returning a generic error message
        setErrors({
          email:
            "Couldn’t send reset password link. Please try again, or contact support@artsy.net",
        })
      } else {
        navigation.navigate("ForgotPasswordStep", { requestedPasswordReset: true })
      }
    },
    validationSchema: Yup.string().email("Please provide a valid email address"),
  })

  return (
    <FormikProvider value={formik}>
      <ForgotPasswordStepForm />
    </FormikProvider>
  )
}

const ForgotPasswordStepForm: React.FC = () => {
  const { dirty, handleChange, handleSubmit, isSubmitting, isValid, validateForm, values } =
    useFormikContext<ForgotPasswordStepFormValues>()

  const navigation = useNavigation<StackNavigationProp<OnboardingNavigationStack>>()
  const route = useRoute<RouteProp<AuthNavigationStack, "ForgotPasswordStep">>()

  const { color, space } = useTheme()

  const handleBackButtonPress = () => {
    navigation.goBack()
  }

  const requestedPasswordReset = route.params?.requestedPasswordReset

  return (
    <Flex padding={2} gap={space(1)}>
      <BackButton onPress={handleBackButtonPress} />
      <Flex flex={1} px={2} pt={6} justifyContent="flex-start">
        <Text variant="lg-display">Forgot Password?</Text>

        <Text pt={0.5} color="black100" variant="xs">
          Please enter the email address associated with your Artsy account to receive a reset link.
        </Text>

        <Spacer y={2} />

        {!!requestedPasswordReset ? (
          <Text color="blue100">Password reset link sent. Please check your email.</Text>
        ) : (
          <Input
            autoCapitalize="none"
            autoComplete="email"
            enableClearButton
            keyboardType="email-address"
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
            blurOnSubmit={false} // This is needed to avoid UI jump when the user submits
            placeholder="Email address"
            placeholderTextColor={color("black30")}
            value={values.email}
            returnKeyType="done"
            spellCheck={false}
            autoCorrect={false}
            textContentType="emailAddress"
            testID="email-address"
          />
        )}
      </Flex>

      <Flex px={2} paddingBottom={2}>
        {!!requestedPasswordReset ? (
          <>
            <Button
              variant="fillDark"
              onPress={() => navigation.goBack()}
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
    </Flex>
  )
}

import { BackButton, Button, Flex, Spacer, Text, useTheme } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { AuthenticationDialogFormValues } from "app/Scenes/Onboarding/AuthenticationDialog/AuthenticationDialogForm"
import { OnboardingHomeNavigationStack } from "app/Scenes/Onboarding/OnboardingHome"
import { useFormikContext } from "formik"

type ForgotPasswordStepProps = StackScreenProps<OnboardingHomeNavigationStack, "ForgotPasswordStep">

export const ForgotPasswordStep: React.FC<ForgotPasswordStepProps> = ({ navigation, route }) => {
  const requestedPasswordReset = route.params?.requestedPasswordReset

  const { dirty, handleChange, handleSubmit, isSubmitting, isValid, validateForm, values } =
    useFormikContext<AuthenticationDialogFormValues>()

  const { color, space } = useTheme()

  const handleBackButtonPress = () => {
    navigation.goBack()
  }

  return (
    <BottomSheetScrollView>
      <Flex padding={2} gap={space(1)}>
        <BackButton onPress={handleBackButtonPress} />
        <Flex flex={1} px={2} pt={6} justifyContent="flex-start">
          <Text variant="lg-display">Forgot Password?</Text>

          <Text pt={0.5} color="black100" variant="xs">
            Please enter the email address associated with your Artsy account to receive a reset
            link.
          </Text>

          <Spacer y={2} />

          {!!requestedPasswordReset ? (
            <Text color="blue100">Password reset link sent. Please check your email.</Text>
          ) : (
            <BottomSheetInput
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
    </BottomSheetScrollView>
  )
}

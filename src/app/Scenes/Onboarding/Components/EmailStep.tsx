import { BackButton, Button, Text } from "@artsy/palette-mobile"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { OnboardingStore } from "app/Scenes/Onboarding/OnboardingStore"
import { useAuthenticationFormContext } from "app/Scenes/Onboarding/useAuthenticationFormContext"
import { Field } from "formik"
import { useEffect } from "react"

export const EmailStep: React.FC = () => {
  const { handleBlur, handleChange, isValid, validateForm, values, validateField } =
    useAuthenticationFormContext()

  useEffect(() => {
    console.log("🦆", "isValid", { isValid })
  }, [isValid])

  useEffect(() => {
    console.log("🦜", "validateField")
  }, [validateField])

  useEffect(() => {
    console.log("🦅", "validateForm")
    validateForm()
  }, [validateForm])

  const navigateToWelcomeStep = OnboardingStore.useStoreActions(
    (actions) => actions.navigateToWelcomeStep
  )
  const navigateToLoginPasswordStep = OnboardingStore.useStoreActions(
    (actions) => actions.navigateToLoginPasswordStep
  )
  const navigateToSignUpPasswordStep = OnboardingStore.useStoreActions(
    (actions) => actions.navigateToSignUpPasswordStep
  )

  const handleContinueButtonPress = () => {
    const userExists = true

    if (userExists) {
      navigateToLoginPasswordStep()
    } else {
      navigateToSignUpPasswordStep()
    }
  }

  const handleBackButtonPress = () => {
    navigateToWelcomeStep()
  }

  return (
    <>
      <BackButton onPress={handleBackButtonPress} />

      <Text variant="sm-display">Sign up or log in</Text>

      <Field
        name="email"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        spellCheck={false}
        autoCorrect={false}
        component={BottomSheetInput}
        onBlur={handleBlur("email")}
        placeholder="Enter your email address"
        returnKeyType="done"
        title="Email"
        value={values.email}
        onChangeText={handleChange("email")}
      />

      <Button block width={100} onPress={handleContinueButtonPress} disabled={!isValid}>
        Continue
      </Button>
    </>
  )
}

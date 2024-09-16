import { BackButton, Button, Text } from "@artsy/palette-mobile"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { OnboardingStore } from "app/Scenes/Onboarding/OnboardingStore"
import { useAuthenticationFormContext } from "app/Scenes/Onboarding/useAuthenticationFormContext"
import { Field } from "formik"

export const LoginPasswordStep: React.FC = () => {
  const { handleChange, handleSubmit, isValid, values } = useAuthenticationFormContext()

  const navigateToEmailStep = OnboardingStore.useStoreActions(
    (actions) => actions.navigateToEmailStep
  )

  const handleBackButtonPress = () => {
    navigateToEmailStep()
  }

  return (
    <>
      <BackButton onPress={handleBackButtonPress} />
      <Text variant="sm-display">Welcome back to Artsy</Text>

      <Field
        name="password"
        autoCapitalize="none"
        autoComplete="current-password"
        autoCorrect={false}
        secureTextEntry
        component={BottomSheetInput}
        placeholder="Enter your password"
        returnKeyType="done"
        title="Password"
        value={values.password}
        onChangeText={handleChange("password")}
      />

      <Button block width={100} onPress={handleSubmit} disabled={!isValid}>
        Continue
      </Button>
    </>
  )
}

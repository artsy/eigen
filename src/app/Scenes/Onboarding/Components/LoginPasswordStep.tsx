import { BackButton, Button, Text } from "@artsy/palette-mobile"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { OnboardingStore } from "app/Scenes/Onboarding/OnboardingStore"
import { Field, Formik } from "formik"
import * as Yup from "yup"

export const LoginPasswordStep: React.FC = () => {
  const navigateToEmailStep = OnboardingStore.useStoreActions(
    (actions) => actions.navigateToEmailStep
  )

  const handleContinueButtonPress = () => {
    // TODO: login
    console.log("🐖")
  }

  const handleBackButtonPress = () => {
    navigateToEmailStep()
  }

  return (
    <Formik
      initialValues={{ password: "" }}
      onSubmit={handleContinueButtonPress}
      validationSchema={Yup.object().shape({
        password: Yup.string().min(8).matches(/[A-Z]/).matches(/[a-z]/).matches(/[0-9]/).required(),
      })}
      validateOnMount
    >
      {({ handleChange, handleSubmit, isValid, values }) => {
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
      }}
    </Formik>
  )
}

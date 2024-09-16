import { BackButton, Button, Text } from "@artsy/palette-mobile"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { OnboardingStore } from "app/Scenes/Onboarding/OnboardingStore"
import { Field, Formik } from "formik"
import * as Yup from "yup"

export const EmailStep: React.FC = () => {
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
    <Formik
      initialValues={{ email: "" }}
      onSubmit={handleContinueButtonPress}
      validationSchema={Yup.object().shape({
        email: Yup.string().email().required(),
      })}
      validateOnMount
    >
      {({ handleBlur, handleChange, handleSubmit, isValid, values }) => {
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

            <Button block width={100} onPress={handleSubmit} disabled={!isValid}>
              Continue
            </Button>
          </>
        )
      }}
    </Formik>
  )
}

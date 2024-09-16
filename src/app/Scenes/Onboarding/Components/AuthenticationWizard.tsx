import { EmailStep } from "app/Scenes/Onboarding/Components/EmailStep"
import { LoginPasswordStep } from "app/Scenes/Onboarding/Components/LoginPasswordStep"
import { WelcomeStep } from "app/Scenes/Onboarding/Components/WelcomeStep"
import { OnboardingStore } from "app/Scenes/Onboarding/OnboardingStore"
import { Formik } from "formik"
import { useCallback } from "react"
import * as Yup from "yup"

export const AuthenticationWizard = () => {
  const currentStep = OnboardingStore.useStoreState((state) => state.currentStep)

  const handleSubmit = () => {
    if (currentStep === "LoginPasswordStep") {
      // TODO: login
    }
  }

  const getValidationSchema = useCallback(() => {
    console.log({ currentStep })
    switch (currentStep) {
      case "EmailStep":
        return Yup.object().shape({
          email: Yup.string().email().required(),
        })
      case "LoginPasswordStep":
        return Yup.object().shape({
          password: Yup.string()
            .min(8)
            .matches(/[A-Z]/)
            .matches(/[a-z]/)
            .matches(/[0-9]/)
            .required(),
        })
      default:
        return Yup.object().shape({})
    }
  }, [currentStep])

  return (
    <Formik<AuthenticationFormValues>
      initialValues={{ email: "", password: "" }}
      onSubmit={handleSubmit}
      validationSchema={getValidationSchema()}
      validateOnMount
      enableReinitialize
    >
      {({ isValid }) => {
        console.log({ isValid })

        return (
          <>
            {currentStep === "WelcomeStep" && <WelcomeStep />}
            {currentStep === "EmailStep" && <EmailStep />}
            {currentStep === "LoginPasswordStep" && <LoginPasswordStep />}
          </>
        )
      }}
    </Formik>
  )
}

export interface AuthenticationFormValues {
  email: string
  password: string
}

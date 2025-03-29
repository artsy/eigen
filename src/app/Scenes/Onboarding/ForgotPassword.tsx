import { Input } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { GlobalStore } from "app/store/GlobalStore"
import { FormikProvider, useFormik } from "formik"
import React, { useRef, useState } from "react"
import * as Yup from "yup"
import { ForgotPasswordForm } from "./ForgotPasswordForm"
import { OnboardingNavigationStack } from "./Onboarding"

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Please provide a valid email address"),
})
export interface ForgotPasswordValuesSchema {
  email: string
}

export type ForgotPasswordProps = StackScreenProps<OnboardingNavigationStack, "ForgotPassword">
export interface ForgotPasswordFormProps extends ForgotPasswordProps {
  requestedPasswordReset: boolean
  inputRef?: React.Ref<Input>
}

const initialValues: ForgotPasswordValuesSchema = { email: "" }

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ navigation, route }) => {
  const [requestedPasswordReset, setRequestedPasswordReset] = useState(false)

  const inputRef = useRef<Input>(null)

  const formik = useFormik<ForgotPasswordValuesSchema>({
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    initialValues,
    initialErrors: {},
    onSubmit: async ({ email }, { setErrors, validateForm }) => {
      await validateForm()
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
        setRequestedPasswordReset(true)
        inputRef.current?.blur()
      }
    },
    validationSchema: forgotPasswordSchema,
  })

  return (
    <FormikProvider value={formik}>
      <ForgotPasswordForm
        inputRef={inputRef}
        navigation={navigation}
        route={route}
        requestedPasswordReset={requestedPasswordReset}
      />
    </FormikProvider>
  )
}

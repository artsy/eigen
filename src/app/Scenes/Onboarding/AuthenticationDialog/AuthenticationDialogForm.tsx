import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import {
  OnboardingHomeNavigationStack,
  OnboardingHomeStore,
} from "app/Scenes/Onboarding/OnboardingHome"
import { GlobalStore } from "app/store/GlobalStore"
import { showBlockedAuthError } from "app/utils/auth/authHelpers"
import { FormikErrors, FormikProvider, useFormik } from "formik"
import React from "react"
import { Alert } from "react-native"
import * as Yup from "yup"

interface AuthenticationDialogFormProps {
  children: React.ReactNode
}

export const AuthenticationDialogForm: React.FC<AuthenticationDialogFormProps> = ({ children }) => {
  const currentStep = OnboardingHomeStore.useStoreState((state) => state.currentStep)

  const navigation = useNavigation<AuthenticationDialogFormNavigationProp>()

  const formik = useFormik<AuthenticationDialogFormValues>({
    initialValues: {
      acceptedTerms: false,
      agreedToReceiveEmails: false,
      email: "",
      name: "",
      otp: "",
      password: "",
      recaptchaToken: null,
    },
    onSubmit: async (
      { acceptedTerms, agreedToReceiveEmails, email, name, otp, password, recaptchaToken },
      { setErrors, setFieldValue }
    ) => {
      switch (currentStep) {
        case "EmailStep":
          handleEmailStep(email, recaptchaToken, setErrors, setFieldValue, navigation)
          break
        case "SignUpPasswordStep":
          navigation.navigate("SignUpNameStep")
          break
        case "SignUpNameStep":
          handleSignUpNameStep(email, password, name, acceptedTerms, agreedToReceiveEmails)
          break
        case "LoginPasswordStep":
          handleLoginPasswordStep(email, password, setErrors, navigation)
          break
        case "LoginOTPStep":
          handleLoginOTPStep(email, password, otp, setErrors)
          break
        case "ForgotPasswordStep":
          handleForgotPasswordStep(email, setErrors, navigation)
          break
      }
    },
    validationSchema: () => {
      switch (currentStep) {
        case "EmailStep":
          return EmailValidationSchema
        case "LoginPasswordStep":
        case "SignUpPasswordStep":
          return PasswordValidationSchema
        case "SignUpNameStep":
          return NameValidationSchema
        case "LoginOTPStep":
          return OtpValidationSchema
        case "ForgotPasswordStep":
          return ForgotPasswordValidationSchema
        default:
          return EmptyValidationSchema
      }
    },
    validateOnMount: false,
  })

  return <FormikProvider value={formik}>{children}</FormikProvider>
}

type AuthenticationDialogFormNavigationProp = StackNavigationProp<
  OnboardingHomeNavigationStack,
  "EmailStep"
>

export interface AuthenticationDialogFormValues {
  acceptedTerms: boolean
  agreedToReceiveEmails: boolean
  email: string
  name: string
  otp: string
  password: string
  recaptchaToken: string | null
}

const EmailValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please provide a valid email address")
    .required("Email field is required"),
})

const PasswordValidationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Your password should be at least 8 characters")
    .matches(/[A-Z]/, "Your password should contain at least one uppercase letter")
    .matches(/[a-z]/, "Your password should contain at least one lowercase letter")
    .matches(/[0-9]/, "Your password should contain at least one digit")
    .required("Password field is required"),
})

const NameValidationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Full name field is required"),
})

const EmptyValidationSchema = Yup.object().shape({})

const OtpValidationSchema = Yup.object().shape({
  otp: Yup.string().test("otp", "This field is required", (value) => value !== ""),
})

const ForgotPasswordValidationSchema = Yup.object().shape({
  email: Yup.string().email("Please provide a valid email address"),
})

const handleEmailStep = async (
  email: string,
  recaptchaToken: string | null,
  setErrors: (errors: FormikErrors<AuthenticationDialogFormValues>) => void,
  setFieldValue: (field: string, value: any) => void,
  navigation: AuthenticationDialogFormNavigationProp
) => {
  if (!recaptchaToken) {
    setErrors({
      email: "Something went wrong. Please try again, or contact support@artsy.net",
    })

    return
  }

  const res = await GlobalStore.actions.auth.verifyUser({ email, recaptchaToken })

  setFieldValue("recaptchaToken", null)

  if (res === "user_exists") {
    navigation.navigate("LoginPasswordStep")
  } else if (res === "user_does_not_exist") {
    navigation.navigate("SignUpPasswordStep")
  } else if (res === "something_went_wrong") {
    setErrors({
      email: "Something went wrong. Please try again, or contact support@artsy.net",
    })
  }
}

const handleSignUpNameStep = async (
  email: string,
  password: string,
  name: string,
  acceptedTerms: boolean,
  agreedToReceiveEmails: boolean
) => {
  if (!acceptedTerms) {
    return
  }

  const res = await GlobalStore.actions.auth.signUp({
    oauthProvider: "email",
    oauthMode: "email",
    email,
    password,
    name: name.trim(),
    agreedToReceiveEmails,
  })

  if (!res.success) {
    if (res.error === "blocked_attempt") {
      showBlockedAuthError("sign up")
    } else {
      Alert.alert("Try again", res.message)
    }
  }
}

const handleLoginPasswordStep = async (
  email: string,
  password: string,
  setErrors: (errors: FormikErrors<AuthenticationDialogFormValues>) => void,
  navigation: AuthenticationDialogFormNavigationProp
) => {
  const res = await GlobalStore.actions.auth.signIn({
    oauthProvider: "email",
    oauthMode: "email",
    email,
    password,
  })

  if (res === "otp_missing") {
    navigation.navigate("LoginOTPStep", { otpMode: "standard" })
  } else if (res === "on_demand_otp_missing") {
    navigation.navigate("LoginOTPStep", { otpMode: "standard" })
  }

  if (res === "auth_blocked") {
    showBlockedAuthError("sign in")
    return
  }

  if (res !== "success" && res !== "otp_missing" && res !== "on_demand_otp_missing") {
    // For security purposes, we are returning a generic error message
    setErrors({ password: "Incorrect email or password" }) // pragma: allowlist secret
  }
}

const handleLoginOTPStep = async (
  email: string,
  password: string,
  otp: string,
  setErrors: (errors: FormikErrors<AuthenticationDialogFormValues>) => void
) => {
  const res = await GlobalStore.actions.auth.signIn({
    oauthProvider: "email",
    oauthMode: "email",
    email,
    password,
    otp: otp.trim(),
  })

  if (res === "invalid_otp") {
    setErrors({ otp: "Invalid two-factor authentication code" })
  } else if (res !== "success") {
    setErrors({ otp: "Something went wrong. Please try again, or contact support@artsy.net" })
  }
}

const handleForgotPasswordStep = async (
  email: string,
  setErrors: (errors: FormikErrors<AuthenticationDialogFormValues>) => void,
  navigation: AuthenticationDialogFormNavigationProp
) => {
  const res = await GlobalStore.actions.auth.forgotPassword({
    email,
  })
  if (!res) {
    // For security purposes, we are returning a generic error message
    setErrors({
      email: "Couldn’t send reset password link. Please try again, or contact support@artsy.net",
    })
  } else {
    navigation.navigate("ForgotPasswordStep", { requestedPasswordReset: true })
  }
}

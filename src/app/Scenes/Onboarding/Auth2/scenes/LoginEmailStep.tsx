import { BackButton, Button, Flex, Input, Spacer, Text, useTheme } from "@artsy/palette-mobile"
import { useRecaptcha } from "app/Components/Recaptcha/Recaptcha"
import { AuthContext } from "app/Scenes/Onboarding/Auth2/AuthContext"
import { useAuthNavigation } from "app/Scenes/Onboarding/Auth2/hooks/useAuthNavigation"
import { useInputAutofocus } from "app/Scenes/Onboarding/Auth2/hooks/useInputAutofocus"
import { GlobalStore } from "app/store/GlobalStore"
import { FormikProvider, useFormik, useFormikContext } from "formik"
import React, { useRef } from "react"
import { Alert, TextInput } from "react-native"
import * as Yup from "yup"

interface LoginEmailFormValues {
  email: string
}

export const LoginEmailStep: React.FC = () => {
  const navigation = useAuthNavigation()

  const { Recaptcha, token } = useRecaptcha({
    source: "authentication",
    action: "verify_email",
  })

  const formik = useFormik<LoginEmailFormValues>({
    initialValues: { email: "" },
    validateOnMount: false,
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email("Please provide a valid email address")
        .required("Email field is required"),
    }),
    onSubmit: async ({ email }, { resetForm }) => {
      // FIXME
      if (!token) {
        Alert.alert("Something went wrong. Please try again, or contact support@artsy.net")
        return
      }

      const res = await GlobalStore.actions.auth.verifyUser({ email, recaptchaToken: token })

      if (res === "user_exists") {
        navigation.navigate({ name: "LoginPasswordStep", params: { email } })
      } else if (res === "user_does_not_exist") {
        navigation.navigate({ name: "SignUpPasswordStep", params: { email } })
      } else if (res === "something_went_wrong") {
        Alert.alert("Something went wrong. Please try again, or contact support@artsy.net")
      }

      resetForm()
    },
  })

  return (
    <FormikProvider value={formik}>
      <Recaptcha />
      <LoginEmailStepForm />
    </FormikProvider>
  )
}

export const LoginEmailStepForm: React.FC = () => {
  const navigation = useAuthNavigation()
  const { isModalExpanded } = AuthContext.useStoreState((state) => state)
  const setModalExpanded = AuthContext.useStoreActions((actions) => actions.setModalExpanded)

  const { color } = useTheme()
  const emailRef = useRef<TextInput>(null)

  useInputAutofocus({
    screenName: "LoginEmailStep",
    inputRef: emailRef,
    delay: isModalExpanded ? 0 : 300,
  })

  const { errors, handleChange, handleSubmit, isSubmitting, values, resetForm } =
    useFormikContext<LoginEmailFormValues>()

  const handleBackButtonPress = () => {
    emailRef.current?.blur()

    requestAnimationFrame(() => {
      navigation.navigate({ name: "WelcomeStep" })
      setModalExpanded(false)
      resetForm()
    })
  }

  return (
    <>
      <Flex padding={2} position="relative">
        <BackButton onPress={handleBackButtonPress} />

        <Spacer y={1} />

        <Text variant="sm-display">Sign up or log in</Text>

        <Input
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          blurOnSubmit={false} // This is needed to avoid UI jump when the user submits
          error={errors.email}
          keyboardType="email-address"
          onSubmitEditing={handleSubmit}
          placeholderTextColor={color("black30")}
          ref={emailRef}
          returnKeyType="next"
          spellCheck={false}
          // We need to to set textContentType to username (instead of emailAddress) here
          // enable autofill of login details from the device keychain.
          textContentType="username"
          title="Email"
          value={values.email}
          onChangeText={(text) => {
            handleChange("email")(text.trim())
          }}
        />

        <Spacer y={2} />

        <Button block width="100%" onPress={handleSubmit} loading={isSubmitting}>
          Continue
        </Button>
      </Flex>
    </>
  )
}

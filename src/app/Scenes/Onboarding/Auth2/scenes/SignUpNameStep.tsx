import { BackButton, Button, Flex, Input, Text, useTheme } from "@artsy/palette-mobile"
import {
  useAuthNavigation,
  useAuthRoute,
} from "app/Scenes/Onboarding/Auth2/hooks/useAuthNavigation"
import { EmailSubscriptionCheckbox } from "app/Scenes/Onboarding/OnboardingCreateAccount/EmailSubscriptionCheckbox"
import { TermsOfServiceCheckbox } from "app/Scenes/Onboarding/OnboardingCreateAccount/TermsOfServiceCheckbox"
import { GlobalStore } from "app/store/GlobalStore"
import { showBlockedAuthError } from "app/utils/auth/authHelpers"
import { FormikProvider, useFormik, useFormikContext } from "formik"
import React, { useState } from "react"
import { Alert, Keyboard } from "react-native"
import * as Yup from "yup"

interface SignUpNameStepFormValues {
  name: string
  acceptedTerms: boolean
  agreedToReceiveEmails: boolean
}

export const SignUpNameStep: React.FC = () => {
  const route = useAuthRoute<"SignUpNameStep">()

  const formik = useFormik<SignUpNameStepFormValues>({
    initialValues: { name: "", acceptedTerms: false, agreedToReceiveEmails: false },
    onSubmit: async ({ acceptedTerms, agreedToReceiveEmails, name }) => {
      if (!acceptedTerms) {
        return
      }

      const res = await GlobalStore.actions.auth.signUp({
        oauthProvider: "email",
        oauthMode: "email",
        email: route.params.email,
        password: route.params.password,
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
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().trim().required("Full name field is required"),
    }),
  })

  return (
    <FormikProvider value={formik}>
      <SignUpNameStepForm />
    </FormikProvider>
  )
}

const SignUpNameStepForm: React.FC = () => {
  const [highlightTerms, setHighlightTerms] = useState<boolean>(false)

  const { errors, handleChange, handleSubmit, isValid, setErrors, setFieldValue, values } =
    useFormikContext<SignUpNameStepFormValues>()

  const navigation = useAuthNavigation()

  const { color, space } = useTheme()

  const handleBackButtonPress = () => {
    navigation.goBack()
  }

  return (
    <Flex padding={2} gap={space(1)}>
      <BackButton onPress={handleBackButtonPress} />

      <Text variant="sm-display">Welcome to Artsy</Text>

      <Input
        autoCapitalize="words"
        autoComplete="name"
        autoCorrect={false}
        autoFocus
        title="Full Name"
        onChangeText={(text) => {
          if (errors.name) {
            setErrors({
              name: undefined,
            })
          }
          handleChange("name")(text)
        }}
        onSubmitEditing={() => {
          Keyboard.dismiss()
          requestAnimationFrame(() => {
            if (values.acceptedTerms) {
              handleSubmit()
            } else {
              setHighlightTerms(true)
            }
          })
        }}
        blurOnSubmit={false}
        placeholder="First and last name"
        placeholderTextColor={color("black30")}
        returnKeyType="done"
        maxLength={128}
        error={errors.name}
      />

      <Flex my={2}>
        {/* TODO: confirm that the links in this component work */}
        <TermsOfServiceCheckbox
          setChecked={() => setFieldValue("acceptedTerms", !values.acceptedTerms)}
          checked={values.acceptedTerms}
          error={highlightTerms}
        />
        <EmailSubscriptionCheckbox
          setChecked={() => setFieldValue("agreedToReceiveEmails", !values.agreedToReceiveEmails)}
          checked={values.agreedToReceiveEmails}
        />
      </Flex>

      <Button block width={100} onPress={handleSubmit} disabled={!isValid}>
        Continue
      </Button>
    </Flex>
  )
}

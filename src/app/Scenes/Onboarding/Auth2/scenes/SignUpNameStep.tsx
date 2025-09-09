import { BackButton, Button, Flex, Input, Spacer, Text, useTheme } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import {
  useAuthNavigation,
  useAuthScreen,
} from "app/Scenes/Onboarding/Auth2/hooks/useAuthNavigation"
import { useCountryCode } from "app/Scenes/Onboarding/Auth2/hooks/useCountryCode"
import { useInputAutofocus } from "app/Scenes/Onboarding/Auth2/hooks/useInputAutofocus"
import { OnboardingNavigationStack } from "app/Scenes/Onboarding/Onboarding"
import { EmailSubscriptionCheckbox } from "app/Scenes/Onboarding/OnboardingCreateAccount/EmailSubscriptionCheckbox"
import { TermsOfServiceCheckbox } from "app/Scenes/Onboarding/OnboardingCreateAccount/TermsOfServiceCheckbox"
import { GlobalStore } from "app/store/GlobalStore"
import { showBlockedAuthError } from "app/utils/auth/authHelpers"
import { Formik, useFormikContext } from "formik"
import React, { useRef, useState } from "react"
import { Alert } from "react-native"
import * as Yup from "yup"

interface SignUpNameStepFormValues {
  name: string
  acceptedTerms: boolean
  agreedToReceiveEmails: boolean
}

export const SignUpNameStep: React.FC = () => {
  const screen = useAuthScreen()
  const { loading, isAutomaticallySubscribed } = useCountryCode()

  if (loading) {
    return null
  }

  return (
    <Formik<SignUpNameStepFormValues>
      initialValues={{
        name: "",
        acceptedTerms: false,
        agreedToReceiveEmails: isAutomaticallySubscribed,
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().trim().required("Full name field is required"),
        acceptedTerms: Yup.boolean().oneOf([true], "You must accept the terms and conditions"),
      })}
      onSubmit={async (values, { resetForm }) => {
        if (!values.acceptedTerms) {
          return
        }

        const res = await GlobalStore.actions.auth.signUp({
          oauthProvider: "email",
          oauthMode: "email",
          email: screen.params?.email,
          password: screen.params?.password,
          name: values.name.trim(),
          agreedToReceiveEmails: values.agreedToReceiveEmails,
        })

        if (!res.success) {
          if (res.error === "blocked_attempt") {
            showBlockedAuthError("sign up")
          } else {
            Alert.alert("Try again", res.message)
          }
        }

        if (res.success) {
          resetForm()
        }
      }}
    >
      <SignUpNameStepForm />
    </Formik>
  )
}

const SignUpNameStepForm: React.FC = () => {
  const [highlightTerms, setHighlightTerms] = useState<boolean>(false)

  const {
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    isValid,
    resetForm,
    setErrors,
    setFieldValue,
    values,
  } = useFormikContext<SignUpNameStepFormValues>()

  const navigation = useAuthNavigation()
  const parentNavigation = useNavigation<NavigationProp<OnboardingNavigationStack>>()
  const { isAutomaticallySubscribed } = useCountryCode()
  const { color } = useTheme()
  const nameRef = useRef<Input>(null)

  useInputAutofocus({
    screenName: "SignUpNameStep",
    inputRef: nameRef,
  })

  const handleBackButtonPress = () => {
    resetForm()
    navigation.goBack()
  }

  return (
    <Flex padding={2}>
      <BackButton onPress={handleBackButtonPress} />

      <Spacer y={1} />

      <Text variant="sm-display">Welcome to Artsy</Text>

      <Input
        accessibilityHint="Enter your full name"
        autoCapitalize="words"
        autoComplete="name"
        autoCorrect={false}
        blurOnSubmit
        error={errors.name}
        maxLength={128}
        placeholder="First and last name"
        placeholderTextColor={color("mono30")}
        ref={nameRef}
        returnKeyType="done"
        spellCheck={false}
        textContentType="none"
        title="Full Name"
        value={values.name}
        onChangeText={(text) => {
          if (errors.name) {
            setErrors({
              name: undefined,
            })
          }
          handleChange("name")(text)
        }}
        onSubmitEditing={() => {
          if (values.acceptedTerms) {
            handleSubmit()
          } else {
            setHighlightTerms(true)
          }
        }}
      />

      <Flex my={2}>
        <TermsOfServiceCheckbox
          setChecked={() => setFieldValue("acceptedTerms", !values.acceptedTerms)}
          checked={values.acceptedTerms}
          error={highlightTerms}
          navigation={parentNavigation}
        />
        <Spacer y={2} />
        {!isAutomaticallySubscribed ? (
          <EmailSubscriptionCheckbox
            setChecked={() => setFieldValue("agreedToReceiveEmails", !values.agreedToReceiveEmails)}
            checked={values.agreedToReceiveEmails}
          />
        ) : (
          <Spacer y={2} />
        )}
      </Flex>

      <Button
        block
        width="100%"
        onPress={handleSubmit}
        disabled={!isValid || !values.name}
        loading={isSubmitting}
      >
        Continue
      </Button>
    </Flex>
  )
}

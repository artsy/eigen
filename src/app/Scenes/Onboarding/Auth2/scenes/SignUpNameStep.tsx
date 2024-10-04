import { BackButton, Button, Flex, Input, Spacer, Text, useTheme } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import {
  useAuthNavigation,
  useAuthScreen,
} from "app/Scenes/Onboarding/Auth2/hooks/useAuthNavigation"
import { useInputAutofocus } from "app/Scenes/Onboarding/Auth2/hooks/useInputAutofocus"
import { OnboardingNavigationStack } from "app/Scenes/Onboarding/Onboarding"
import { EmailSubscriptionCheckbox } from "app/Scenes/Onboarding/OnboardingCreateAccount/EmailSubscriptionCheckbox"
import { TermsOfServiceCheckbox } from "app/Scenes/Onboarding/OnboardingCreateAccount/TermsOfServiceCheckbox"
import { GlobalStore } from "app/store/GlobalStore"
import { showBlockedAuthError } from "app/utils/auth/authHelpers"
import { Formik, FormikHelpers, useFormikContext } from "formik"
import React, { useRef, useState } from "react"
import { Alert, Keyboard } from "react-native"
import * as Yup from "yup"

interface SignUpNameStepFormValues {
  name: string
  acceptedTerms: boolean
  agreedToReceiveEmails: boolean
}

export const SignUpNameStep: React.FC = () => {
  const screen = useAuthScreen()

  return (
    <Formik
      initialValues={{
        name: "",
        acceptedTerms: false,
        agreedToReceiveEmails: false,
      }}
      validateOnChange={false}
      validationSchema={Yup.object().shape({
        name: Yup.string().trim().required("Full name field is required"),
      })}
      onSubmit={async (
        { acceptedTerms, agreedToReceiveEmails, name }: SignUpNameStepFormValues,
        { resetForm }: FormikHelpers<SignUpNameStepFormValues>
      ) => {
        if (!acceptedTerms) {
          return
        }

        const res = await GlobalStore.actions.auth.signUp({
          oauthProvider: "email",
          oauthMode: "email",
          email: screen.params?.email,
          password: screen.params?.password,
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

  const { errors, handleChange, handleSubmit, isValid, setErrors, setFieldValue, values } =
    useFormikContext<SignUpNameStepFormValues>()

  const navigation = useAuthNavigation()
  const parentNavigation = useNavigation<NavigationProp<OnboardingNavigationStack>>()
  const { color } = useTheme()
  const nameRef = useRef<Input>(null)

  useInputAutofocus({
    screenName: "SignUpNameStep",
    inputRef: nameRef,
  })

  const handleBackButtonPress = () => {
    navigation.goBack()
  }

  return (
    <Flex padding={2}>
      <BackButton onPress={handleBackButtonPress} />

      <Spacer y={1} />

      <Text variant="sm-display">Welcome to Artsy</Text>

      <Input
        autoCapitalize="words"
        autoComplete="name"
        autoCorrect={false}
        blurOnSubmit={false}
        error={errors.name}
        maxLength={128}
        placeholder="First and last name"
        placeholderTextColor={color("black30")}
        ref={nameRef}
        returnKeyType="done"
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
          Keyboard.dismiss()
          requestAnimationFrame(() => {
            if (values.acceptedTerms) {
              handleSubmit()
            } else {
              setHighlightTerms(true)
            }
          })
        }}
      />

      <Spacer y={2} />

      <Flex>
        {/* TODO: confirm that the links in this component work */}
        <TermsOfServiceCheckbox
          setChecked={() => setFieldValue("acceptedTerms", !values.acceptedTerms)}
          checked={values.acceptedTerms}
          error={highlightTerms}
          navigation={parentNavigation}
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

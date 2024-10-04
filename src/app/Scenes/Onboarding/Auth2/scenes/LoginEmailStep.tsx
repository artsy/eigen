import { BackButton, Button, Flex, Input, Spacer, Text, useTheme } from "@artsy/palette-mobile"
import { useRecaptcha } from "app/Components/Recaptcha/Recaptcha"
import { AuthContext } from "app/Scenes/Onboarding/Auth2/AuthContext"
import { useAuthNavigation } from "app/Scenes/Onboarding/Auth2/hooks/useAuthNavigation"
import { useInputAutofocus } from "app/Scenes/Onboarding/Auth2/hooks/useInputAutofocus"
import { GlobalStore } from "app/store/GlobalStore"
import { Formik } from "formik"
import React, { useRef } from "react"
import { Alert, InteractionManager, TextInput } from "react-native"
import * as Yup from "yup"

interface EmailFormValues {
  email: string
}

export const LoginEmailStep: React.FC = () => {
  const navigation = useAuthNavigation()
  const setModalExpanded = AuthContext.useStoreActions((actions) => actions.setModalExpanded)

  const { color } = useTheme()
  const emailRef = useRef<TextInput>(null)

  const { Recaptcha, token } = useRecaptcha({
    source: "authentication",
    action: "verify_email",
  })

  useInputAutofocus({
    screenName: "LoginEmailStep",
    inputRef: emailRef,
  })

  return (
    <>
      <Formik<EmailFormValues>
        initialValues={{ email: "" }}
        validateOnMount={false}
        validateOnChange={false}
        validateOnBlur={true}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Please provide a valid email address")
            .required("Email field is required"),
        })}
        onSubmit={async ({ email }, { resetForm }) => {
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
        }}
      >
        {({ errors, handleChange, handleSubmit, resetForm, values, isSubmitting }) => {
          const handleBackButtonPress = () => {
            InteractionManager.runAfterInteractions(() => {
              setModalExpanded(false)
              resetForm()
              emailRef.current?.blur()
              navigation.goBack()
            })
          }

          return (
            <Flex padding={2} position="relative">
              <BackButton onPress={handleBackButtonPress} />

              <Spacer y={1} />

              <Text variant="sm-display">Sign up or log in</Text>

              <Recaptcha />

              <Input
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={(text) => {
                  handleChange("email")(text.trim())
                }}
                blurOnSubmit={false} // This is needed to avoid UI jump when the user submits
                placeholderTextColor={color("black30")}
                title="Email"
                returnKeyType="next"
                spellCheck={false}
                autoCorrect={false}
                ref={emailRef}
                value={values.email}
                // onBlur={handleBackButtonPress}
                // We need to to set textContentType to username (instead of emailAddress) here
                // enable autofill of login details from the device keychain.
                textContentType="username"
                error={errors.email}
                onSubmitEditing={handleSubmit}
              />

              <Spacer y={2} />

              <Button block width="100%" onPress={handleSubmit} loading={isSubmitting}>
                Continue
              </Button>
            </Flex>
          )
        }}
      </Formik>
    </>
  )
}

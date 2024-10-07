import { BackButton, Button, Flex, Input, Spacer, Text, useTheme } from "@artsy/palette-mobile"
import {
  useAuthNavigation,
  useAuthScreen,
} from "app/Scenes/Onboarding/Auth2/hooks/useAuthNavigation"
import { useInputAutofocus } from "app/Scenes/Onboarding/Auth2/hooks/useInputAutofocus"
import { Formik, useFormikContext } from "formik"
import React, { useRef } from "react"
import * as Yup from "yup"

interface SignUpPasswordStepFormValues {
  password: string
}

export const SignUpPasswordStep: React.FC = () => {
  const navigation = useAuthNavigation()
  const screen = useAuthScreen()

  return (
    <Formik<SignUpPasswordStepFormValues>
      initialValues={{ password: "" }}
      validationSchema={Yup.object().shape({
        password: Yup.string()
          .min(8, "Your password should be at least 8 characters")
          .matches(/[A-Z]/, "Your password should contain at least one uppercase letter")
          .matches(/[a-z]/, "Your password should contain at least one lowercase letter")
          .matches(/[0-9]/, "Your password should contain at least one digit")
          .required("Password field is required"),
      })}
      onSubmit={async ({ password }, { resetForm }) => {
        navigation.navigate({
          name: "SignUpNameStep",
          params: {
            email: screen.params?.email,
            password,
          },
        })

        resetForm()
      }}
    >
      <SignUpPasswordStepForm />
    </Formik>
  )
}

const SignUpPasswordStepForm: React.FC = () => {
  const {
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    isValid,
    setErrors,
    values,
    resetForm,
  } = useFormikContext<SignUpPasswordStepFormValues>()

  const navigation = useAuthNavigation()
  const { color } = useTheme()
  const passwordRef = useRef<Input>(null)

  useInputAutofocus({
    screenName: "SignUpPasswordStep",
    inputRef: passwordRef,
  })

  const handleBackButtonPress = () => {
    navigation.goBack()
    resetForm()
  }

  return (
    <Flex padding={2}>
      <BackButton onPress={handleBackButtonPress} />

      <Spacer y={1} />

      <Text variant="sm-display">Welcome to Artsy</Text>

      <Input
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        blurOnSubmit={false}
        error={errors.password}
        placeholder="Password"
        placeholderTextColor={color("black30")}
        ref={passwordRef}
        returnKeyType="done"
        secureTextEntry
        textContentType="none"
        title="Password"
        value={values.password}
        onChangeText={(text) => {
          // Hide error when the user starts to type again
          if (errors.password) {
            setErrors({
              password: undefined,
            })
          }
          handleChange("password")(text)
        }}
        onSubmitEditing={handleSubmit}
      />

      <Spacer y={2} />

      <Button block width={100} onPress={handleSubmit} disabled={!isValid} loading={isSubmitting}>
        Continue
      </Button>
    </Flex>
  )
}

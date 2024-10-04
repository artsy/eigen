import { BackButton, Button, Flex, Input, Spacer, Text, useTheme } from "@artsy/palette-mobile"
import {
  useAuthNavigation,
  useAuthScreen,
} from "app/Scenes/Onboarding/Auth2/hooks/useAuthNavigation"
import { FormikProvider, useFormik, useFormikContext } from "formik"
import React from "react"
import * as Yup from "yup"

interface SignUpPasswordStepFormValues {
  password: string
}

export const SignUpPasswordStep: React.FC = () => {
  const navigation = useAuthNavigation()
  const screen = useAuthScreen()

  const formik = useFormik<SignUpPasswordStepFormValues>({
    initialValues: { password: "" },
    onSubmit: ({ password }) => {
      navigation.navigate({
        name: "SignUpNameStep",
        params: {
          email: screen.params?.email,
          password: password,
        },
      })
    },
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .min(8, "Your password should be at least 8 characters")
        .matches(/[A-Z]/, "Your password should contain at least one uppercase letter")
        .matches(/[a-z]/, "Your password should contain at least one lowercase letter")
        .matches(/[0-9]/, "Your password should contain at least one digit")
        .required("Password field is required"),
    }),
  })

  return (
    <FormikProvider value={formik}>
      <SignUpPasswordStepForm />
    </FormikProvider>
  )
}

const SignUpPasswordStepForm: React.FC = () => {
  const { errors, handleChange, handleSubmit, isValid, setErrors } =
    useFormikContext<SignUpPasswordStepFormValues>()

  const navigation = useAuthNavigation()

  const { color } = useTheme()

  const handleBackButtonPress = () => {
    navigation.goBack()
  }

  return (
    <Flex padding={2}>
      <BackButton onPress={handleBackButtonPress} />

      <Spacer y={1} />

      <Text variant="sm-display">Welcome to Artsy</Text>

      <Input
        autoCapitalize="none"
        autoComplete="password"
        title="Password"
        autoCorrect={false}
        autoFocus
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
        blurOnSubmit={false}
        placeholderTextColor={color("black30")}
        placeholder="Password"
        secureTextEntry
        returnKeyType="done"
        // We need to set textContentType to password here
        // enable autofill of login details from the device keychain.
        textContentType="password"
        error={errors.password}
      />

      <Spacer y={2} />

      <Button block width={100} onPress={handleSubmit} disabled={!isValid}>
        Continue
      </Button>
    </Flex>
  )
}

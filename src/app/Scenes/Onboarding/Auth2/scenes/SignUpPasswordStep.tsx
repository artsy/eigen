import { BackButton, Button, Flex, Input, Text, useTheme } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { AuthNavigationStack } from "app/Scenes/Onboarding/Auth2/AuthScenes"
import { useAuthNavigation } from "app/Scenes/Onboarding/Auth2/hooks/useAuthNavigation"
import { FormikProvider, useFormik, useFormikContext } from "formik"
import React from "react"
import * as Yup from "yup"

type SignUpPasswordStepProps = StackScreenProps<AuthNavigationStack, "SignUpPasswordStep">

interface SignUpPasswordStepFormValues {
  password: string
}

export const SignUpPasswordStep: React.FC<SignUpPasswordStepProps> = ({ navigation, route }) => {
  const formik = useFormik<SignUpPasswordStepFormValues>({
    initialValues: { password: "" },
    onSubmit: ({ password }) => {
      navigation.navigate("SignUpNameStep", {
        email: route.params.email,
        password: password,
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

  const { color, space } = useTheme()

  const handleBackButtonPress = () => {
    navigation.goBack()
  }

  return (
    <Flex padding={2} gap={space(1)}>
      <BackButton onPress={handleBackButtonPress} />

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

      <Button block width={100} onPress={handleSubmit} disabled={!isValid}>
        Continue
      </Button>
    </Flex>
  )
}

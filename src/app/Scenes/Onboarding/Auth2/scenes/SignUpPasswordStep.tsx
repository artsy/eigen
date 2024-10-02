import { BackButton, Button, Flex, Text, useTheme } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { OnboardingHomeNavigationStack } from "app/Scenes/Onboarding/OnboardingHome"
import { FormikProvider, useFormik, useFormikContext } from "formik"
import React from "react"
import * as Yup from "yup"

type SignUpPasswordStepProps = StackScreenProps<OnboardingHomeNavigationStack, "SignUpPasswordStep">

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
    <BottomSheetScrollView>
      <FormikProvider value={formik}>
        <SignUpPasswordStepForm />
      </FormikProvider>
    </BottomSheetScrollView>
  )
}

const SignUpPasswordStepForm: React.FC = () => {
  const { errors, handleChange, handleSubmit, isValid, setErrors } =
    useFormikContext<SignUpPasswordStepFormValues>()

  const navigation = useNavigation<StackNavigationProp<OnboardingHomeNavigationStack>>()

  const { color, space } = useTheme()

  const handleBackButtonPress = () => {
    navigation.goBack()
  }

  return (
    <Flex padding={2} gap={space(1)}>
      <BackButton onPress={handleBackButtonPress} />

      <Text variant="sm-display">Welcome to Artsy</Text>
      <BottomSheetInput
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

import { BackButton, Button, Flex, Text, useTheme } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { OnboardingHomeNavigationStack } from "app/Scenes/Onboarding/OnboardingHome"
import { GlobalStore } from "app/store/GlobalStore"
import { Field, Formik, FormikHelpers } from "formik"
import * as Yup from "yup"

type LoginPasswordStepProps = StackScreenProps<OnboardingHomeNavigationStack, "LoginPasswordStep">

interface LoginPasswordStepFormValues {
  password: string
}

export const LoginPasswordStep: React.FC<LoginPasswordStepProps> = ({ navigation, route }) => {
  const { space } = useTheme()

  const handleContinueButtonPress = async (
    { password }: LoginPasswordStepFormValues,
    { setErrors, validateForm }: FormikHelpers<LoginPasswordStepFormValues>
  ) => {
    validateForm()

    const email = route.params.email

    const response = await GlobalStore.actions.auth.signIn({
      oauthProvider: "email",
      oauthMode: "email",
      email,
      password,
    })

    console.log({ response })

    if (response === "failure") {
      setErrors({ password: "Incorrect email or password" }) // pragma: allowlist secret
    } else if (response === "on_demand_otp_missing") {
      navigation.navigate("LoginOTPStep", { email, password, mode: "on_demand" })
    }
  }

  const handleBackButtonPress = () => {
    navigation.goBack()
  }

  return (
    <BottomSheetScrollView>
      <Formik
        initialValues={{ password: "" }}
        onSubmit={handleContinueButtonPress}
        validationSchema={Yup.object().shape({
          password: Yup.string()
            .min(8)
            .matches(/[A-Z]/)
            .matches(/[a-z]/)
            .matches(/[0-9]/)
            .required(),
        })}
        validateOnMount
      >
        {({ handleChange, handleSubmit, isValid, values }) => {
          return (
            <Flex padding={2} gap={space(1)}>
              <BackButton onPress={handleBackButtonPress} />
              <Text variant="sm-display">Welcome back to Artsy</Text>

              <Field
                name="password"
                autoCapitalize="none"
                autoComplete="current-password"
                autoCorrect={false}
                secureTextEntry
                component={BottomSheetInput}
                placeholder="Enter your password"
                returnKeyType="done"
                title="Password"
                value={values.password}
                onChangeText={handleChange("password")}
              />

              <Button block width={100} onPress={handleSubmit} disabled={!isValid}>
                Continue
              </Button>
            </Flex>
          )
        }}
      </Formik>
    </BottomSheetScrollView>
  )
}

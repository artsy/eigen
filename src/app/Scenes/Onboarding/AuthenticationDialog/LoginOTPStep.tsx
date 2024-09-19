import { BackButton, Button, Flex, Text, useTheme } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { OnboardingHomeNavigationStack } from "app/Scenes/Onboarding/OnboardingHome"
import { GlobalStore } from "app/store/GlobalStore"
import { Field, Formik, FormikHelpers } from "formik"
import * as Yup from "yup"

type LoginOTPStepProps = StackScreenProps<OnboardingHomeNavigationStack, "LoginOTPStep">

interface LoginOTPStepFormValues {
  otp: string
}

export const LoginOTPStep: React.FC<LoginOTPStepProps> = ({ navigation, route }) => {
  const { space } = useTheme()

  const handleContinueButtonPress = async (
    { otp }: LoginOTPStepFormValues,
    { validateForm }: FormikHelpers<LoginOTPStepFormValues>
  ) => {
    validateForm()

    const email = route.params.email
    const password = route.params.password

    const response = await GlobalStore.actions.auth.signIn({
      oauthProvider: "email",
      oauthMode: "email",
      email,
      password,
      otp: otp.trim(),
    })

    console.log({ response })
  }

  const handleBackButtonPress = () => {
    navigation.goBack()
  }

  return (
    <Formik
      initialValues={{ otp: "" }}
      onSubmit={handleContinueButtonPress}
      validationSchema={Yup.object().shape({
        email: Yup.string().required(),
      })}
      validateOnMount
    >
      {({ handleBlur, handleChange, handleSubmit, isValid, values }) => {
        return (
          <BottomSheetScrollView>
            <Flex padding={2} gap={space(1)}>
              <BackButton onPress={handleBackButtonPress} />

              <Text variant="sm-display">Sign up or log in</Text>

              <Field
                name="email"
                autoCapitalize="none"
                autoComplete="email"
                autoFocus
                keyboardType="email-address"
                spellCheck={false}
                autoCorrect={false}
                component={BottomSheetInput}
                onBlur={handleBlur("email")}
                placeholder="Enter your email address"
                returnKeyType="done"
                title="Email"
                value={values.otp}
                onChangeText={handleChange("email")}
              />

              <Button block width={100} onPress={handleSubmit} disabled={!isValid}>
                Continue
              </Button>
            </Flex>
          </BottomSheetScrollView>
        )
      }}
    </Formik>
  )
}

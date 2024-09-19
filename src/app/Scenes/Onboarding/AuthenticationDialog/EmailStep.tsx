import { BackButton, Button, Flex, Text, useTheme } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { OnboardingHomeNavigationStack } from "app/Scenes/Onboarding/OnboardingHome"
import { Field, Formik, FormikHelpers } from "formik"
import * as Yup from "yup"

type EmailStepProps = StackScreenProps<OnboardingHomeNavigationStack, "EmailStep">

interface EmailStepFormValues {
  email: string
}

export const EmailStep: React.FC<EmailStepProps> = ({ navigation }) => {
  const { space } = useTheme()

  const handleContinueButtonPress = async (
    { email }: EmailStepFormValues,
    { validateForm }: FormikHelpers<EmailStepFormValues>
  ) => {
    await validateForm()

    // navigation.navigate("LoginPasswordStep", { email })
    navigation.navigate("SignUpPasswordStep", { email })
  }

  const handleBackButtonPress = () => {
    navigation.goBack()
  }

  return (
    <BottomSheetScrollView>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={handleContinueButtonPress}
        validationSchema={Yup.object().shape({
          email: Yup.string().email().required(),
        })}
        validateOnMount
      >
        {({ handleBlur, handleChange, handleSubmit, isValid, values }) => {
          return (
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
                value={values.email}
                onChangeText={handleChange("email")}
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

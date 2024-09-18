import { BackButton, Button, Flex, Text, useTheme } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { OnboardingHomeNavigationStack } from "app/Scenes/Onboarding/OnboardingHome"
import { Field, Formik } from "formik"
import * as Yup from "yup"

type EmailStepProps = StackScreenProps<OnboardingHomeNavigationStack, "EmailStep">

export const EmailStep: React.FC<EmailStepProps> = ({ navigation }) => {
  const { space } = useTheme()

  const handleContinueButtonPress = () => {
    navigation.navigate("LoginPasswordStep")
  }

  const handleBackButtonPress = () => {
    navigation.goBack()
  }

  return (
    <Formik
      initialValues={{ email: "" }}
      onSubmit={handleContinueButtonPress}
      validationSchema={Yup.object().shape({
        email: Yup.string().email().required(),
      })}
      validateOnMount
    >
      {({ handleBlur, handleChange, isValid, values }) => {
        return (
          <BottomSheetScrollView>
            <Flex padding={2} gap={space(1)}>
              <BackButton onPress={handleBackButtonPress} />

              <Text variant="sm-display">Sign up or log in</Text>

              <Field
                name="email"
                autoCapitalize="none"
                autoComplete="email"
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

              <Button block width={100} onPress={handleContinueButtonPress} disabled={!isValid}>
                Continue
              </Button>
            </Flex>
          </BottomSheetScrollView>
        )
      }}
    </Formik>
  )
}

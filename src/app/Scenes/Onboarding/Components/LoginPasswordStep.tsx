import { BackButton, Button, Flex, Text, useTheme } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { OnboardingHomeNavigationStack } from "app/Scenes/Onboarding/OnboardingHome"
import { OnboardingStore } from "app/Scenes/Onboarding/OnboardingStore"
import { Field, Formik } from "formik"
import * as Yup from "yup"

type LoginPasswordStepProps = StackScreenProps<OnboardingHomeNavigationStack, "LoginPasswordStep">

export const LoginPasswordStep: React.FC<LoginPasswordStepProps> = ({ navigation }) => {
  const changeStep = OnboardingStore.useStoreActions((actions) => actions.changeStep)
  changeStep("LoginPasswordStep")

  const { space } = useTheme()

  const handleContinueButtonPress = () => {
    console.log("🐖")
  }

  const handleBackButtonPress = () => {
    navigation.goBack()
  }

  return (
    <Formik
      initialValues={{ password: "" }}
      onSubmit={handleContinueButtonPress}
      validationSchema={Yup.object().shape({
        password: Yup.string().min(8).matches(/[A-Z]/).matches(/[a-z]/).matches(/[0-9]/).required(),
      })}
      validateOnMount
    >
      {({ handleChange, handleSubmit, isValid, values }) => {
        return (
          <BottomSheetScrollView>
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
          </BottomSheetScrollView>
        )
      }}
    </Formik>
  )
}

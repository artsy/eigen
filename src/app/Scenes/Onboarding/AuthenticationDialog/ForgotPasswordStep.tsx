import { BackButton, Button, Flex, Text, useTheme } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { AuthenticationDialogFormValues } from "app/Scenes/Onboarding/AuthenticationDialog/AuthenticationDialogForm"
import { OnboardingHomeNavigationStack } from "app/Scenes/Onboarding/OnboardingHome"
import { Field, useFormikContext } from "formik"

type ForgotPasswordStepProps = StackScreenProps<OnboardingHomeNavigationStack, "ForgotPasswordStep">

export const ForgotPasswordStep: React.FC<ForgotPasswordStepProps> = ({ navigation }) => {
  const { values, handleChange, handleSubmit, isValid } =
    useFormikContext<AuthenticationDialogFormValues>()

  const { space } = useTheme()

  const handleBackButtonPress = () => {
    navigation.goBack()
  }

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
}

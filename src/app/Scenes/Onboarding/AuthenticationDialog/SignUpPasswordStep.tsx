import { BackButton, Button, Flex, Text, useTheme } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { AuthenticationDialogFormValues } from "app/Scenes/Onboarding/AuthenticationDialog/AuthenticationDialogForm"
import { OnboardingHomeNavigationStack } from "app/Scenes/Onboarding/OnboardingHome"
import { useFormikContext } from "formik"

type SignUpPasswordStepProps = StackScreenProps<OnboardingHomeNavigationStack, "SignUpPasswordStep">

export const SignUpPasswordStep: React.FC<SignUpPasswordStepProps> = ({ navigation }) => {
  const { errors, handleChange, handleSubmit, isValid, setErrors } =
    useFormikContext<AuthenticationDialogFormValues>()

  const { color, space } = useTheme()

  const handleBackButtonPress = () => {
    navigation.goBack()
  }

  return (
    <BottomSheetScrollView>
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
          testID="passwordInput"
        />

        <Button block width={100} onPress={handleSubmit} disabled={!isValid}>
          Continue
        </Button>
      </Flex>
    </BottomSheetScrollView>
  )
}

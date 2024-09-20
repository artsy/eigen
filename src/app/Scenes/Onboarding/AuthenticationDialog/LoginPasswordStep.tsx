import { BackButton, Button, Flex, Text, useTheme } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { AuthenticationDialogFormValues } from "app/Scenes/Onboarding/AuthenticationDialog/AuthenticationDialogForm"
import { OnboardingHomeNavigationStack } from "app/Scenes/Onboarding/OnboardingHome"
import { useFormikContext } from "formik"

type LoginPasswordStepProps = StackScreenProps<OnboardingHomeNavigationStack, "LoginPasswordStep">

export const LoginPasswordStep: React.FC<LoginPasswordStepProps> = ({ navigation }) => {
  const { dirty, errors, handleChange, handleSubmit, isValid, setErrors, validateForm, values } =
    useFormikContext<AuthenticationDialogFormValues>()

  const { color, space } = useTheme()

  const handleBackButtonPress = () => {
    navigation.goBack()
  }

  return (
    <BottomSheetScrollView>
      <Flex padding={2} gap={space(1)}>
        <BackButton onPress={handleBackButtonPress} />
        <Text variant="sm-display">Welcome back to Artsy</Text>

        <BottomSheetInput
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          autoFocus
          onChangeText={(text) => {
            // Hide error when the user starts to type again
            if (errors.password) {
              setErrors({
                password: undefined,
              })
              validateForm()
            }
            handleChange("password")(text)
          }}
          onSubmitEditing={() => {
            if (dirty && !!values.password) {
              handleSubmit()
            }
          }}
          onBlur={() => validateForm()}
          placeholderTextColor={color("black30")}
          secureTextEntry
          title="Password"
          returnKeyType="done"
          // We need to to set textContentType to password here
          // enable autofill of login details from the device keychain.
          textContentType="password"
          error={errors.password}
          testID="password"
        />

        <Button block width={100} onPress={handleSubmit} disabled={!isValid}>
          Continue
        </Button>
      </Flex>
    </BottomSheetScrollView>
  )
}

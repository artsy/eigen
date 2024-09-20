import { BackButton, Button, Flex, Text, useTheme } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { AuthenticationDialogFormValues } from "app/Scenes/Onboarding/AuthenticationDialog/AuthenticationDialogForm"
import { OnboardingHomeNavigationStack } from "app/Scenes/Onboarding/OnboardingHome"
import { useFormikContext } from "formik"
import { Platform } from "react-native"

type EmailStepProps = StackScreenProps<OnboardingHomeNavigationStack, "EmailStep">

export const EmailStep: React.FC<EmailStepProps> = ({ navigation }) => {
  const { color, space } = useTheme()

  const { errors, handleChange, handleSubmit, isValid, setErrors } =
    useFormikContext<AuthenticationDialogFormValues>()

  const handleBackButtonPress = () => {
    navigation.goBack()
  }

  return (
    <BottomSheetScrollView>
      <Flex padding={2} gap={space(1)}>
        <BackButton onPress={handleBackButtonPress} />

        <Text variant="sm-display">Sign up or log in</Text>

        <BottomSheetInput
          autoCapitalize="none"
          autoComplete="email"
          enableClearButton
          autoFocus
          title="Email"
          keyboardType="email-address"
          onChangeText={(text) => {
            // Hide error when the user starts to type again
            if (errors.email) {
              setErrors({
                email: undefined,
              })
            }
            handleChange("email")(text.trim())
          }}
          onSubmitEditing={handleSubmit}
          blurOnSubmit={false}
          placeholderTextColor={color("black30")}
          placeholder="Email address"
          returnKeyType="next"
          spellCheck={false}
          autoCorrect={false}
          textContentType={Platform.OS === "ios" ? "username" : "emailAddress"}
          error={errors.email}
          testID="emailInput"
        />

        <Button block width={100} onPress={handleSubmit} disabled={!isValid}>
          Continue
        </Button>
      </Flex>
    </BottomSheetScrollView>
  )
}

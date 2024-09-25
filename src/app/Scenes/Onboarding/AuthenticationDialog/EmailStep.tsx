import { BackButton, Button, Flex, Input, Text, useTheme } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { useRecaptcha } from "app/Components/Recaptcha/Recaptcha"
import { AuthenticationDialogFormValues } from "app/Scenes/Onboarding/AuthenticationDialog/AuthenticationDialogForm"
import { OnboardingHomeNavigationStack } from "app/Scenes/Onboarding/OnboardingHome"
import { useFormikContext } from "formik"
import { useEffect } from "react"

type EmailStepProps = StackScreenProps<OnboardingHomeNavigationStack, "EmailStep">

export const EmailStep: React.FC<EmailStepProps> = ({ navigation }) => {
  const { color, space } = useTheme()

  const { errors, handleChange, handleSubmit, isValid, setFieldValue, values } =
    useFormikContext<AuthenticationDialogFormValues>()

  const { Recaptcha, token } = useRecaptcha({ source: "authentication", action: "verify_email" })

  useEffect(() => {
    setFieldValue("recaptchaToken", token)
  }, [token, setFieldValue])

  const handleBackButtonPress = () => {
    navigation.goBack()
  }

  return (
    <BottomSheetScrollView>
      <Flex padding={2} gap={space(1)}>
        <BackButton onPress={handleBackButtonPress} />

        <Text variant="sm-display">Sign up or log in</Text>

        <Recaptcha />

        <Input
          autoCapitalize="none"
          autoComplete="email"
          // There is no need to autofocus here if we are getting
          // the email already from the navigation params
          autoFocus={!values.email}
          keyboardType="email-address"
          onChangeText={(text) => {
            handleChange("email")(text.trim())
          }}
          blurOnSubmit={false} // This is needed to avoid UI jump when the user submits
          placeholderTextColor={color("black30")}
          title="Email"
          returnKeyType="next"
          spellCheck={false}
          autoCorrect={false}
          // We need to to set textContentType to username (instead of emailAddress) here
          // enable autofill of login details from the device keychain.
          textContentType="username"
          error={errors.email}
          testID="email-address"
        />

        <Button block width={100} onPress={handleSubmit} disabled={!isValid}>
          Continue
        </Button>
      </Flex>
    </BottomSheetScrollView>
  )
}

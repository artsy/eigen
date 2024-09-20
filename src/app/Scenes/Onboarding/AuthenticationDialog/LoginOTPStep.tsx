import {
  BackButton,
  Button,
  Flex,
  LinkText,
  SimpleMessage,
  Spacer,
  Text,
  useTheme,
} from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { AuthenticationDialogFormValues } from "app/Scenes/Onboarding/AuthenticationDialog/AuthenticationDialogForm"
import { OnboardingHomeNavigationStack } from "app/Scenes/Onboarding/OnboardingHome"
import { useFormikContext } from "formik"
import { useState } from "react"

type LoginOTPStepProps = StackScreenProps<OnboardingHomeNavigationStack, "LoginOTPStep">

export const LoginOTPStep: React.FC<LoginOTPStepProps> = ({ navigation, route }) => {
  const [recoveryCodeMode, setRecoveryCodeMode] = useState(false)

  const { errors, handleChange, handleSubmit, isValid, setErrors, validateForm, values } =
    useFormikContext<AuthenticationDialogFormValues>()

  const { color, space } = useTheme()

  const handleBackButtonPress = () => {
    navigation.goBack()
  }

  return (
    <BottomSheetScrollView>
      <Flex padding={2} gap={space(1)}>
        <BackButton onPress={handleBackButtonPress} />

        <Text variant="sm-display">Authentication Code</Text>

        <BottomSheetInput
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
          autoComplete="one-time-code"
          keyboardType={recoveryCodeMode ? "ascii-capable" : "number-pad"}
          onChangeText={(text) => {
            // Hide error when the user starts to type again
            if (errors.otp) {
              setErrors({ otp: undefined })
              validateForm()
            }
            handleChange("otp")(text)
          }}
          onBlur={() => validateForm()}
          placeholder={recoveryCodeMode ? "Enter a recovery code" : "Enter an authentication code"}
          placeholderTextColor={color("black30")}
          title={recoveryCodeMode ? "Recovery code" : undefined}
          returnKeyType="done"
          value={values.otp}
          error={errors.otp}
        />
        <Spacer y={1} />
        <LinkText variant="sm" color="black60" onPress={() => setRecoveryCodeMode((v) => !v)}>
          {recoveryCodeMode ? "Enter authentication code" : "Enter recovery code instead"}
        </LinkText>

        {route.params.otpMode === "on_demand" && (
          <>
            <Spacer y={2} />
            <SimpleMessage testID="on_demand_message">
              Your safety and security are important to us. Please check your email for a one-time
              authentication code to complete your login.
            </SimpleMessage>
          </>
        )}

        <Button block width={100} onPress={handleSubmit} disabled={!isValid}>
          Continue
        </Button>
      </Flex>
    </BottomSheetScrollView>
  )
}

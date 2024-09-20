import { BackButton, Button, Flex, Text, useTheme } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { AuthenticationDialogFormValues } from "app/Scenes/Onboarding/AuthenticationDialog/AuthenticationDialog"
import { OnboardingHomeNavigationStack } from "app/Scenes/Onboarding/OnboardingHome"
import { useFormikContext } from "formik"
import * as Yup from "yup"

type SignUpPasswordStepProps = StackScreenProps<OnboardingHomeNavigationStack, "SignUpPasswordStep">

export const SignUpPasswordStep: React.FC<SignUpPasswordStepProps> = ({ navigation }) => {
  const { errors, handleChange, handleSubmit, isValid, setErrors } =
    useFormikContext<AuthenticationDialogFormValues>()

  const { color, space } = useTheme()

  const handleContinueButtonPress = () => {
    navigation.navigate("SignUpNameStep")
  }

  const handleBackButtonPress = () => {
    navigation.goBack()
  }

  return (
    <BottomSheetScrollView>
      <Flex padding={2} gap={space(1)}>
        <BackButton onPress={handleBackButtonPress} />
        <Text variant="sm-display">Welcome to Artsy</Text>

        {/* <Field
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
              /> */}

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

        <Button block width={100} onPress={handleContinueButtonPress} disabled={!isValid}>
          Continue
        </Button>
      </Flex>
    </BottomSheetScrollView>
  )
}

export const SignUpPasswordStepValidationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Your password should be at least 8 characters")
    .matches(/[A-Z]/, "Your password should contain at least one uppercase letter")
    .matches(/[a-z]/, "Your password should contain at least one lowercase letter")
    .matches(/[0-9]/, "Your password should contain at least one digit")
    .required("Password field is required"),
})

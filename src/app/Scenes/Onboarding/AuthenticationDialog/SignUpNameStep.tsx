import { BackButton, Button, Flex, Text, useTheme } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { AuthenticationDialogFormValues } from "app/Scenes/Onboarding/AuthenticationDialog/AuthenticationDialog"
import { EmailSubscriptionCheckbox } from "app/Scenes/Onboarding/OnboardingCreateAccount/EmailSubscriptionCheckbox"
import { TermsOfServiceCheckbox } from "app/Scenes/Onboarding/OnboardingCreateAccount/TermsOfServiceCheckbox"
import { OnboardingHomeNavigationStack } from "app/Scenes/Onboarding/OnboardingHome"
import { useFormikContext } from "formik"
import { useState } from "react"
import { Keyboard } from "react-native"
import * as Yup from "yup"

type SignUpNameStepProps = StackScreenProps<OnboardingHomeNavigationStack, "SignUpNameStep">

export const SignUpNameStep: React.FC<SignUpNameStepProps> = ({ navigation }) => {
  const [highlightTerms, setHighlightTerms] = useState<boolean>(false)

  const { values, errors, handleChange, handleSubmit, isValid, setFieldValue, setErrors } =
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

        {/* <Field
          name="name"
          autoCapitalize="none"
          autoComplete="current-password"
          autoCorrect={false}
          secureTextEntry
          component={BottomSheetInput}
          placeholder="First and last name"
          returnKeyType="done"
          title="Full Name"
          value={values.password}
          onChangeText={handleChange("password")}
        /> */}

        <BottomSheetInput
          autoCapitalize="words"
          autoComplete="name"
          autoCorrect={false}
          autoFocus
          title="Full Name"
          onChangeText={(text) => {
            if (errors.name) {
              setErrors({
                name: undefined,
              })
            }
            handleChange("name")(text)
          }}
          onSubmitEditing={() => {
            Keyboard.dismiss()
            requestAnimationFrame(() => {
              if (values.acceptedTerms) {
                handleSubmit()
              } else {
                setHighlightTerms(true)
              }
            })
          }}
          blurOnSubmit={false}
          placeholder="First and last name"
          placeholderTextColor={color("black30")}
          returnKeyType="done"
          maxLength={128}
          error={errors.name}
          testID="nameInput"
        />

        <Flex my={2}>
          <TermsOfServiceCheckbox
            setChecked={() => setFieldValue("acceptedTerms", !values.acceptedTerms)}
            checked={values.acceptedTerms}
            error={highlightTerms}
            navigation={navigation}
          />
          <EmailSubscriptionCheckbox
            setChecked={() => setFieldValue("agreedToReceiveEmails", !values.agreedToReceiveEmails)}
            checked={values.agreedToReceiveEmails}
          />
        </Flex>

        <Button block width={100} onPress={handleSubmit} disabled={!isValid}>
          Continue
        </Button>
      </Flex>
    </BottomSheetScrollView>
  )
}

export const SignUpNameStepValidationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Full name field is required"),
})

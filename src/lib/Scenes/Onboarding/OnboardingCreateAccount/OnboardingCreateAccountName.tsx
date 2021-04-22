import { StackScreenProps } from "@react-navigation/stack"
import { useFormikContext } from "formik"
import { Input } from "lib/Components/Input/Input"
import { color } from "palette"
import React from "react"
import {
  OnboardingCreateAccountNavigationStack,
  OnboardingCreateAccountScreenWrapper,
  UserSchema,
} from "./OnboardingCreateAccount"

export interface OnboardingCreateAccountNameProps
  extends StackScreenProps<OnboardingCreateAccountNavigationStack, "OnboardingCreateAccountName"> {}

export const OnboardingCreateAccountName: React.FC<OnboardingCreateAccountNameProps> = ({ navigation }) => {
  const { values, handleSubmit, handleChange, validateForm, errors } = useFormikContext<UserSchema>()

  return (
    <OnboardingCreateAccountScreenWrapper
      onBackButtonPress={navigation.goBack}
      title="What’s your full name?"
      caption="Galleries and auction houses you contact will identity you by your full name."
    >
      <Input
        autoCapitalize="words"
        autoCompleteType="name"
        autoCorrect={false}
        autoFocus
        onChangeText={(text) => {
          handleChange("name")(text)
        }}
        onSubmitEditing={handleSubmit}
        onBlur={() => validateForm()}
        blurOnSubmit={false}
        placeholder="First and Last Name"
        placeholderTextColor={color("black30")}
        returnKeyType="done"
        maxLength={128}
        value={values.name}
        error={errors.name}
        testID="nameInput"
      />
    </OnboardingCreateAccountScreenWrapper>
  )
}

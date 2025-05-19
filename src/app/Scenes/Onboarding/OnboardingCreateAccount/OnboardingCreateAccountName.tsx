import { Flex, Input, Spacer, useColor } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { useFormikContext } from "formik"
import React, { useState } from "react"
import { Keyboard } from "react-native"
import { EmailSubscriptionCheckbox } from "./EmailSubscriptionCheckbox"
import {
  FormikSchema,
  OnboardingCreateAccountNavigationStack,
  OnboardingCreateAccountScreenWrapper,
} from "./OnboardingCreateAccount"
import { TermsOfServiceCheckbox } from "./TermsOfServiceCheckbox"

export type OnboardingCreateAccountNameProps = StackScreenProps<
  OnboardingCreateAccountNavigationStack,
  "OnboardingCreateAccountName"
>

export const OnboardingCreateAccountName: React.FC<OnboardingCreateAccountNameProps> = ({
  navigation,
}) => {
  const color = useColor()
  const { values, handleSubmit, handleChange, errors, setErrors, setFieldValue } =
    useFormikContext<FormikSchema>()
  const [highlightTerms, setHighlightTerms] = useState<boolean>(false)

  return (
    <OnboardingCreateAccountScreenWrapper
      onBackButtonPress={navigation.goBack}
      title="What’s your full name?"
      caption="This is used to build your profile and collection on Artsy."
    >
      <Input
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
        placeholderTextColor={color("mono30")}
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
          navigation={navigation as any}
        />
        <Spacer y={2} />
        <EmailSubscriptionCheckbox
          setChecked={() => setFieldValue("agreedToReceiveEmails", !values.agreedToReceiveEmails)}
          checked={values.agreedToReceiveEmails}
        />
      </Flex>
    </OnboardingCreateAccountScreenWrapper>
  )
}

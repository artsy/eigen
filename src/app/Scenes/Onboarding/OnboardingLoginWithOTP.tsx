import {
  Box,
  Button,
  Flex,
  Input,
  LinkText,
  SimpleMessage,
  Spacer,
  Text,
  useColor,
} from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { BackButton } from "app/system/navigation/BackButton"
import { useScreenDimensions } from "app/utils/hooks"
import { useFormikContext } from "formik"
import React, { useRef, useState } from "react"
import { KeyboardAvoidingView, ScrollView } from "react-native"
import * as Yup from "yup"
import { OnboardingNavigationStack } from "./Onboarding"

export type OnboardingLoginWithOTPProps = StackScreenProps<
  OnboardingNavigationStack,
  "OnboardingLoginWithOTP"
>

export interface OnboardingLoginWithOTPFormProps
  extends StackScreenProps<OnboardingNavigationStack, "OnboardingLoginWithOTP"> {
  otpMode: OTPMode
}

export interface OnboardingLoginWithOTPValuesSchema {
  otp: string
}

export type OTPMode = "on_demand" | "standard"

export const otpSchema = Yup.object().shape({
  otp: Yup.string().test("otp", "This field is required", (value) => value !== ""),
})

export const OnboardingLoginWithOTPForm: React.FC<OnboardingLoginWithOTPFormProps> = ({
  navigation,
  otpMode,
}) => {
  const color = useColor()

  const {
    values,
    handleChange,
    handleSubmit,
    errors,
    setErrors,
    isValid,
    dirty,
    isSubmitting,
    validateForm,
  } = useFormikContext<OnboardingLoginWithOTPValuesSchema>()

  const otpInputRef = useRef<Input>(null)
  const [recoveryCodeMode, setRecoveryCodeMode] = useState(false)

  return (
    <Flex flex={1} backgroundColor="background" flexGrow={1} pb={1}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            paddingTop: useScreenDimensions().safeAreaInsets.top,
            paddingHorizontal: 20,
          }}
          keyboardShouldPersistTaps="always"
        >
          <Spacer y={6} />
          <Text variant="lg-display">Authentication Code</Text>
          <Box>
            <Spacer y={6} />
            <Input
              ref={otpInputRef}
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
              placeholder={
                recoveryCodeMode ? "Enter a recovery code" : "Enter an authentication code"
              }
              placeholderTextColor={color("mono30")}
              title={recoveryCodeMode ? "Recovery code" : undefined}
              returnKeyType="done"
              value={values.otp}
              error={errors.otp}
            />
            <Spacer y={1} />
            <LinkText variant="sm" color="mono60" onPress={() => setRecoveryCodeMode((v) => !v)}>
              {recoveryCodeMode ? "Enter authentication code" : "Enter recovery code instead"}
            </LinkText>

            {otpMode === "on_demand" ? (
              <>
                <Spacer y={2} />
                <SimpleMessage testID="on_demand_message">
                  Your safety and security are important to us. Please check your email for a
                  one-time authentication code to complete your login.
                </SimpleMessage>
              </>
            ) : null}
          </Box>
          <Spacer y={4} />
        </ScrollView>
        <BackButton onPress={() => navigation.goBack()} />
        <Flex px={2} paddingBottom={2}>
          <Button
            onPress={() => handleSubmit()}
            block
            haptic="impactMedium"
            disabled={!(isValid && dirty) || isSubmitting}
            loading={isSubmitting}
            testID="loginButton"
            variant="fillDark"
          >
            Log in
          </Button>
        </Flex>
      </KeyboardAvoidingView>
    </Flex>
  )
}

import { StackScreenProps } from "@react-navigation/stack"
import { FormikProvider, useFormik, useFormikContext } from "formik"
import { BackButton } from "lib/navigation/BackButton"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Button, Flex, Input, Spacer, Text, useColor } from "palette"
import React, { useRef } from "react"
import { ScrollView, View } from "react-native"
import * as Yup from "yup"
import { OnboardingNavigationStack } from "./Onboarding"

export interface OnboardingLoginWithOTPProps
  extends StackScreenProps<OnboardingNavigationStack, "OnboardingLoginWithOTP"> {
  email: string
  password: string
}

export interface OnboardingLoginWithOTPValuesSchema {
  otp: string
}

const initialValues: OnboardingLoginWithOTPValuesSchema = { otp: "" }

export const otpSchema = Yup.object().shape({
  otp: Yup.string().test("otp", "This field is required", (value) => value !== ""),
})

export const OnboardingLoginWithOTPForm: React.FC<OnboardingLoginWithOTPProps> = ({
  navigation,
  route,
  email,
  password,
}) => {
  const color = useColor()

  const { values, handleChange, handleSubmit, errors, setErrors, isValid, dirty, isSubmitting, validateForm } =
    useFormikContext<OnboardingLoginWithOTPValuesSchema>()

  const otpInputRef = useRef<Input>(null)

  return (
    <View style={{ flex: 1, backgroundColor: "white", flexGrow: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: useScreenDimensions().safeAreaInsets.top, paddingHorizontal: 20 }}
        keyboardShouldPersistTaps="always"
      >
        <Spacer mt={60} />
        <Text variant="lg">Authentication Code</Text>
        <Spacer mt={50} />
        <Box>
          <Input
            ref={otpInputRef}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numeric"
            onChangeText={(text) => {
              // Hide error when the user starts to type again
              if (errors.otp) {
                setErrors({
                  otp: undefined,
                })
                validateForm()
              }
              handleChange("otp")(text)
            }}
            onBlur={() => validateForm()}
            placeholder="Enter an authentication code"
            placeholderTextColor={color("black30")}
            title="Authentication Code"
            returnKeyType="done"
            value={values.otp}
            error={errors.otp}
          />
        </Box>
        <Spacer mt={4} />
      </ScrollView>
      <BackButton onPress={() => navigation.goBack()} />
      <Flex px={2} paddingBottom={2}>
        <Button
          onPress={handleSubmit}
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
    </View>
  )
}

export const OnboardingLoginWithOTP: React.FC<OnboardingLoginWithOTPProps> = ({
  navigation,
  route,
  email,
  password,
}) => {
  const formik = useFormik<OnboardingLoginWithOTPValuesSchema>({
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    initialValues,
    initialErrors: {},
    onSubmit: async ({ otp }, { setErrors, validateForm }) => {
      console.log("2FATest submitted otp", otp)
    },
    validationSchema: otpSchema,
  })

  return (
    <FormikProvider value={formik}>
      <OnboardingLoginWithOTPForm navigation={navigation} route={route} email={email} password={password} />
    </FormikProvider>
  )
}

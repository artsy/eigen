import { StackScreenProps } from "@react-navigation/stack"
import { FormikProvider, useFormik, useFormikContext } from "formik"
import { BackButton } from "lib/navigation/BackButton"
import { GlobalStore } from "lib/store/GlobalStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Button, Flex, Input, Message, Spacer, Text, useColor } from "palette"
import React, { useRef } from "react"
import { ScrollView, View } from "react-native"
import * as Yup from "yup"
import { OnboardingNavigationStack } from "./Onboarding"

export interface OnboardingLoginWithOTPProps
  extends StackScreenProps<OnboardingNavigationStack, "OnboardingLoginWithOTP"> {
  email: string
  password: string
  otpMode: OTPMode
}

export interface OnboardingLoginWithOTPValuesSchema {
  otp: string
}

export type OTPMode = "on_demand" | "standard"

const initialValues: OnboardingLoginWithOTPValuesSchema = { otp: "" }

export const otpSchema = Yup.object().shape({
  otp: Yup.string().test("otp", "This field is required", (value) => value !== ""),
})

export const OnboardingLoginWithOTPForm: React.FC<OnboardingLoginWithOTPProps> = ({ navigation, otpMode }) => {
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
        <Box>
          {otpMode === "on_demand" ? (
            <>
              <Spacer mb={20} />
              <Message>
                Your safety and security are important to us. Please check your email for a one-time authentication code
                to complete your login.
              </Message>
              <Spacer mb={20} />
            </>
          ) : (
            <Spacer mt={50} />
          )}
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

export const OnboardingLoginWithOTP: React.FC<OnboardingLoginWithOTPProps> = ({ navigation, route }) => {
  const email = route.params.email
  const password = route.params.password
  const otpMode = route.params.otpMode

  const formik = useFormik<OnboardingLoginWithOTPValuesSchema>({
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    initialValues,
    initialErrors: {},
    onSubmit: async ({ otp }, { setErrors, validateForm }) => {
      validateForm()
      const res = await GlobalStore.actions.auth.signIn({
        oauthProvider: "email",
        email,
        password,
        otp,
      })

      if (res === "invalid_otp") {
        setErrors({ otp: "Invalid two-factor authentication code" })
      } else if (res !== "success") {
        // TODO: What should generic error be?
        setErrors({ otp: "Something went wrong" })
      }
    },
    validationSchema: otpSchema,
  })

  return (
    <FormikProvider value={formik}>
      <OnboardingLoginWithOTPForm
        navigation={navigation}
        route={route}
        email={email}
        password={password}
        otpMode={otpMode}
      />
    </FormikProvider>
  )
}

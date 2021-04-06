import { StackScreenProps } from "@react-navigation/stack"
import { FormikProvider, useFormik, useFormikContext } from "formik"
import { Input } from "lib/Components/Input/Input"
import { BackButton } from "lib/navigation/BackButton"
import { GlobalStore } from "lib/store/GlobalStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Button, color, Flex, Spacer, Text } from "palette"
import React, { useState } from "react"
import { ScrollView, View } from "react-native"
import * as Yup from "yup"
import { OnboardingNavigationStack } from "./Onboarding"

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Please provide a valid email address"),
})
export interface OnboardingForgotPasswordValuesSchema {
  email: string
}

export interface OnboardingForgotPasswordProps extends StackScreenProps<OnboardingNavigationStack, "OnboardingLogin"> {}
export interface OnboardingForgotPasswordFormProps extends OnboardingForgotPasswordProps {
  requestedPasswordReset: boolean
}

export const OnboardingForgotPasswordForm: React.FC<OnboardingForgotPasswordFormProps> = ({
  navigation,
  requestedPasswordReset,
}) => {
  const {
    values,
    handleSubmit,
    handleChange,
    validateForm,
    submitCount,
    errors,
    isValid,
    dirty,
    isSubmitting,
  } = useFormikContext<OnboardingForgotPasswordValuesSchema>()

  return (
    <View style={{ flex: 1, backgroundColor: "white", flexGrow: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: useScreenDimensions().safeAreaInsets.top }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <BackButton onPress={() => navigation.goBack()} />
        <Flex flex={1} px={1.5} paddingTop={60} justifyContent="flex-start">
          <Text variant="largeTitle">Forgot password</Text>
          <Text pt={1.5} variant="caption" color="black60">
            Please enter the email address for your Artsy account and we’ll send you a reset link.
          </Text>
          <Spacer mt={100} />
          <Input
            autoCapitalize="none"
            autoCompleteType="email"
            enableClearButton
            keyboardType="email-address"
            onChangeText={(text) => {
              handleChange("email")(text.trim())
            }}
            onSubmitEditing={handleSubmit}
            onBlur={() => validateForm()}
            blurOnSubmit={false} // This is needed to avoid UI jump when the user submits
            placeholder="Email address"
            placeholderTextColor={color("black30")}
            value={values.email}
            returnKeyType="done"
            spellCheck={false}
            autoCorrect={false}
            // We need to to set textContentType to username (instead of emailAddress) here
            // enable autofill of login details from the device keychain.
            textContentType="username"
            error={submitCount > 0 ? errors.email : undefined}
          />
          <Spacer mt={22} />
          {!!requestedPasswordReset && (
            <Text variant="caption" color="black60">
              Password reset link sent. Check your email.
            </Text>
          )}
        </Flex>
      </ScrollView>
      <Flex alignSelf="flex-end" px={1.5} paddingBottom={1.5}>
        {!!requestedPasswordReset ? (
          <>
            <Button
              variant="secondaryGray"
              onPress={() => navigation.goBack()}
              block
              haptic="impactMedium"
              testID="returnToLoginButton"
            >
              Return to login
            </Button>
            <Spacer mb={1} />
            <Button
              variant="secondaryOutline"
              onPress={handleSubmit}
              loading={isSubmitting}
              block
              haptic="impactMedium"
              testID="returnToLoginButton"
            >
              Send again
            </Button>
          </>
        ) : (
          <Button
            onPress={handleSubmit}
            block
            haptic="impactMedium"
            disabled={!(isValid && dirty)}
            loading={isSubmitting}
            testID="resetButton"
          >
            Send reset link
          </Button>
        )}
      </Flex>
    </View>
  )
}

const initialValues: OnboardingForgotPasswordValuesSchema = { email: "" }

export const OnboardingForgotPassword: React.FC<OnboardingForgotPasswordProps> = ({ navigation, route }) => {
  const [requestedPasswordReset, setRequestedPasswordReset] = useState(false)

  const formik = useFormik<OnboardingForgotPasswordValuesSchema>({
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    initialValues,
    initialErrors: {},
    onSubmit: async ({ email }, { setErrors, validateForm }) => {
      await validateForm()
      const res = await GlobalStore.actions.auth.forgotPassword({
        email,
      })
      if (!res) {
        // For security purposes, we are returning a generic error message
        setErrors({ email: "Something went wrong" })
      } else {
        setRequestedPasswordReset(true)
      }
    },
    validationSchema: forgotPasswordSchema,
  })

  return (
    <FormikProvider value={formik}>
      <OnboardingForgotPasswordForm
        navigation={navigation}
        route={route}
        requestedPasswordReset={requestedPasswordReset}
      />
    </FormikProvider>
  )
}

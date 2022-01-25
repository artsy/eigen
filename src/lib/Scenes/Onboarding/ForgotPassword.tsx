import { StackScreenProps } from "@react-navigation/stack"
import { FormikProvider, useFormik, useFormikContext } from "formik"
import { BackButton } from "lib/navigation/BackButton"
import { GlobalStore } from "lib/store/GlobalStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Button, Flex, Input, Spacer, Text, useColor } from "palette"
import React, { useRef, useState } from "react"
import { ScrollView, View } from "react-native"
import * as Yup from "yup"
import { OnboardingNavigationStack } from "./Onboarding"

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Please provide a valid email address"),
})
export interface ForgotPasswordValuesSchema {
  email: string
}

export interface ForgotPasswordProps
  extends StackScreenProps<OnboardingNavigationStack, "OnboardingLogin"> {}
export interface ForgotPasswordFormProps extends ForgotPasswordProps {
  requestedPasswordReset: boolean
  inputRef?: React.Ref<Input>
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  navigation,
  requestedPasswordReset,
  inputRef,
}) => {
  const { values, handleSubmit, handleChange, validateForm, isValid, dirty, isSubmitting } =
    useFormikContext<ForgotPasswordValuesSchema>()
  const color = useColor()

  return (
    <View style={{ flex: 1, backgroundColor: "white", flexGrow: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: useScreenDimensions().safeAreaInsets.top }}
        keyboardShouldPersistTaps="always"
      >
        <Flex flex={1} px={1.5} paddingTop={60} justifyContent="flex-start">
          <Text variant="lg">Forgot Password?</Text>
          <Text pt={0.5} color="black100" variant="xs">
            Please enter the email address associated with your Artsy account to receive a reset
            link.
          </Text>
          <Spacer mt={2} />

          {!!requestedPasswordReset ? (
            <Text color="blue100">Password reset link sent. Check your email.</Text>
          ) : (
            <Input
              ref={inputRef}
              autoCapitalize="none"
              autoComplete="email"
              enableClearButton
              keyboardType="email-address"
              onChangeText={(text) => {
                handleChange("email")(text.trim())
              }}
              onSubmitEditing={handleSubmit}
              onBlur={() => {
                validateForm()
              }}
              blurOnSubmit={false} // This is needed to avoid UI jump when the user submits
              placeholder="Email address"
              placeholderTextColor={color("black30")}
              value={values.email}
              returnKeyType="done"
              spellCheck={false}
              autoCorrect={false}
              textContentType="emailAddress"
            />
          )}
        </Flex>
      </ScrollView>
      <BackButton onPress={() => navigation.goBack()} />
      <Flex px={1.5} paddingBottom={1.5}>
        {!!requestedPasswordReset ? (
          <>
            <Button
              variant="fillDark"
              onPress={() => navigation.goBack()}
              block
              haptic="impactMedium"
              testID="returnToLoginButton"
            >
              Return to login
            </Button>
            <Spacer mt={1} />
            <Button
              onPress={handleSubmit}
              block
              haptic="impactMedium"
              disabled={!isValid || !dirty}
              loading={isSubmitting}
              testID="resetButton"
              variant="outline"
            >
              Send Again
            </Button>
          </>
        ) : (
          <Button
            onPress={handleSubmit}
            block
            variant="fillDark"
            haptic="impactMedium"
            disabled={!isValid || !dirty}
            loading={isSubmitting}
            testID="resetButton"
          >
            Send Reset Link
          </Button>
        )}
      </Flex>
    </View>
  )
}

const initialValues: ForgotPasswordValuesSchema = { email: "" }

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ navigation, route }) => {
  const [requestedPasswordReset, setRequestedPasswordReset] = useState(false)

  const inputRef = useRef<Input>(null)

  const formik = useFormik<ForgotPasswordValuesSchema>({
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
        setErrors({
          email:
            "Couldn’t send reset password link. Please try again, or contact support@artsy.net",
        })
      } else {
        setRequestedPasswordReset(true)
        inputRef.current?.blur()
      }
    },
    validationSchema: forgotPasswordSchema,
  })

  return (
    <FormikProvider value={formik}>
      <ForgotPasswordForm
        inputRef={inputRef}
        navigation={navigation}
        route={route}
        requestedPasswordReset={requestedPasswordReset}
      />
    </FormikProvider>
  )
}

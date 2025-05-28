import {
  BackButton,
  Button,
  Flex,
  Input,
  SimpleMessage,
  Spacer,
  Text,
  Touchable,
  useTheme,
} from "@artsy/palette-mobile"
import {
  useAuthNavigation,
  useAuthScreen,
} from "app/Scenes/Onboarding/Auth2/hooks/useAuthNavigation"
import { useInputAutofocus } from "app/Scenes/Onboarding/Auth2/hooks/useInputAutofocus"
import { GlobalStore } from "app/store/GlobalStore"
import { Formik } from "formik"
import { useRef, useState } from "react"
import * as Yup from "yup"

interface LoginOTPStepFormValues {
  otp: string
}

export const LoginOTPStep: React.FC = () => {
  const [codeType, setCodeType] = useState<"authentication" | "recovery">("authentication")

  const navigation = useAuthNavigation()
  const screen = useAuthScreen()
  const otpRef = useRef<Input>(null)

  const { color } = useTheme()

  useInputAutofocus({
    screenName: "LoginOTPStep",
    inputRef: otpRef,
  })

  return (
    <Formik<LoginOTPStepFormValues>
      initialValues={{ otp: "" }}
      validationSchema={Yup.object().shape({
        otp: Yup.string().required("This field is required"),
      })}
      onSubmit={async ({ otp }, { setErrors, resetForm }) => {
        const res = await GlobalStore.actions.auth.signIn({
          oauthProvider: "email",
          oauthMode: "email",
          email: screen.params?.email,
          password: screen.params?.password,
          otp: otp.trim(),
        })

        if (res === "invalid_otp") {
          setErrors({ otp: "Invalid two-factor authentication code" })
        } else if (res !== "success") {
          setErrors({ otp: "Something went wrong. Please try again, or contact support@artsy.net" })
        }

        if (res === "success") {
          resetForm()
        }
      }}
    >
      {({
        errors,
        handleChange,
        handleSubmit,
        isSubmitting,
        isValid,
        validateForm,
        values,
        resetForm,
      }) => (
        <Flex padding={2}>
          <BackButton
            onPress={() => {
              navigation.goBack()
              resetForm()
              setCodeType("authentication")
            }}
          />

          <Spacer y={1} />

          <Text variant="sm-display">Authentication Code</Text>

          <Input
            autoCapitalize="none"
            autoComplete="one-time-code"
            importantForAutofill="yes"
            autoCorrect={false}
            blurOnSubmit={false}
            error={errors.otp}
            keyboardType={codeType === "authentication" ? "numeric" : "ascii-capable"}
            placeholder={
              codeType === "authentication"
                ? "Enter an authentication code"
                : "Enter a recovery code"
            }
            placeholderTextColor={color("mono30")}
            ref={otpRef}
            returnKeyType="done"
            title={codeType === "authentication" ? "Authentication code" : "Recovery code"}
            value={values.otp}
            onChangeText={(text) => {
              handleChange("otp")(text)
            }}
            onBlur={() => validateForm()}
            onSubmitEditing={handleSubmit}
          />

          <Spacer y={1} />

          {screen.params?.otpMode === "on_demand" && (
            <>
              <Spacer y={2} />

              <SimpleMessage>
                Your safety and security are important to us. Please check your email for a one-time
                authentication code to complete your login.
              </SimpleMessage>
            </>
          )}

          <Spacer y={2} />

          <Button
            block
            width="100%"
            onPress={handleSubmit}
            disabled={!isValid}
            loading={isSubmitting}
          >
            Continue
          </Button>

          <Spacer y={2} />

          {screen.params?.otpMode === "standard" && (
            <Touchable
              accessibilityRole="button"
              onPress={() => {
                if (codeType === "authentication") {
                  setCodeType("recovery")
                } else {
                  setCodeType("authentication")
                }
              }}
            >
              <Text variant="xs" color="mono60" underline>
                {codeType === "authentication"
                  ? "Enter recovery code instead"
                  : "Enter authentication code"}
              </Text>
            </Touchable>
          )}
        </Flex>
      )}
    </Formik>
  )
}

import {
  BackButton,
  Button,
  Flex,
  Input,
  LinkText,
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
import { showBlockedAuthError } from "app/utils/auth/authHelpers"
import { Formik, useFormikContext } from "formik"
import { useRef } from "react"
import * as Yup from "yup"

export interface LoginPasswordStepFormValues {
  password: string
}

export const LoginPasswordStep: React.FC = () => {
  const screen = useAuthScreen()
  const navigation = useAuthNavigation()

  return (
    <Formik<LoginPasswordStepFormValues>
      initialValues={{ password: "" }}
      validationSchema={Yup.object().shape({
        password: Yup.string().required("Password field is required"),
      })}
      onSubmit={async ({ password }, { setErrors, resetForm }) => {
        const res = await GlobalStore.actions.auth.signIn({
          oauthProvider: "email",
          oauthMode: "email",
          email: screen.params?.email,
          password,
        })

        if (res === "otp_missing") {
          navigation.navigate({
            name: "LoginOTPStep",
            params: {
              otpMode: "standard",
              email: screen.params?.email,
              password,
            },
          })
        } else if (res === "on_demand_otp_missing") {
          navigation.navigate({
            name: "LoginOTPStep",
            params: {
              otpMode: "on_demand",
              email: screen.params?.email,
              password,
            },
          })
        }

        switch (true) {
          case res === "auth_blocked": {
            showBlockedAuthError("sign in")
            break
          }
          case res !== "success" && res !== "otp_missing" && res !== "on_demand_otp_missing": {
            setErrors({ password: "Incorrect email or password" }) // pragma: allowlist secret
            break
          }
          default: {
            resetForm()
          }
        }
      }}
    >
      <LoginPasswordStepForm />
    </Formik>
  )
}

const LoginPasswordStepForm: React.FC = () => {
  const {
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    isValid,
    resetForm,
    submitCount,
    values,
  } = useFormikContext<LoginPasswordStepFormValues>()

  const navigation = useAuthNavigation()
  const screen = useAuthScreen()
  const passwordRef = useRef<Input>(null)

  const { color } = useTheme()

  useInputAutofocus({
    screenName: "LoginPasswordStep",
    inputRef: passwordRef,
  })

  const handleBackButtonPress = () => {
    resetForm()
    navigation.goBack()
  }

  return (
    <Flex padding={2}>
      <BackButton onPress={handleBackButtonPress} />

      <Spacer y={1} />

      <Text variant="sm-display">Welcome back to Artsy</Text>

      <Input
        accessibilityHint="Enter your password"
        accessibilityLabel="Password Input"
        autoCapitalize="none"
        autoComplete="password"
        importantForAutofill="yes"
        autoCorrect={false}
        blurOnSubmit={false}
        error={submitCount > 0 ? errors.password : undefined}
        placeholderTextColor={color("mono30")}
        ref={passwordRef}
        returnKeyType="done"
        secureTextEntry
        testID="password"
        title="Password"
        value={values.password}
        onChangeText={(text) => {
          handleChange("password")(text)
        }}
        onSubmitEditing={() => handleSubmit()}
      />

      <Spacer y={1} />

      <Touchable
        accessibilityRole="button"
        onPress={() => {
          navigation.navigate({
            name: "ForgotPasswordStep",
            params: { email: screen.params?.email },
          })
          resetForm()
        }}
      >
        <Text variant="xs" color="mono60" underline>
          Forgot password?
        </Text>
      </Touchable>

      <Spacer y={2} />

      <Button
        block
        width="100%"
        onPress={() => handleSubmit()}
        disabled={!isValid || !values.password}
        loading={isSubmitting}
        accessibilityHint="Continue to the next screen"
      >
        Continue
      </Button>

      {!!screen.params?.showSignUpLink && (
        <>
          <Spacer y={1} />

          <Text variant="xs" color="mono60" textAlign="center">
            Don't have an account?{" "}
            <LinkText
              variant="xs"
              onPress={() => {
                navigation.navigate({
                  name: "SignUpPasswordStep",
                  params: { email: screen.params?.email, showLoginLink: true },
                })
                resetForm()
              }}
              accessibilityHint="Go to the sign-up screen"
            >
              Sign up.
            </LinkText>
          </Text>
        </>
      )}
    </Flex>
  )
}

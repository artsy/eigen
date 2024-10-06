import {
  BackButton,
  Button,
  Flex,
  Input,
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

interface LoginPasswordStepFormValues {
  password: string
}

export const LoginPasswordStep: React.FC = () => {
  const screen = useAuthScreen()
  const navigation = useAuthNavigation()

  return (
    <Formik<LoginPasswordStepFormValues>
      initialValues={{ password: "" }}
      validateOnChange={false}
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

        if (res === "auth_blocked") {
          showBlockedAuthError("sign in")
          return
        }

        if (res !== "success" && res !== "otp_missing" && res !== "on_demand_otp_missing") {
          setErrors({ password: "Incorrect email or password" }) // pragma: allowlist secret
        }

        if (res === "success") {
          resetForm()
        }
      }}
    >
      <LoginPasswordStepForm />
    </Formik>
  )
}

const LoginPasswordStepForm: React.FC = () => {
  const {
    dirty,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    isValid,
    resetForm,
    setErrors,
    touched,
    validateForm,
    values,
  } = useFormikContext<LoginPasswordStepFormValues>()

  const navigation = useAuthNavigation()
  const passwordRef = useRef<Input>(null)
  const { color } = useTheme()

  useInputAutofocus({
    screenName: "LoginPasswordStep",
    inputRef: passwordRef,
  })

  const handleBackButtonPress = () => {
    navigation.goBack()
    resetForm()
  }

  return (
    <Flex padding={2}>
      <BackButton onPress={handleBackButtonPress} />

      <Spacer y={1} />

      <Text variant="sm-display">Welcome back to Artsy</Text>

      <Input
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        error={values.password.length > 0 || touched.password ? errors.password : undefined}
        placeholderTextColor={color("black30")}
        ref={passwordRef}
        returnKeyType="done"
        secureTextEntry
        testID="password"
        title="Password"
        value={values.password}
        onChangeText={(text) => {
          // Hide error when the user starts to type again
          if (errors.password) {
            setErrors({
              password: undefined,
            })
            validateForm()
          }
          handleChange("password")(text)
        }}
        onSubmitEditing={() => {
          if (dirty && !!values.password) {
            handleSubmit()
          }
        }}
        onBlur={() => validateForm()}
        // We need to to set textContentType to password here
        // enable autofill of login details from the device keychain.
        textContentType="password"
      />

      <Spacer y={2} />

      <Button block width="100%" onPress={handleSubmit} disabled={!isValid} loading={isSubmitting}>
        Continue
      </Button>

      <Spacer y={2} />

      <Touchable
        onPress={() => {
          navigation.navigate({ name: "ForgotPasswordStep" })
          resetForm()
        }}
      >
        <Text variant="xs" color="black60" underline>
          Forgot password?
        </Text>
      </Touchable>
    </Flex>
  )
}

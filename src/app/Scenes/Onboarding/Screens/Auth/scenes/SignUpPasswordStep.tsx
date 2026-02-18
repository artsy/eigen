import {
  BackButton,
  Button,
  Flex,
  Input,
  LinkText,
  Spacer,
  Text,
  useTheme,
} from "@artsy/palette-mobile"
import {
  useAuthNavigation,
  useAuthScreen,
} from "app/Scenes/Onboarding/Screens/Auth/hooks/useAuthNavigation"
import { useInputAutofocus } from "app/Scenes/Onboarding/Screens/Auth/hooks/useInputAutofocus"
import { waitForSubmit } from "app/Scenes/Onboarding/Screens/Auth/utils/waitForSubmit"
import { Formik, useFormikContext } from "formik"
import React, { useRef } from "react"
import * as Yup from "yup"

export interface SignUpPasswordStepFormValues {
  password: string
}

export const SignUpPasswordStep: React.FC = () => {
  const navigation = useAuthNavigation()
  const screen = useAuthScreen()

  return (
    <Formik<SignUpPasswordStepFormValues>
      initialValues={{ password: "" }}
      validationSchema={Yup.object().shape({
        password: Yup.string()
          .min(8, "Your password should be at least 8 characters")
          .matches(/[A-Z]/, "Your password should contain at least one uppercase letter")
          .matches(/[a-z]/, "Your password should contain at least one lowercase letter")
          .matches(/[0-9]/, "Your password should contain at least one digit")
          .required("Password field is required"),
      })}
      onSubmit={async ({ password }, { resetForm }) => {
        await waitForSubmit(500)

        navigation.navigate({
          name: "SignUpNameStep",
          params: {
            email: screen.params?.email,
            password,
          },
        })

        resetForm()
      }}
    >
      <SignUpPasswordStepForm />
    </Formik>
  )
}

const SignUpPasswordStepForm: React.FC = () => {
  const { handleChange, handleSubmit, isSubmitting, isValid, resetForm, values } =
    useFormikContext<SignUpPasswordStepFormValues>()

  const navigation = useAuthNavigation()
  const screen = useAuthScreen()
  const passwordRef = useRef<Input>(null)

  const { color } = useTheme()

  useInputAutofocus({
    screenName: "SignUpPasswordStep",
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

      <Text variant="sm-display">Welcome to Artsy</Text>

      <Input
        accessibilityHint="Enter your password"
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        blurOnSubmit={false}
        placeholderTextColor={color("mono30")}
        ref={passwordRef}
        returnKeyType="done"
        secureTextEntry
        textContentType="password"
        testID="password"
        title="Password"
        value={values.password}
        onChangeText={(text) => {
          handleChange("password")(text)
        }}
        onSubmitEditing={() => handleSubmit()}
      />

      <Spacer y={1} />

      <Text variant="xs" color="mono60">
        Password must be at least 8 characters and include a lowercase letter, uppercase letter, and
        digit.
      </Text>

      <Spacer y={2} />

      <Button
        block
        width="100%"
        onPress={() => handleSubmit()}
        loading={isSubmitting}
        disabled={!isValid || !values.password}
        accessibilityHint="Continue to the next screen"
      >
        Continue
      </Button>

      {!!screen.params?.showLoginLink && (
        <>
          <Spacer y={1} />

          <Text variant="xs" color="mono60" textAlign="center">
            Already have an account?{" "}
            <LinkText
              variant="xs"
              onPress={() => {
                navigation.navigate({
                  name: "LoginPasswordStep",
                  params: { email: screen.params?.email, showSignUpLink: true },
                })
                resetForm()
              }}
              accessibilityHint="Go to the login screen"
            >
              Login.
            </LinkText>
          </Text>
        </>
      )}
    </Flex>
  )
}

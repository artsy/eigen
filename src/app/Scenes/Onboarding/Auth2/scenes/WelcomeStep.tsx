import {
  BackButton,
  Button,
  Flex,
  LinkText,
  Text,
  Touchable,
  useTheme,
} from "@artsy/palette-mobile"
import { BottomSheetScrollView, useBottomSheet } from "@gorhom/bottom-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { useRecaptcha } from "app/Components/Recaptcha/Recaptcha"
import { AuthNavigationStack } from "app/Scenes/Onboarding/Auth2/AuthScenes"
import { useAuthNavigation } from "app/Scenes/Onboarding/Auth2/hooks/useAuthNavigation"
import { AuthPromiseRejectType, AuthPromiseResolveType } from "app/store/AuthModel"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { osMajorVersion } from "app/utils/platformUtil"
import { Formik } from "formik"
import { MotiView } from "moti"
import React, { useRef, useState } from "react"
import { Alert, Image, InteractionManager, Platform, TextInput } from "react-native"
import { Easing } from "react-native-reanimated"
import * as Yup from "yup"

type WelcomeStepProps = StackScreenProps<AuthNavigationStack, "WelcomeStep">

interface EmailFormValues {
  email: string
  recaptchaToken: string | undefined
}

export const WelcomeStep: React.FC<WelcomeStepProps> = React.memo(() => {
  const navigation = useAuthNavigation()
  const bottomSheet = useBottomSheet()
  const [showEmailForm, setShowEmailInput] = useState(false)
  const { color, space } = useTheme()
  const emailRef = useRef<TextInput>(null)

  const { Recaptcha, token } = useRecaptcha({
    source: "authentication",
    action: "verify_email",
  })

  const handleEmailInputFocus = () => {
    requestAnimationFrame(() => {
      emailRef.current?.focus()
      bottomSheet.snapToIndex(1)
      setShowEmailInput(true)
    })
  }

  const handleBackButtonPress = () => {
    requestAnimationFrame(() => {
      bottomSheet.snapToIndex(0)
      setShowEmailInput(false)
    })
  }

  return (
    <>
      <BottomSheetScrollView>
        <MotiView
          from={{
            height: showEmailForm ? 0 : "90%",
            opacity: showEmailForm ? 0 : 1,
          }}
          animate={{
            height: showEmailForm ? "70%" : 0,
            opacity: showEmailForm ? 1 : 0,
            marginBottom: showEmailForm ? 0 : 40,
          }}
          transition={{ type: "timing", duration: 300, easing: Easing.out(Easing.circle) }}
        >
          <Formik<EmailFormValues>
            initialValues={{ email: "", recaptchaToken: token }}
            validateOnMount={false}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("Please provide a valid email address")
                .required("Email field is required"),
            })}
            onSubmit={async ({ email, recaptchaToken }, { setFieldValue }) => {
              if (!recaptchaToken) {
                Alert.alert("Something went wrong. Please try again, or contact support@artsy.net")
                return
              }

              const res = await GlobalStore.actions.auth.verifyUser({ email, recaptchaToken })

              setFieldValue("recaptchaToken", null)

              if (res === "user_exists") {
                navigation.navigate("LoginPasswordStep", { email })
              } else if (res === "user_does_not_exist") {
                navigation.navigate("SignUpPasswordStep", { email })
              } else if (res === "something_went_wrong") {
                Alert.alert("Something went wrong. Please try again, or contact support@artsy.net")
              }
            }}
          >
            {({ errors, handleChange, handleSubmit, isValid }) => {
              return (
                <Flex padding={2} gap={space(1)}>
                  <BackButton onPress={handleBackButtonPress} />

                  <Text variant="sm-display">Sign up or log in</Text>
                  <Recaptcha />

                  <BottomSheetInput
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    onChangeText={(text) => {
                      handleChange("email")(text.trim())
                    }}
                    blurOnSubmit={false} // This is needed to avoid UI jump when the user submits
                    placeholderTextColor={color("black30")}
                    title="Email"
                    returnKeyType="next"
                    spellCheck={false}
                    autoCorrect={false}
                    ref={emailRef}
                    onBlur={handleBackButtonPress}
                    // We need to to set textContentType to username (instead of emailAddress) here
                    // enable autofill of login details from the device keychain.
                    textContentType="username"
                    error={errors.email}
                  />

                  <Button block width={100} onPress={handleSubmit} disabled={!isValid}>
                    Continue
                  </Button>
                </Flex>
              )
            }}
          </Formik>
        </MotiView>

        <MotiView
          from={{ opacity: showEmailForm ? 1 : 0 }}
          animate={{ opacity: showEmailForm ? 0 : 1 }}
          transition={{ duration: showEmailForm ? 0 : 500, delay: showEmailForm ? 0 : 100 }}
        >
          <Flex px={2} gap={space(1)}>
            <Text variant="sm-display">Sign up or log in</Text>

            <Touchable onPress={handleEmailInputFocus}>
              <BottomSheetInput
                onTouchStart={handleEmailInputFocus}
                placeholder="Enter your email address"
                title="Email"
                style={{ pointerEvents: "none" }}
              />
            </Touchable>

            <SocialLoginButtons />

            <Text variant="xxs" color="black60" textAlign="center">
              By tapping Continue with Apple, Facebook, or Google, you agree to Artsy’s{" "}
              <LinkText variant="xxs" onPress={() => navigate("/terms")}>
                Terms of Use
              </LinkText>{" "}
              and{" "}
              <LinkText variant="xxs" onPress={() => navigate("/privacy")}>
                Privacy Policy
              </LinkText>
            </Text>
          </Flex>
        </MotiView>
      </BottomSheetScrollView>
    </>
  )
})

const SocialLoginButtons: React.FC = () => {
  const [mode, _setMode] = useState<"login" | "signup">("login")

  const handleApplePress = () =>
    onSocialLogin(() => {
      return GlobalStore.actions.auth.authApple({ agreedToReceiveEmails: true })
    })

  const handleGooglePress = () =>
    onSocialLogin(() => {
      return GlobalStore.actions.auth.authGoogle({
        signInOrUp: mode === "login" ? "signIn" : "signUp",
        agreedToReceiveEmails: mode === "signup",
      })
    })

  const handleFacebookPress = () =>
    onSocialLogin(() => {
      return GlobalStore.actions.auth.authFacebook({
        signInOrUp: mode === "login" ? "signIn" : "signUp",
        agreedToReceiveEmails: mode === "signup",
      })
    })

  return (
    <Flex gap={1}>
      <Text variant="xs" textAlign="center">
        Or continue with
      </Text>

      <Flex flexDirection="row" justifyContent="space-evenly">
        {Platform.OS === "ios" && osMajorVersion() >= 13 && (
          <Button variant="fillDark" width="100%" onPress={handleApplePress}>
            <Image source={require("images/apple.webp")} />
          </Button>
        )}

        <Button variant="outline" width="100%" onPress={handleGooglePress}>
          <Image source={require("images/google.webp")} />
        </Button>

        <Button variant="outline" width="100%" onPress={handleFacebookPress}>
          <Image source={require("images/facebook.webp")} />
        </Button>
      </Flex>
    </Flex>
  )
}

const onSocialLogin = async (callback: () => Promise<AuthPromiseResolveType>) => {
  GlobalStore.actions.auth.setSessionState({ isLoading: true })
  InteractionManager.runAfterInteractions(() => {
    callback().catch((error: AuthPromiseRejectType) => {
      InteractionManager.runAfterInteractions(() => {
        GlobalStore.actions.auth.setSessionState({ isLoading: false })
        InteractionManager.runAfterInteractions(() => {
          // TODO: handle error like OnboardingSocialPick does
          console.error(error)
        })
      })
    })
  })
}

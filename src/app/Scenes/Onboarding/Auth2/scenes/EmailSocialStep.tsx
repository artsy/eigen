import {
  BackButton,
  Box,
  Button,
  Flex,
  Input,
  LinkText,
  Spacer,
  Text,
  useTheme,
} from "@artsy/palette-mobile"
import { useRecaptcha } from "app/Components/Recaptcha/Recaptcha"
import { AuthContext } from "app/Scenes/Onboarding/Auth2/AuthContext"
import { useAuthNavigation } from "app/Scenes/Onboarding/Auth2/hooks/useAuthNavigation"
import { AuthPromiseRejectType, AuthPromiseResolveType } from "app/store/AuthModel"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { osMajorVersion } from "app/utils/platformUtil"
import { Formik } from "formik"
import React, { useRef, useState } from "react"
import { Alert, Image, InteractionManager, Platform, TextInput } from "react-native"
import * as Yup from "yup"

interface EmailFormValues {
  email: string
  recaptchaToken: string | undefined
}

export const EmailSocialStep: React.FC = () => {
  const navigation = useAuthNavigation()
  const setModalExpanded = AuthContext.useStoreActions((actions) => actions.setModalExpanded)
  const isModalExpanded = AuthContext.useStoreState((state) => state.isModalExpanded)

  const { color } = useTheme()
  const emailRef = useRef<TextInput>(null)
  const isSelectLoginMethodStep = !isModalExpanded

  const { Recaptcha, token } = useRecaptcha({
    source: "authentication",
    action: "verify_email",
  })

  return (
    <>
      <Formik<EmailFormValues>
        initialValues={{ email: "", recaptchaToken: token }}
        validateOnMount={false}
        _validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Please provide a valid email address")
            .required("Email field is required"),
        })}
        onSubmit={async ({ email, recaptchaToken }, { setFieldValue }) => {
          navigation.navigate("LoginPasswordStep", { email })

          return

          // Fixme
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
        {({ errors, handleChange, handleSubmit, isValid, resetForm }) => {
          const handleEmailInputFocus = () => {
            InteractionManager.runAfterInteractions(() => {
              setModalExpanded(true)
              emailRef.current?.focus()
            })
          }

          const handleBackButtonPress = () => {
            InteractionManager.runAfterInteractions(() => {
              setModalExpanded(false)
              emailRef.current?.blur()
              resetForm()
            })
          }

          return (
            <Flex padding={2} position="relative">
              {!isSelectLoginMethodStep && (
                <>
                  <BackButton onPress={handleBackButtonPress} />
                  <Spacer y={1} />
                </>
              )}
              <Flex height={isSelectLoginMethodStep ? "100%" : "85%"} justifyContent="center">
                <Box>
                  <Text variant="sm">Sign up or log in</Text>

                  {!isSelectLoginMethodStep && <Recaptcha />}

                  <Input
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
                    onFocus={handleEmailInputFocus}
                    // onBlur={handleBackButtonPress}
                    // We need to to set textContentType to username (instead of emailAddress) here
                    // enable autofill of login details from the device keychain.
                    textContentType="username"
                    error={errors.email}
                  />

                  <Flex display={isSelectLoginMethodStep ? "flex" : "none"}>
                    <Spacer y={2} />

                    <SocialLoginButtons />

                    <Spacer y={1} />

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

                  <Flex display={isSelectLoginMethodStep ? "none" : "flex"}>
                    <Button block width={100} onPress={handleSubmit} disabled={!isValid} mt={2}>
                      Continue
                    </Button>
                  </Flex>
                </Box>
              </Flex>
            </Flex>
          )
        }}
      </Formik>
    </>
  )
}

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
    <Flex>
      <Text variant="xs" textAlign="center">
        Or continue with
      </Text>

      <Spacer y={1} />

      <Flex flexDirection="row" justifyContent="space-evenly" width="100%">
        {Platform.OS === "ios" && osMajorVersion() >= 13 && (
          <Button variant="fillDark" width="100%" onPress={handleApplePress}>
            <Flex height="100%" justifyContent="center" alignItems="center">
              <Image source={require("images/apple.webp")} />
            </Flex>
          </Button>
        )}

        <Button variant="outline" onPress={handleGooglePress}>
          <Flex justifyContent="center" alignItems="center">
            <Image
              source={require("images/google.webp")}
              style={{ position: "relative", top: 2 }}
            />
          </Flex>
        </Button>

        <Button variant="outline" width="100%" onPress={handleFacebookPress}>
          <Flex justifyContent="center" alignItems="center">
            <Image
              source={require("images/facebook.webp")}
              style={{ position: "relative", top: 2 }}
            />
          </Flex>
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

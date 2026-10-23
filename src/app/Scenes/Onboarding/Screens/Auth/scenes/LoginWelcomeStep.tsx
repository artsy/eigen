import { AppleIcon, FacebookIcon, GoogleIcon } from "@artsy/icons/native"
import {
  BackButton,
  Button,
  DEFAULT_ICON_SIZE,
  Flex,
  Input,
  LinkText,
  Spacer,
  Text,
  Touchable,
  useTheme,
} from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import LoadingModal from "app/Components/Modals/LoadingModal"
import { useRecaptcha } from "app/Components/Recaptcha/Recaptcha"
import { useToast } from "app/Components/Toast/toastHook"
import { AuthContext } from "app/Scenes/Onboarding/Screens/Auth/AuthContext"
import { useAuthNavigation } from "app/Scenes/Onboarding/Screens/Auth/hooks/useAuthNavigation"
import { useInputAutofocus } from "app/Scenes/Onboarding/Screens/Auth/hooks/useInputAutofocus"
import { OnboardingNavigationStack } from "app/Scenes/Onboarding/Screens/Onboarding"
import { GlobalStore } from "app/store/GlobalStore"
import { useSocialLogin } from "app/utils/auth/socialSignInHelpers"
import { osMajorVersion } from "app/utils/platformUtil"
import { Formik, useFormikContext } from "formik"
import { MotiView } from "moti"
import React, { useEffect, useRef, useState } from "react"
import { PixelRatio, Platform } from "react-native"
import { Easing } from "react-native-reanimated"
import * as Yup from "yup"

interface LoginEmailFormValues {
  email: string
}

export const LoginWelcomeStep: React.FC = () => {
  const currentScreen = AuthContext.useStoreState((state) => state.currentScreen)
  const isCurrentScreen = currentScreen?.name === "LoginWelcomeStep"

  const navigation = useAuthNavigation()
  const toast = useToast()

  const { Recaptcha, token, state, isTokenValid, refreshToken } = useRecaptcha({
    source: "authentication",
    action: "verify_email",
  })

  const [pendingSubmission, setPendingSubmission] = useState<{
    email: string
    resetForm: () => void
  } | null>(null)

  // Retry submission when new token arrives
  useEffect(() => {
    if (pendingSubmission && token && isTokenValid()) {
      const { email, resetForm } = pendingSubmission
      setPendingSubmission(null)

      // Execute the submission
      ;(async () => {
        const res = await GlobalStore.actions.auth.verifyUser({ email, recaptchaToken: token })

        if (res === "user_exists") {
          navigation.navigate({ name: "LoginPasswordStep", params: { email } })
        } else if (res === "user_does_not_exist") {
          navigation.navigate({ name: "SignUpPasswordStep", params: { email } })
        } else if (res === "something_went_wrong") {
          navigation.navigate({
            name: "LoginPasswordStep",
            params: { email, showSignUpLink: true },
          })
        }

        resetForm()
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingSubmission, token, navigation])

  return (
    <>
      <Recaptcha active={isCurrentScreen} />

      <Formik<LoginEmailFormValues>
        initialValues={{ email: "" }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Please provide a valid email address")
            .required("Email field is required"),
        })}
        onSubmit={async ({ email }, { resetForm }) => {
          // Check if token is missing or expired
          if (!token || !isTokenValid()) {
            refreshToken()

            if (state === "error") {
              toast.show(
                "Something went wrong. Please try again, or contact support@artsy.net",
                "bottom",
                {
                  backgroundColor: "red100",
                }
              )
              return
            }
            setPendingSubmission({ email, resetForm: () => resetForm({ values: { email } }) })
            return
          }
          const res = await GlobalStore.actions.auth.verifyUser({ email, recaptchaToken: token })

          if (res === "user_exists") {
            navigation.navigate({ name: "LoginPasswordStep", params: { email } })
          } else if (res === "user_does_not_exist") {
            navigation.navigate({ name: "SignUpPasswordStep", params: { email } })
          } else if (res === "something_went_wrong") {
            navigation.navigate({
              name: "LoginPasswordStep",
              params: { email, showSignUpLink: true },
            })
          }

          resetForm({ values: { email } })
        }}
      >
        <LoginWelcomeStepForm />
      </Formik>
    </>
  )
}

const LoginWelcomeStepForm: React.FC = () => {
  const setModalExpanded = AuthContext.useStoreActions((actions) => actions.setModalExpanded)
  const isModalExpanded = AuthContext.useStoreState((state) => state.isModalExpanded)
  const isLoading = GlobalStore.useAppState((state) => state.auth.sessionState.isLoading)

  const { color } = useTheme()
  const {
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    isValid,
    resetForm,
    values,
    errors,
    touched,
  } = useFormikContext<LoginEmailFormValues>()

  const navigation = useNavigation<NavigationProp<OnboardingNavigationStack>>()
  const emailRef = useRef<Input>(null)

  useInputAutofocus({
    screenName: "LoginWelcomeStep",
    inputRef: emailRef,
    enabled: isModalExpanded,
  })

  const handleBackButtonPress = () => {
    requestAnimationFrame(() => {
      emailRef.current?.blur()
      setModalExpanded(false)
      resetForm({ values: { email: "" } })
    })
  }

  const handleEmailFocus = () => {
    setModalExpanded(true)
  }

  return (
    <Flex p={2}>
      <LoadingModal isVisible={isLoading} dark />

      {!!isModalExpanded && (
        <>
          <BackButton onPress={handleBackButtonPress} />
          <Spacer y={1} />
        </>
      )}

      <Text variant="sm-display">Sign up or log in</Text>

      <Input
        accessibilityHint="Enter your email address"
        accessibilityLabel="Email Input"
        autoCapitalize="none"
        autoComplete="username"
        importantForAutofill="yes"
        autoCorrect={false}
        blurOnSubmit={false}
        error={touched.email && errors.email ? errors.email : undefined}
        placeholderTextColor={color("mono30")}
        ref={emailRef}
        spellCheck={false}
        keyboardType="email-address"
        returnKeyType="next"
        title="Email"
        defaultValue={values.email}
        onBlur={handleBlur("email")}
        onKeyPress={(e) => {
          // Avoid spaces from being submitted
          if (e.nativeEvent.key === "Space") {
            e.preventDefault()
          }
        }}
        onChangeText={(text) => {
          handleChange("email")(text.trim())
        }}
        onFocus={handleEmailFocus}
        onSubmitEditing={() => handleSubmit()}
      />

      {!!isModalExpanded && (
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: isModalExpanded ? 1 : 0 }}
          transition={{ type: "timing", duration: 400, easing: Easing.linear }}
        >
          <Spacer y={2} />

          <Button
            block
            width="100%"
            onPress={() => handleSubmit()}
            loading={isSubmitting}
            disabled={!isValid || !values.email}
            accessibilityHint="Continue to the next screen"
          >
            Continue
          </Button>
        </MotiView>
      )}

      {!isModalExpanded && (
        <MotiView
          from={{ opacity: 1 }}
          animate={{ opacity: isModalExpanded ? 0 : 1 }}
          transition={{ type: "timing", duration: 400, easing: Easing.linear }}
          testID="social-signin-and-disclaimers"
        >
          <Spacer y={2} />

          <SocialLoginButtons />

          <Spacer y={1} />

          <Text variant="xxs" color="mono60" textAlign="center">
            By tapping Continue with Apple, Facebook, or Google, you agree to Artsy’s{" "}
            <LinkText
              variant="xxs"
              onPress={() => navigation.navigate("OnboardingWebView", { url: "/terms" })}
              accessibilityHint="View the Terms and Conditions"
            >
              Terms and Conditions
            </LinkText>{" "}
            and{" "}
            <LinkText
              variant="xxs"
              onPress={() => navigation.navigate("OnboardingWebView", { url: "/privacy" })}
              accessibilityHint="View the Privacy Policy"
            >
              Privacy Policy
            </LinkText>
            .
          </Text>
        </MotiView>
      )}
    </Flex>
  )
}

const SocialLoginButtons: React.FC = () => {
  const { handleSocialLogin } = useSocialLogin()

  const handleApplePress = () =>
    handleSocialLogin(() => {
      return GlobalStore.actions.auth.authApple({ agreedToReceiveEmails: true })
    })

  const handleGooglePress = () =>
    handleSocialLogin(() => {
      return GlobalStore.actions.auth.authGoogle2()
    })

  const handleFacebookPress = () =>
    handleSocialLogin(() => {
      return GlobalStore.actions.auth.authFacebook2()
    })

  return (
    <Flex>
      <Text variant="xs" textAlign="center">
        Or continue with
      </Text>

      <Spacer y={1} />

      <Flex flexDirection="row" gap={1} justifyContent="center" width="100%">
        {Platform.OS === "ios" && osMajorVersion() >= 13 && (
          <SocialLoginButton
            onPress={handleApplePress}
            accessibilityHint="Sign in with Apple"
            accessibilityLabel="Apple"
            icon={<AppleIcon width={DEFAULT_ICON_SIZE} height={DEFAULT_ICON_SIZE} />}
          />
        )}
        <SocialLoginButton
          onPress={handleGooglePress}
          accessibilityHint="Sign in with Google"
          accessibilityLabel="Google"
          icon={<GoogleIcon width={DEFAULT_ICON_SIZE} height={DEFAULT_ICON_SIZE} />}
        />
        <SocialLoginButton
          onPress={handleFacebookPress}
          accessibilityHint="Sign in with Facebook"
          accessibilityLabel="Facebook"
          icon={<FacebookIcon width={DEFAULT_ICON_SIZE} height={DEFAULT_ICON_SIZE} />}
        />
      </Flex>
    </Flex>
  )
}

interface SocialLoginButtonProps {
  accessibilityHint: string
  accessibilityLabel: string
  icon: React.ReactElement
  onPress: () => void
}

// Palette's Button renders its children inside a Text, which clips icons taller than the line
// height, and its `icon` prop adds a spacer that pushes icon-only content off-center.
const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  accessibilityHint,
  accessibilityLabel,
  icon,
  onPress,
}) => {
  return (
    <Touchable
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
    >
      <Flex
        height={50 * PixelRatio.getFontScale()}
        px="30px"
        borderRadius={50}
        borderWidth={1}
        borderColor="mono60"
        alignItems="center"
        justifyContent="center"
      >
        {icon}
      </Flex>
    </Touchable>
  )
}

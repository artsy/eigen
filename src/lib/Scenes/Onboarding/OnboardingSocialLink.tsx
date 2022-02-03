import { useNavigation, useRoute } from "@react-navigation/native"
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"
import { FormikProvider, useFormik } from "formik"
import { BackButton } from "lib/navigation/BackButton"
import { GlobalStore } from "lib/store/GlobalStore"
import { useAppleLink } from "lib/utils/LinkedAccounts/apple"
import { useFacebookLink } from "lib/utils/LinkedAccounts/facebook"
import { useGoogleLink } from "lib/utils/LinkedAccounts/google"
import { Button, Flex, Input, Spacer, Spinner, Text, Touchable } from "palette"
import React, { useEffect, useState } from "react"
import { Alert, Image } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRelayEnvironment } from "react-relay"
import * as Yup from "yup"
import { OnboardingNavigationStack } from "./Onboarding"

const NAVBAR_HEIGHT = 44

interface OnboardingSocialLinkFormSchema {
  password: string
}

export type GoogleOrFacebookToken = string
export interface AppleToken {
  idToken: string
  appleUid: string
}

export const titleize = (str: string) =>
  str
    .trim()
    .split("")
    .map((s, i) => (i === 0 ? s.toUpperCase() : s))
    .join("")

export const OnboardingSocialLink: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<OnboardingNavigationStack>>()
  const insets = useSafeAreaInsets()
  const { email, name, providers, providerToBeLinked, tokenForProviderToBeLinked } =
    useRoute<StackScreenProps<OnboardingNavigationStack, "OnboardingSocialLink">["route"]>().params

  const [showPasswordForm, setShowPasswordForm] = useState(
    providers.length === 1 && providers[0] === "email"
  )
  const environment = useRelayEnvironment()

  const { linkUsingOauthToken: linkFB, isLoading: fbLoading } = useFacebookLink(environment)
  const { linkUsingOauthToken: linkGoogle, isLoading: googleLoading } = useGoogleLink(environment)
  const { linkUsingOauthToken: linkApple, isLoading: appleLoading } = useAppleLink(environment)

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        if (providers.length === 1 && providers[0] === "email") {
          return
        }
        e.preventDefault()
        if (providers.length > 1 && showPasswordForm) {
          setShowPasswordForm(false)
          return
        }
        navigation.dispatch(e.data.action)
      }),
    [navigation, showPasswordForm, providers]
  )

  const onSignIn = (provider: string, token: GoogleOrFacebookToken | AppleToken) => {
    if ((provider === "facebook" || provider === "google") && typeof token !== "string") {
      console.warn(`Incompatible Type of Token provided for ${provider}`)
      return
    }

    if (provider === "facebook") {
      linkFB(token as GoogleOrFacebookToken)
    }
    if (provider === "google") {
      linkGoogle(token as GoogleOrFacebookToken)
    }
    if (provider === "apple") {
      linkApple(email, name ?? "", token as AppleToken)
    }
  }

  const linkWithSocialAccount = async (provider: string) => {
    const { authFacebook, authApple, authGoogle } = GlobalStore.actions.auth
    const FBOrGoogProvider: { [key: string]: typeof authFacebook } = {
      facebook: authFacebook,
      google: authGoogle,
    }
    if (provider === "email") {
      console.warn("You should not be passing email here. Use the formik form")
      return
    }
    if (!FBOrGoogProvider[provider] && provider !== "apple") {
      console.warn(`Unrecognised provider: ${provider}`)
      return
    }
    if (provider === "apple") {
      authApple({
        onSignIn: () => onSignIn(providerToBeLinked, tokenForProviderToBeLinked),
      })
    } else {
      FBOrGoogProvider[provider]({
        signInOrUp: "signIn",
        onSignIn: () => onSignIn(providerToBeLinked, tokenForProviderToBeLinked),
      })
    }
  }

  const formik = useFormik<OnboardingSocialLinkFormSchema>({
    initialValues: { password: "" },
    initialErrors: {},
    validationSchema: Yup.object().shape({
      password: Yup.string().test(
        "password",
        "Password field is required",
        (value) => value !== ""
      ),
    }),
    onSubmit: async ({ password }, { setErrors: setFormikErrors, validateForm }) => {
      await validateForm()
      const res = await GlobalStore.actions.auth.signIn({
        oauthProvider: "email",
        email,
        password,
        onSignIn: () => onSignIn(providerToBeLinked, tokenForProviderToBeLinked),
      })
      // Note: Users with 2FA enabled accounts cannot link accounts.
      if (res === "on_demand_otp_missing" || res === "otp_missing") {
        Alert.alert("Error", "2FA-enabled accounts cannot be linked to another account")
        return
      }
      if (res !== "success") {
        // For security purposes, we are returning a generic error message
        setFormikErrors({ password: "Incorrect password" }) // pragma: allowlist secret
      }
    },
  })
  const { values, setErrors, isValid, dirty, handleSubmit, errors, handleChange, isSubmitting } =
    formik

  const isLoading = appleLoading || fbLoading || googleLoading || isSubmitting

  if (showPasswordForm) {
    return (
      <FormikProvider value={formik}>
        <Flex flex={1} backgroundColor="white100">
          <BackButton onPress={() => navigation.goBack()} />
          <Flex flex={1} px={2} mt={insets.top + NAVBAR_HEIGHT + 10} mb={insets.bottom}>
            <Text variant="lg">Link Accounts</Text>
            <Spacer mt={0.5} />
            <Text variant="xs">{`You already have an account ${email}`}.</Text>
            <Text variant="xs">
              Please enter your artsy.net password to link your account. You will need to do this
              once.
            </Text>
            <Spacer mt={2} />

            <Input
              title="Artsy Password"
              secureTextEntry
              autoFocus
              autoCapitalize="none"
              autoCompleteType="password"
              autoCorrect={false}
              onChangeText={(text) => {
                setErrors({ password: undefined })
                handleChange("password")(text)
              }}
              onSubmitEditing={handleSubmit}
              blurOnSubmit={false}
              clearButtonMode="while-editing"
              placeholder="Password"
              returnKeyType="go"
              textContentType="password"
              value={values.password}
              error={errors.password}
              testID="artsyPasswordInput"
            />
            <Spacer mt={2} />
            <Touchable onPress={() => navigation.replace("ForgotPassword")}>
              <Text variant="sm" color="black60" style={{ textDecorationLine: "underline" }}>
                Forgot password?
              </Text>
            </Touchable>
            <Spacer mt={4} />

            <Button block disabled={!(isValid && dirty) || isLoading} onPress={handleSubmit}>
              Link Accounts
            </Button>
            <Spacer mt="2" />
            <Button
              block
              variant="outline"
              disabled={isLoading}
              onPress={() => {
                navigation.goBack()
              }}
            >
              Continue with a Separate Account
            </Button>
          </Flex>

          <LoadingOverlay loading={isLoading} />
        </Flex>
      </FormikProvider>
    )
  }
  return (
    <Flex justifyContent="center" flex={1} backgroundColor="white">
      <BackButton onPress={() => navigation.goBack()} />
      <Flex flex={1} px={2} mt={insets.top + NAVBAR_HEIGHT + 10} mb={insets.bottom}>
        <Text variant="lg">Link Accounts</Text>
        <Spacer mt={0.5} />
        <Text variant="xs">{`You already have an account ${email}`}.</Text>
        <Text variant="xs">
          {`Please log in with any of your existing authentication options below to automatically add ${titleize(
            providerToBeLinked
          )} as one of your authentication methods.`}
        </Text>
        <Spacer mt={2} />
        {providers.map((provider) => (
          <LinAccountButton
            key={provider}
            onPress={
              provider === "email"
                ? () => setShowPasswordForm(true)
                : () => linkWithSocialAccount(provider)
            }
            provider={provider}
            loading={isLoading}
          />
        ))}
        <Button
          block
          variant="outline"
          disabled={isLoading}
          onPress={() => {
            navigation.goBack()
          }}
        >
          Continue with a Separate Account
        </Button>
      </Flex>
      <LoadingOverlay loading={isLoading} />
    </Flex>
  )
}

const LinAccountButton: React.FC<{ onPress: () => void; provider: string; loading: boolean }> = ({
  onPress,
  provider,
  loading,
}) => {
  const titleizedProvider = titleize(provider)
  const imageSources: { [key: string]: NodeRequire } = {
    facebook: require(`@images/facebook.webp`),
    google: require(`@images/google.webp`),
    email: require(`@images/email.webp`),
    apple: require(`@images/apple.webp`),
  }
  return (
    <Button
      onPress={onPress}
      block
      haptic="impactMedium"
      mb={1}
      disabled={loading}
      variant={provider === "apple" ? "fillDark" : "outline"}
      iconPosition="left-start"
      icon={
        <Image source={imageSources[provider]} resizeMode="contain" style={{ marginRight: 10 }} />
      }
      testID={`linkWith${titleizedProvider}`}
    >
      {`Continue with ${titleizedProvider}`}
    </Button>
  )
}

const LoadingOverlay: React.FC<{ loading: boolean }> = ({ loading }) => {
  if (!loading) {
    return null
  }
  return (
    <Flex
      position="absolute"
      top={0}
      bottom={0}
      left={0}
      right={0}
      backgroundColor="rgba(255, 255, 255, 0.7)"
      alignItems="center"
      justifyContent="center"
      zIndex={10000}
    >
      <Spinner />
    </Flex>
  )
}

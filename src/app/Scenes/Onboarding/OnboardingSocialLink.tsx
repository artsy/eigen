import { Button, Flex, Input, Spacer, Spinner, Text, Touchable } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { OAuthProvider } from "app/store/AuthModel"
import { GlobalStore } from "app/store/GlobalStore"
import { BackButton } from "app/system/navigation/BackButton"
import { useAppleLink } from "app/utils/LinkedAccounts/apple"
import { useFacebookLink } from "app/utils/LinkedAccounts/facebook"
import { useGoogleLink } from "app/utils/LinkedAccounts/google"
import { osMajorVersion } from "app/utils/platformUtil"
import { FormikProvider, useFormik } from "formik"
import { capitalize } from "lodash"
import React, { useEffect, useState } from "react"
import { Alert, Image, ImageSourcePropType, Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
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

export const OnboardingSocialLink: React.FC<
  StackScreenProps<OnboardingNavigationStack, "OnboardingSocialLink">
> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets()
  const { email, name, providers, providerToBeLinked, tokenForProviderToBeLinked } = route.params

  const permittedProvidersTable: { [key: string]: boolean } = {
    email: true,
    google: true,
    facebook: true,
    apple: Platform.OS === "ios" && osMajorVersion() >= 13,
  }

  const permittedProviders = providers.filter((provider) => permittedProvidersTable[provider])

  const [showPasswordForm, setShowPasswordForm] = useState(
    permittedProviders.length === 1 && permittedProviders[0] === "email"
  )

  const { linkUsingOauthToken: linkFB, isLoading: fbLoading } = useFacebookLink()
  const { linkUsingOauthToken: linkGoogle, isLoading: googleLoading } = useGoogleLink()
  const { linkUsingOauthToken: linkApple, isLoading: appleLoading } = useAppleLink()

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        const { payload } = e.data.action
        const nextRouteName = payload ? (payload as { [key: string]: any }).name : ""
        if (
          (permittedProviders.length === 1 && permittedProviders[0] === "email") ||
          nextRouteName === "ForgotPassword"
        ) {
          return
        }
        e.preventDefault()
        if (permittedProviders.length > 1 && showPasswordForm) {
          setShowPasswordForm(false)
          return
        }
        navigation.dispatch(e.data.action)
      }),
    [navigation, showPasswordForm, providers, permittedProviders]
  )

  const onSignIn = (provider: OAuthProvider, token: GoogleOrFacebookToken | AppleToken) => {
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

  const linkWithSocialAccount = async (provider: OAuthProvider) => {
    const { authFacebook, authApple, authGoogle } = GlobalStore.actions.auth
    const FBOrGoogProvider: { [key: string]: typeof authFacebook } = {
      facebook: authFacebook,
      google: authGoogle,
    }
    switch (provider) {
      case "email":
        console.warn("You should not be passing email here. Use the formik form")
        return
      case "apple":
        authApple({
          onSignIn: () => onSignIn(providerToBeLinked, tokenForProviderToBeLinked),
        })
        return
      case "google":
      case "facebook":
        FBOrGoogProvider[provider]({
          signInOrUp: "signIn",
          onSignIn: () => onSignIn(providerToBeLinked, tokenForProviderToBeLinked),
        })
        return
      default:
        console.warn(`Unrecognised provider: ${provider}`)
    }
  }

  const screenText = () => {
    if (permittedProviders.length === 1 && permittedProviders[0] === "email") {
      return `You already have an Artsy account with ${email}. Enter your password to link both log-in options to your account.`
    }
    if (permittedProviders.length > 1 && !showPasswordForm) {
      return "You already have an account with that email address. Link both log-in options to your Artsy account, by logging in now with your previous log-in method."
    } else if (showPasswordForm) {
      return "Enter your password to link both log-in options to your account."
    }
    return ""
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
        oauthMode: "email",
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
        <Flex flex={1} backgroundColor="mono0">
          <BackButton onPress={() => navigation.goBack()} />
          <Flex px={2} mt={`${insets.top + NAVBAR_HEIGHT + 20}px`} mb={`${insets.bottom}px`}>
            <Text variant="lg-display">Link Accounts</Text>
            <Spacer y={2} />
            <Text variant="xs">{screenText()}</Text>

            <Spacer y={4} />

            <Input
              title="Artsy Password"
              secureTextEntry
              autoFocus
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect={false}
              onChangeText={(text) => {
                setErrors({ password: undefined })
                handleChange("password")(text)
              }}
              onSubmitEditing={handleSubmit}
              blurOnSubmit={false}
              placeholder="Password"
              returnKeyType="go"
              textContentType="password"
              value={values.password}
              error={errors.password}
              testID="artsySocialLinkPasswordInput"
            />
            <Spacer y={1} />
            <Touchable
              onPress={() => {
                if (navigation?.replace) {
                  navigation.replace("ForgotPassword")
                }
              }}
            >
              <Text variant="sm" color="mono60" style={{ textDecorationLine: "underline" }}>
                Forgot password?
              </Text>
            </Touchable>
            <Spacer y={4} />

            <Button
              block
              disabled={!(isValid && dirty) || isLoading}
              onPress={handleSubmit}
              testID="artsySocialLinkPasswordButton"
            >
              {permittedProviders.length === 1 && permittedProviders[0] === "email"
                ? "Yes, Link Accounts"
                : "Link Accounts"}
            </Button>
            <Spacer y={2} />
            <Button
              block
              variant="outline"
              disabled={isLoading}
              onPress={() => {
                navigation.goBack()
              }}
            >
              {permittedProviders.length === 1 && permittedProviders[0] === "email"
                ? "No Thanks, Take Me Back"
                : "Cancel"}
            </Button>
          </Flex>

          <LoadingOverlay loading={isLoading} />
        </Flex>
      </FormikProvider>
    )
  }
  return (
    <Flex justifyContent="center" flex={1} backgroundColor="mono0">
      <BackButton onPress={() => navigation.goBack()} />
      <Flex flex={1} px={2} mt={`${insets.top + NAVBAR_HEIGHT + 20}px`} mb={`${insets.bottom}px`}>
        <Text variant="lg-display">Link Accounts</Text>
        <Spacer y={2} />
        <Text variant="xs">{screenText()}</Text>
        <Spacer y={4} />
        {permittedProviders.map((provider) => (
          <LinkAccountButton
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
          No Thanks, Take Me Back
        </Button>
      </Flex>
      <LoadingOverlay loading={isLoading} />
    </Flex>
  )
}

interface LinkAccountButtonProps {
  onPress: () => void
  provider: OAuthProvider
  loading: boolean
}
export function LinkAccountButton({ onPress, provider, loading }: LinkAccountButtonProps) {
  const titleizedProvider = capitalize(provider)
  const imageSources: Record<OAuthProvider, ImageSourcePropType> = {
    facebook: require(`images/facebook.webp`),
    google: require(`images/google.webp`),
    email: require(`images/email.webp`),
    apple: require(`images/apple.webp`),
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

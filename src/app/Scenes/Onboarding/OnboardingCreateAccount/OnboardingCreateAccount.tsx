import { Box, Button, Flex, Spacer, Text, useColor } from "@artsy/palette-mobile"
import {
  NavigationContainer,
  NavigationContainerRef,
  NavigationIndependentTree,
} from "@react-navigation/native"
import { createStackNavigator, StackScreenProps, TransitionPresets } from "@react-navigation/stack"
import { OnboardingNavigationStack } from "app/Scenes/Onboarding/Onboarding"
import { OnboardingSocialPick } from "app/Scenes/Onboarding/OnboardingSocialPick"
import { OnboardingWebView, OnboardingWebViewRoute } from "app/Scenes/Onboarding/OnboardingWebView"
import { GlobalStore } from "app/store/GlobalStore"
import { BackButton } from "app/system/navigation/BackButton"
import { showBlockedAuthError } from "app/utils/auth/authHelpers"
import { useScreenDimensions } from "app/utils/hooks"
import { FormikProvider, useFormik, useFormikContext } from "formik"
import React, { useEffect, useRef, useState } from "react"
import { Alert, Animated, KeyboardAvoidingView, ScrollView } from "react-native"
import * as Yup from "yup"
import {
  OnboardingCreateAccountEmail,
  OnboardingCreateAccountEmailParams,
} from "./OnboardingCreateAccountEmail"
import { OnboardingCreateAccountName } from "./OnboardingCreateAccountName"
import { OnboardingCreateAccountPassword } from "./OnboardingCreateAccountPassword"

export const OnboardingCreateAccount: React.FC = () => <OnboardingSocialPick mode="signup" />

export type OnboardingCreateAccountProps = StackScreenProps<
  OnboardingNavigationStack,
  "OnboardingCreateAccountWithEmail"
>

export type OnboardingCreateAccountNavigationStack = {
  OnboardingCreateAccountEmail: OnboardingCreateAccountEmailParams
  OnboardingCreateAccountPassword: undefined
  OnboardingCreateAccountName: undefined
  OnboardingWebView: { url: OnboardingWebViewRoute }
}

const StackNavigator = createStackNavigator<OnboardingCreateAccountNavigationStack>()

export const __unsafe__createAccountNavigationRef: React.MutableRefObject<NavigationContainerRef<any> | null> =
  {
    current: null,
  }

export interface UserSchema {
  email: string
  password: string
  name: string
}

export interface FormikSchema extends UserSchema {
  acceptedTerms: boolean
  agreedToReceiveEmails: boolean
}

export const emailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please provide a valid email address")
    .required("Email field is required"),
})
export const passwordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Your password should be at least 8 characters")
    .matches(/[A-Z]/, "Your password should contain at least one uppercase letter")
    .matches(/[a-z]/, "Your password should contain at least one lowercase letter")
    .matches(/[0-9]/, "Your password should contain at least one digit")
    .required("Password field is required"),
})
export const nameSchema = Yup.object().shape({
  name: Yup.string().trim().required("Full name field is required"),
})

export const getCurrentRoute = () =>
  __unsafe__createAccountNavigationRef?.current?.getCurrentRoute()?.name as
    | keyof OnboardingCreateAccountNavigationStack
    | undefined

export const OnboardingCreateAccountWithEmail: React.FC<OnboardingCreateAccountProps> = ({
  navigation,
}) => {
  const [currentRoute, setCurrentRoute] = useState<keyof OnboardingCreateAccountNavigationStack>(
    "OnboardingCreateAccountEmail"
  )

  const formik = useFormik<FormikSchema>({
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    initialValues: {
      email: "",
      password: "",
      name: "",
      acceptedTerms: false,
      agreedToReceiveEmails: false,
    },
    initialErrors: {},
    onSubmit: async ({ email, password, name, agreedToReceiveEmails, acceptedTerms }) => {
      switch (currentRoute) {
        case "OnboardingCreateAccountEmail":
          // continue with the sign up
          __unsafe__createAccountNavigationRef.current?.navigate("OnboardingCreateAccountPassword")
          break
        case "OnboardingCreateAccountPassword":
          __unsafe__createAccountNavigationRef.current?.navigate("OnboardingCreateAccountName")
          break
        case "OnboardingCreateAccountName":
          if (acceptedTerms) {
            const res = await GlobalStore.actions.auth.signUp({
              oauthProvider: "email",
              oauthMode: "email",
              email,
              password,
              name: name.trim(),
              agreedToReceiveEmails,
            })

            if (!res.success) {
              if (res.error === "blocked_attempt") {
                showBlockedAuthError("sign up")
              } else {
                Alert.alert("Try again", res.message)
              }
            }
          }
          break

        default:
          break
      }
    },
    validationSchema: () => {
      switch (currentRoute) {
        case "OnboardingCreateAccountEmail":
          return emailSchema
        case "OnboardingCreateAccountPassword":
          return passwordSchema
        case "OnboardingCreateAccountName":
          return nameSchema
        default:
          break
      }
    },
  })

  return (
    <Flex flex={1} backgroundColor="mono0" flexGrow={1} pb={1}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <FormikProvider value={formik}>
          <NavigationIndependentTree>
            <NavigationContainer
              onStateChange={(state) => {
                const routes = state?.routes
                const index = state?.index
                if (index !== undefined && routes) {
                  setCurrentRoute(routes[index].name as any)
                }
              }}
              ref={__unsafe__createAccountNavigationRef}
            >
              <StackNavigator.Navigator
                screenOptions={{
                  ...TransitionPresets.SlideFromRightIOS,
                  headerShown: false,
                  headerMode: "screen",
                }}
              >
                <StackNavigator.Screen
                  name="OnboardingCreateAccountEmail"
                  component={OnboardingCreateAccountEmail}
                  initialParams={{ navigateToWelcomeScreen: navigation.goBack }}
                />
                <StackNavigator.Screen
                  name="OnboardingCreateAccountPassword"
                  component={OnboardingCreateAccountPassword}
                />
                <StackNavigator.Screen
                  name="OnboardingCreateAccountName"
                  component={OnboardingCreateAccountName}
                />
                <StackNavigator.Screen name="OnboardingWebView" component={OnboardingWebView} />
              </StackNavigator.Navigator>
              {currentRoute !== "OnboardingWebView" && <OnboardingCreateAccountButton />}
            </NavigationContainer>
          </NavigationIndependentTree>
        </FormikProvider>
      </KeyboardAvoidingView>
    </Flex>
  )
}

interface OnboardingCreateAccountScreenWrapperProps {
  onBackButtonPress?: () => void
  title: string
  caption?: string
}

export const OnboardingCreateAccountScreenWrapper: React.FC<
  React.PropsWithChildren<OnboardingCreateAccountScreenWrapperProps>
> = ({ onBackButtonPress, title, caption, children }) => {
  const color = useColor()
  return (
    <Flex backgroundColor="mono0" flexGrow={1}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: useScreenDimensions().safeAreaInsets.top,
          justifyContent: "flex-start",
        }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
      >
        <Spacer y="60px" />
        <Box minHeight={85}>
          <Text variant="lg-display">{title}</Text>
          {!!caption && (
            <>
              <Spacer y={0.5} />
              <Text variant="xs" color={color("mono100")}>
                {caption}
              </Text>
            </>
          )}
        </Box>
        <Spacer y={2} />
        {children}
      </ScrollView>
      {!!onBackButtonPress && <BackButton onPress={onBackButtonPress} />}
    </Flex>
  )
}

export const OnboardingCreateAccountButton: React.FC = () => {
  const { values, handleSubmit, isSubmitting, errors } = useFormikContext<FormikSchema>()

  const isLastStep = getCurrentRoute() === "OnboardingCreateAccountName"
  const yTranslateAnim = useRef(new Animated.Value(0))

  useEffect(() => {
    yTranslateAnim.current = new Animated.Value(0)
  }, [errors.email])

  return (
    <Flex px={2} paddingBottom={2} backgroundColor="mono0" pt={0.5}>
      <Button
        onPress={() => handleSubmit()}
        block
        haptic="impactMedium"
        disabled={!!isLastStep && !values.acceptedTerms}
        loading={isSubmitting}
        testID="signUpButton"
        variant="fillDark"
      >
        Next
      </Button>
    </Flex>
  )
}

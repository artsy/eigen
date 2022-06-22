import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { createStackNavigator, StackScreenProps, TransitionPresets } from "@react-navigation/stack"
import { BackButton } from "app/navigation/BackButton"
import { GlobalStore } from "app/store/GlobalStore"
import { FormikProvider, useFormik, useFormikContext } from "formik"
import { Box, Button, Flex, Spacer, Text, useColor } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { Alert, Animated, ScrollView } from "react-native"
import { useScreenDimensions } from "shared/hooks"
import { ArtsyKeyboardAvoidingView } from "shared/utils"
import * as Yup from "yup"
import { OnboardingNavigationStack } from "../Onboarding"
import { OnboardingSocialPick } from "../OnboardingSocialPick"
import { OnboardingWebView, OnboardingWebViewRoute } from "../OnboardingWebView"
import {
  OnboardingCreateAccountEmail,
  OnboardingCreateAccountEmailParams,
} from "./OnboardingCreateAccountEmail"
import { OnboardingCreateAccountName } from "./OnboardingCreateAccountName"
import { OnboardingCreateAccountPassword } from "./OnboardingCreateAccountPassword"

export const OnboardingCreateAccount: React.FC = () => <OnboardingSocialPick mode="signup" />

export interface OnboardingCreateAccountProps
  extends StackScreenProps<OnboardingNavigationStack, "OnboardingCreateAccount"> {}

// tslint:disable-next-line:interface-over-type-literal
export type OnboardingCreateAccountNavigationStack = {
  OnboardingCreateAccountEmail: OnboardingCreateAccountEmailParams
  OnboardingCreateAccountPassword: undefined
  OnboardingCreateAccountName: undefined
  OnboardingWebView: { url: OnboardingWebViewRoute }
}

const StackNavigator = createStackNavigator<OnboardingCreateAccountNavigationStack>()

// tslint:disable-next-line:variable-name
export const __unsafe__createAccountNavigationRef: React.MutableRefObject<NavigationContainerRef | null> =
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
  name: Yup.string().required("Full name field is required").trim(),
})

export const getCurrentRoute = () =>
  __unsafe__createAccountNavigationRef.current?.getCurrentRoute()?.name as
    | keyof OnboardingCreateAccountNavigationStack
    | undefined

const EMAIL_EXISTS_ERROR_MESSAGE = "We found an account with this email"

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
    onSubmit: async (
      { email, password, name, agreedToReceiveEmails, acceptedTerms },
      { setErrors }
    ) => {
      switch (currentRoute) {
        case "OnboardingCreateAccountEmail":
          const userExists = await GlobalStore.actions.auth.userExists({ email })

          // When the user exists already we want to take them to the login screen
          if (userExists) {
            setErrors({
              email: EMAIL_EXISTS_ERROR_MESSAGE,
            })
            // If the email is new continue with the signup
          } else {
            __unsafe__createAccountNavigationRef.current?.navigate(
              "OnboardingCreateAccountPassword"
            )
          }
          break
        case "OnboardingCreateAccountPassword":
          __unsafe__createAccountNavigationRef.current?.navigate("OnboardingCreateAccountName")
          break
        case "OnboardingCreateAccountName":
          if (acceptedTerms) {
            const res = await GlobalStore.actions.auth.signUp({
              oauthProvider: "email",
              email,
              password,
              name: name.trim(),
              agreedToReceiveEmails,
            })
            if (!res.success) {
              Alert.alert("Try again", res.message)
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
    <Flex flex={1} backgroundColor="white" flexGrow={1} paddingBottom={10}>
      <ArtsyKeyboardAvoidingView>
        <FormikProvider value={formik}>
          <NavigationContainer
            onStateChange={(state) => {
              const routes = state?.routes
              const index = state?.index
              if (index && routes) {
                setCurrentRoute(routes[index].name as any)
              }
            }}
            ref={__unsafe__createAccountNavigationRef}
            independent
          >
            <StackNavigator.Navigator
              headerMode="screen"
              screenOptions={{
                ...TransitionPresets.SlideFromRightIOS,
                headerShown: false,
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
            {currentRoute !== "OnboardingWebView" && (
              <OnboardingCreateAccountButton
                navigateToLoginWithEmail={() => {
                  navigation.replace("OnboardingLoginWithEmail", {
                    withFadeAnimation: true,
                    email: formik.values.email,
                  })
                }}
              />
            )}
          </NavigationContainer>
        </FormikProvider>
      </ArtsyKeyboardAvoidingView>
    </Flex>
  )
}

interface OnboardingCreateAccountScreenWrapperProps {
  onBackButtonPress?: () => void
  title: string
  caption?: string
}

export const OnboardingCreateAccountScreenWrapper: React.FC<
  OnboardingCreateAccountScreenWrapperProps
> = ({ onBackButtonPress, title, caption, children }) => {
  const color = useColor()
  return (
    <Flex backgroundColor="white" flexGrow={1}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: useScreenDimensions().safeAreaInsets.top,
          justifyContent: "flex-start",
        }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
      >
        <Spacer mt={60} />
        <Box minHeight={85}>
          <Text variant="lg">{title}</Text>
          {!!caption && (
            <>
              <Spacer mt={0.5} />
              <Text variant="xs" color={color("black100")}>
                {caption}
              </Text>
            </>
          )}
        </Box>
        <Spacer mt={2} />
        {children}
      </ScrollView>
      {!!onBackButtonPress && <BackButton onPress={onBackButtonPress} />}
    </Flex>
  )
}

export interface OnboardingCreateAccountButtonProps {
  navigateToLoginWithEmail: () => void
}

export const OnboardingCreateAccountButton: React.FC<OnboardingCreateAccountButtonProps> = ({
  navigateToLoginWithEmail,
}) => {
  const { values, handleSubmit, isSubmitting, errors } = useFormikContext<FormikSchema>()

  const isLastStep = getCurrentRoute() === "OnboardingCreateAccountName"
  const yTranslateAnim = useRef(new Animated.Value(0))

  useEffect(() => {
    if (errors.email === EMAIL_EXISTS_ERROR_MESSAGE) {
      Animated.timing(yTranslateAnim.current, {
        toValue: -50,
        duration: 500,
        useNativeDriver: true,
      }).start()
    } else {
      yTranslateAnim.current = new Animated.Value(0)
    }
  }, [errors.email])

  return (
    <Flex px={2} paddingBottom={2} backgroundColor="white" pt={0.5}>
      {errors.email === EMAIL_EXISTS_ERROR_MESSAGE && (
        <Animated.View style={{ bottom: -50, transform: [{ translateY: yTranslateAnim.current }] }}>
          <Button
            onPress={navigateToLoginWithEmail}
            block
            haptic="impactMedium"
            mb={1}
            mt={1.5}
            variant="outline"
            testID="loginButton"
          >
            Go to Login
          </Button>
        </Animated.View>
      )}

      <Button
        onPress={handleSubmit}
        block
        haptic="impactMedium"
        disabled={isLastStep && !values.acceptedTerms}
        loading={isSubmitting}
        testID="signUpButton"
        variant="fillDark"
      >
        Next
      </Button>
    </Flex>
  )
}

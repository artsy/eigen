import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { createStackNavigator, StackScreenProps, TransitionPresets } from "@react-navigation/stack"
import { FormikProvider, useFormik, useFormikContext } from "formik"
import { BackButton } from "lib/navigation/BackButton"
import { GlobalStore } from "lib/store/GlobalStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Button, Flex, Spacer, Text, useColor } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { Alert, Animated, ScrollView } from "react-native"
import * as Yup from "yup"
import { OnboardingNavigationStack } from "../Onboarding"
import { EmailSubscriptionCheckbox } from "./EmailSubscriptionCheckbox"
import { OnboardingCreateAccountEmail, OnboardingCreateAccountEmailParams } from "./OnboardingCreateAccountEmail"
import { OnboardingCreateAccountName } from "./OnboardingCreateAccountName"
import { OnboardingCreateAccountPassword } from "./OnboardingCreateAccountPassword"
import { TermsOfServiceCheckbox } from "./TermsOfServiceCheckbox"

export interface OnboardingCreateAccountProps
  extends StackScreenProps<OnboardingNavigationStack, "OnboardingCreateAccount"> {}

// tslint:disable-next-line:interface-over-type-literal
export type OnboardingCreateAccountNavigationStack = {
  OnboardingCreateAccountEmail: OnboardingCreateAccountEmailParams
  OnboardingCreateAccountPassword: undefined
  OnboardingCreateAccountName: undefined
}

const StackNavigator = createStackNavigator<OnboardingCreateAccountNavigationStack>()

// tslint:disable-next-line:variable-name
export const __unsafe__createAccountNavigationRef: React.MutableRefObject<NavigationContainerRef | null> = {
  current: null,
}

export interface UserSchema {
  email: string
  password: string
  name: string
}

export const emailSchema = Yup.object().shape({
  email: Yup.string().email("Please provide a valid email address").required("Email field is required"),
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
  name: Yup.string().required("Full name field is required"),
})

const getCurrentRoute = () =>
  __unsafe__createAccountNavigationRef.current?.getCurrentRoute()?.name as
    | keyof OnboardingCreateAccountNavigationStack
    | undefined

const EMAIL_EXISTS_ERROR_MESSAGE = "We found an account with this email"

export const OnboardingCreateAccount: React.FC<OnboardingCreateAccountProps> = ({ navigation }) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [agreedToReceiveEmails, setAgreedToReceiveEmails] = useState(false)
  const [higlightTerms, setHighlightTerms] = useState(false)

  const formik = useFormik<UserSchema>({
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    initialValues: { email: "", password: "", name: "" },
    initialErrors: {},
    onSubmit: async ({ email, password, name }, { setErrors }) => {
      switch (getCurrentRoute()) {
        case "OnboardingCreateAccountEmail":
          const userExists = await GlobalStore.actions.auth.userExists({ email })

          // When the user exists already we want to take them to the login screen
          if (userExists) {
            setErrors({
              email: EMAIL_EXISTS_ERROR_MESSAGE,
            })
            // If the email is new continue with the signup
          } else {
            __unsafe__createAccountNavigationRef.current?.navigate("OnboardingCreateAccountPassword")
          }
          break
        case "OnboardingCreateAccountPassword":
          __unsafe__createAccountNavigationRef.current?.navigate("OnboardingCreateAccountName")
          break
        case "OnboardingCreateAccountName":
          if (acceptedTerms) {
            const res = await GlobalStore.actions.auth.signUp({ email, password, name, agreedToReceiveEmails })
            if (!res) {
              Alert.alert("Error", "Please try signing up again")
            }
          } else {
            // Highlight the terms and conditions checkbox
            setHighlightTerms(true)
          }

          break

        default:
          break
      }
    },
    validationSchema: () => {
      switch (getCurrentRoute()) {
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
    <FormikProvider value={formik}>
      <NavigationContainer ref={__unsafe__createAccountNavigationRef} independent>
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
          <StackNavigator.Screen name="OnboardingCreateAccountPassword" component={OnboardingCreateAccountPassword} />
          <StackNavigator.Screen name="OnboardingCreateAccountName" component={OnboardingCreateAccountName} />
        </StackNavigator.Navigator>
        <OnboardingCreateAccountButton
          navigateToLogin={() => {
            navigation.replace("OnboardingLogin", { withFadeAnimation: true, email: formik.values.email })
          }}
          acceptedTerms={acceptedTerms}
          setAcceptedTerms={setAcceptedTerms}
          highlightTerms={higlightTerms}
          agreedToReceiveEmails={agreedToReceiveEmails}
          setAgreedToReceiveEmails={setAgreedToReceiveEmails}
        />
      </NavigationContainer>
    </FormikProvider>
  )
}

interface OnboardingCreateAccountScreenWrapperProps {
  onBackButtonPress?: () => void
  title: string
  caption?: string
}

export const OnboardingCreateAccountScreenWrapper: React.FC<OnboardingCreateAccountScreenWrapperProps> = ({
  onBackButtonPress,
  title,
  caption,
  children,
}) => {
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
        <Box height={130}>
          <Text variant="largeTitle">{title}</Text>
          {!!caption && (
            <>
              <Spacer mt={1.5} />
              <Text variant="caption" color={color("black60")}>
                {caption}
              </Text>
            </>
          )}
        </Box>
        {/* <Spacer mt={50} /> */}
        {children}
      </ScrollView>
      {!!onBackButtonPress && <BackButton onPress={onBackButtonPress} />}
    </Flex>
  )
}

export interface OnboardingCreateAccountButtonProps {
  navigateToLogin: () => void
  acceptedTerms: boolean
  setAcceptedTerms: React.Dispatch<React.SetStateAction<boolean>>
  highlightTerms: boolean
  agreedToReceiveEmails: boolean
  setAgreedToReceiveEmails: React.Dispatch<React.SetStateAction<boolean>>
}

export const OnboardingCreateAccountButton: React.FC<OnboardingCreateAccountButtonProps> = ({
  navigateToLogin,
  acceptedTerms,
  setAcceptedTerms,
  agreedToReceiveEmails,
  setAgreedToReceiveEmails,
  highlightTerms,
}) => {
  const { handleSubmit, isSubmitting, errors } = useFormikContext<UserSchema>()

  const isLastStep = getCurrentRoute() === "OnboardingCreateAccountName"
  const yTranslateAnim = useRef(new Animated.Value(0))
  const { safeAreaInsets } = useScreenDimensions()

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
    <Flex px={1.5} paddingBottom={1.5} backgroundColor="white">
      {errors.email === EMAIL_EXISTS_ERROR_MESSAGE && (
        <Animated.View style={{ bottom: -50, transform: [{ translateY: yTranslateAnim.current }] }}>
          <Button
            onPress={navigateToLogin}
            block
            haptic="impactMedium"
            mb={1}
            mt={1.5}
            variant="secondaryOutline"
            testID="loginButton"
          >
            Go to Login
          </Button>
        </Animated.View>
      )}
      {!!isLastStep && (
        <Flex width="100%" pr={3} my={2}>
          <TermsOfServiceCheckbox setChecked={setAcceptedTerms} checked={acceptedTerms} error={highlightTerms} />
          <EmailSubscriptionCheckbox setChecked={setAgreedToReceiveEmails} checked={agreedToReceiveEmails} />
        </Flex>
      )}
      <Button
        onPress={handleSubmit}
        block
        haptic="impactMedium"
        disabled={isLastStep && !acceptedTerms}
        loading={isSubmitting}
        testID="signUpButton"
        variant="primaryBlack"
        mb={safeAreaInsets.bottom}
      >
        Next
      </Button>
    </Flex>
  )
}

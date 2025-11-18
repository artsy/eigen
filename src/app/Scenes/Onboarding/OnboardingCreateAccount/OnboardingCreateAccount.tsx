import { Box, Button, Flex, Spacer, Text, useColor } from "@artsy/palette-mobile"
import { NavigationContainerRef } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { OnboardingNavigationStack } from "app/Scenes/Onboarding/Onboarding"
import { OnboardingWebViewRoute } from "app/Scenes/Onboarding/OnboardingWebView"
import { BackButton } from "app/system/navigation/BackButton"
import { useScreenDimensions } from "app/utils/hooks"
import { useFormikContext } from "formik"
import React, { useEffect, useRef } from "react"
import { Animated, ScrollView } from "react-native"
import * as Yup from "yup"
import { OnboardingCreateAccountEmailParams } from "./OnboardingCreateAccountEmail"

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

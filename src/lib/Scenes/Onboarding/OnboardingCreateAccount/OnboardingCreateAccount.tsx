import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { createStackNavigator, StackScreenProps, TransitionPresets } from "@react-navigation/stack"
import { FormikProvider, useFormik, useFormikContext } from "formik"
import { Button, Flex } from "palette"
import React from "react"
import * as Yup from "yup"
import { OnboardingNavigationStack } from "../Onboarding"
import { OnboardingCreateAccountEmail, OnboardingCreateAccountEmailParams } from "./OnboardingCreateAccountEmail"
import { OnboardingCreateAccountName } from "./OnboardingCreateAccountName"
import { OnboardingCreateAccountPassword } from "./OnboardingCreateAccountPassword"

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

const userSchema = Yup.object().shape({
  email: Yup.string().email("Please provide a valid email address"),
  password: Yup.string()
    .required("No password provided")
    .min(8, "Your password should be at least 8 characters")
    .matches(/[A-Z]/, "Your password should contain at least one uppercase letter.")
    .matches(/[a-z]/, "Your password should contain at least one lowercase letter")
    .matches(/[0-9]/, "You password should contain at least one digit"),
  name: Yup.string().test("name", "Full name field is required", (value) => value !== ""),
})

export const OnboardingCreateAccount: React.FC<OnboardingCreateAccountProps> = ({ navigation }) => {
  const formik = useFormik<UserSchema>({
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    initialValues: { email: "", password: "", name: "" },
    initialErrors: {},
    onSubmit: async (_, { validateForm }) => {
      await validateForm()
      switch (__unsafe__createAccountNavigationRef.current?.getCurrentRoute()?.name) {
        case "OnboardingCreateAccountEmail":
          __unsafe__createAccountNavigationRef.current?.navigate("OnboardingCreateAccountPassword")
          break
        case "OnboardingCreateAccountPassword":
          __unsafe__createAccountNavigationRef.current?.navigate("OnboardingCreateAccountName")
          break
        case "name":
          break

        default:
          break
      }
    },
    validationSchema: userSchema,
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
        <OnboardingCreateAccountButton />
      </NavigationContainer>
    </FormikProvider>
  )
}

const OnboardingCreateAccountButton: React.FC = () => {
  const { handleSubmit, isSubmitting, isValid, dirty } = useFormikContext<UserSchema>()

  const isLastStep = __unsafe__createAccountNavigationRef.current?.getCurrentRoute() === "name"

  return (
    <Flex alignSelf="flex-end" px={1.5} paddingBottom={1.5} backgroundColor="white">
      <Button
        onPress={() => {
          handleSubmit()
        }}
        block
        haptic="impactMedium"
        disabled={isLastStep && !(isValid && dirty)}
        loading={isLastStep && isSubmitting}
      >
        Next
      </Button>
    </Flex>
  )
}

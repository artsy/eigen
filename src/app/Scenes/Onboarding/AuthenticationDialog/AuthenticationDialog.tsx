import { Flex, useTheme } from "@artsy/palette-mobile"
import BottomSheet from "@gorhom/bottom-sheet"
import { NavigationContainer, NavigationState } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import {
  EmailStep,
  EmailStepValidationSchema,
} from "app/Scenes/Onboarding/AuthenticationDialog/EmailStep"
import {
  SignUpNameStep,
  SignUpNameStepValidationSchema,
} from "app/Scenes/Onboarding/AuthenticationDialog/SignUpNameStep"
import {
  SignUpPasswordStep,
  SignUpPasswordStepValidationSchema,
} from "app/Scenes/Onboarding/AuthenticationDialog/SignUpPasswordStep"
import { WelcomeStep } from "app/Scenes/Onboarding/AuthenticationDialog/WelcomeStep"
import { OnboardingHomeStore } from "app/Scenes/Onboarding/OnboardingHome"
import { GlobalStore } from "app/store/GlobalStore"
import { showBlockedAuthError } from "app/utils/auth/authHelpers"
import { FormikProvider, useFormik } from "formik"
import React from "react"
import { Alert } from "react-native"
import * as Yup from "yup"

const Stack = createStackNavigator()

export interface AuthenticationDialogFormValues {
  email: string
  password: string
  name: string
  acceptedTerms: boolean
  agreedToReceiveEmails: boolean
}

export const AuthenticationDialog: React.FC = () => {
  const currentStep = OnboardingHomeStore.useStoreState((state) => state.currentStep)
  const setCurrentStep = OnboardingHomeStore.useStoreActions((actions) => actions.setCurrentStep)

  const { space } = useTheme()

  const formik = useFormik<AuthenticationDialogFormValues>({
    initialValues: {
      email: "",
      password: "",
      name: "",
      acceptedTerms: false,
      agreedToReceiveEmails: false,
    },
    onSubmit: async ({ acceptedTerms, agreedToReceiveEmails, email, name, password }) => {
      if (currentStep === "SignUpNameStep" && acceptedTerms) {
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
    },
    validationSchema: () => {
      switch (currentStep) {
        case "EmailStep":
          return EmailStepValidationSchema
        case "SignUpPasswordStep":
          return SignUpPasswordStepValidationSchema
        case "SignUpNameStep":
          return SignUpNameStepValidationSchema
        default:
          return Yup.object().shape({})
          break
      }
    },
    validateOnMount: false,
  })

  const handleStateChange = (state: NavigationState | undefined) => {
    let currentStep: string | undefined

    if (state === undefined) {
      currentStep = undefined
    } else {
      currentStep = state.routeNames.at(state.index)
    }

    setCurrentStep(currentStep)
  }

  return (
    <Flex flex={1}>
      <BottomSheet
        snapPoints={["100%"]}
        detached
        enableContentPanningGesture={false}
        handleComponent={null}
      >
        <Flex style={{ borderRadius: space(2), overflow: "hidden", flex: 1 }}>
          <FormikProvider value={formik}>
            <NavigationContainer independent onStateChange={handleStateChange}>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                  gestureEnabled: false,
                  cardStyle: { backgroundColor: "white" },
                }}
                initialRouteName="WelcomeStep"
              >
                <Stack.Screen name="WelcomeStep" component={WelcomeStep} />
                <Stack.Screen name="EmailStep" component={EmailStep} />
                <Stack.Screen name="SignUpPasswordStep" component={SignUpPasswordStep} />
                <Stack.Screen name="SignUpNameStep" component={SignUpNameStep} />
                {/* <Stack.Screen name="LoginPasswordStep" component={LoginPasswordStep} />
                <Stack.Screen name="LoginOTPStep" component={LoginOTPStep} />
                <Stack.Screen name="ForgotPasswordStep" component={ForgotPasswordStep} /> */}
              </Stack.Navigator>
            </NavigationContainer>
          </FormikProvider>
        </Flex>
      </BottomSheet>
    </Flex>
  )
}

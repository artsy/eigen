import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { createStackNavigator, StackScreenProps, TransitionPresets } from "@react-navigation/stack"
import { Button, Flex } from "palette"
import React from "react"
import { KeyboardAvoidingView } from "react-native"
import { OnboardingNavigationStack } from "../Onboarding"
import { OnboardingCreateAccountEmail, OnboardingCreateAccountEmailParams } from "./OnboardingCreateAccountEmail"
import { OnboardingCreateAccountName } from "./OnboardingCreateAccountName"
import { OnboardingCreateAccountPassword } from "./OnboardingCreateAccountPassword"
import { OnboardingCreateAccountStore } from "./OnboardingCreateAccountStore"

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

const OnboardingCreateAccount: React.FC<OnboardingCreateAccountProps> = ({ navigation }) => {
  return (
    <NavigationContainer ref={__unsafe__createAccountNavigationRef} independent>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
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
      </KeyboardAvoidingView>
      <OnboardingCreateAccountButton />
    </NavigationContainer>
  )
}

const OnboardingCreateAccountButton: React.FC = () => {
  const { handleSubmit } = OnboardingCreateAccountStore.useStoreActions((actions) => actions)

  return (
    <Flex alignSelf="flex-end" px={1.5} paddingBottom={1.5} backgroundColor="white">
      <Button
        onPress={() => {
          handleSubmit()
        }}
        block
        haptic="impactMedium"
        disabled={false}
        loading={false}
      >
        Next
      </Button>
    </Flex>
  )
}

export const OnboardingCreateAccountWrapper: React.FC<OnboardingCreateAccountProps> = (props) => (
  <OnboardingCreateAccountStore.Provider>
    <OnboardingCreateAccount {...props} />
  </OnboardingCreateAccountStore.Provider>
)

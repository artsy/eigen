import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, StackScreenProps, TransitionPresets } from "@react-navigation/stack"
import { BackButton } from "lib/navigation/BackButton"
import { Button, Flex, Text } from "palette"
import React from "react"
import { KeyboardAvoidingView } from "react-native"
import { OnboardingNavigationStack } from "./Onboarding"

export interface OnboardingCreateAccountProps
  extends StackScreenProps<OnboardingNavigationStack, "OnboardingCreateAccount"> {}

// tslint:disable-next-line:interface-over-type-literal
export type OnboardingCreateAccountNavigationStack = {
  OnboardingCreateAccountEmail: OnboardingCreateAccountEmailParams
  OnboardingCreateAccountPassword: undefined
  OnboardingCreateAccountName: undefined
}

const StackNavigator = createStackNavigator<OnboardingCreateAccountNavigationStack>()

export const OnboardingCreateAccount: React.FC<OnboardingCreateAccountProps> = ({ navigation }) => {
  const handleSubmit = () => {
    // do nothing
  }

  return (
    <NavigationContainer independent>
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
      <OnboardingCreateAccountButton handleSubmit={handleSubmit} />
    </NavigationContainer>
  )
}

interface OnboardingCreateAccountEmailParams {
  navigateToWelcomeScreen: () => void
}

export interface OnboardingCreateAccountEmailProps
  extends StackScreenProps<OnboardingCreateAccountNavigationStack, "OnboardingCreateAccountEmail"> {}

const OnboardingCreateAccountEmail: React.FC<OnboardingCreateAccountEmailProps> = ({ route }) => {
  return (
    <Flex flex={1} justifyContent="center" alignItems="center" backgroundColor="white">
      <BackButton onPress={route.params.navigateToWelcomeScreen} />
      <Text variant="title">OnboardingCreateAccountEmail</Text>
    </Flex>
  )
}

const OnboardingCreateAccountPassword = () => {
  return (
    <Flex flex={1} justifyContent="center" alignItems="center" backgroundColor="white">
      <BackButton
        onPress={() => {
          // Navigate back to OnboardingCreateAccountEmail screen
        }}
      />
      <Text variant="title">OnboardingCreateAccountPassword</Text>
    </Flex>
  )
}

const OnboardingCreateAccountName = () => {
  return (
    <Flex flex={1} justifyContent="center" alignItems="center" backgroundColor="white">
      <BackButton
        onPress={() => {
          // Navigate back to OnboardingCreateAccountPassword screen
        }}
      />
      <Text variant="title">OnboardingCreateAccountName</Text>
    </Flex>
  )
}

interface OnboardingCreateAccountButtonProps {
  handleSubmit: () => void
}

const OnboardingCreateAccountButton: React.FC<OnboardingCreateAccountButtonProps> = ({ handleSubmit }) => {
  return (
    <Flex alignSelf="flex-end" px={1.5} paddingBottom={1.5} backgroundColor="white">
      <Button onPress={handleSubmit} block haptic="impactMedium" disabled={false} loading={false}>
        Next
      </Button>
    </Flex>
  )
}

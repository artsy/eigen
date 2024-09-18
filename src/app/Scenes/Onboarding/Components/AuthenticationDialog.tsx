import { Flex, useTheme } from "@artsy/palette-mobile"
import BottomSheet from "@gorhom/bottom-sheet"
import { NavigationContainer, NavigationState } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { EmailStep } from "app/Scenes/Onboarding/Components/EmailStep"
import { LoginPasswordStep } from "app/Scenes/Onboarding/Components/LoginPasswordStep"
import { WelcomeStep } from "app/Scenes/Onboarding/Components/WelcomeStep"
import { OnboardingHomeStore } from "app/Scenes/Onboarding/OnboardingHome"
import React from "react"

const Stack = createStackNavigator()

export const AuthenticationDialog: React.FC = () => {
  const setUserIsAuthenticating = OnboardingHomeStore.useStoreActions(
    (actions) => actions.setUserIsAuthenticating
  )

  const { space } = useTheme()

  const handleStateChange = (state: NavigationState | undefined) => {
    if (state === undefined) {
      return
    }

    const newState = state.routeNames.at(state.index)
    setUserIsAuthenticating(newState !== "WelcomeStep")
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
              <Stack.Screen name="LoginPasswordStep" component={LoginPasswordStep} />
            </Stack.Navigator>
          </NavigationContainer>
        </Flex>
      </BottomSheet>
    </Flex>
  )
}

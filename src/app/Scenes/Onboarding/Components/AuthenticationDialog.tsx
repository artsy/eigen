import { Flex, useTheme } from "@artsy/palette-mobile"
import BottomSheet from "@gorhom/bottom-sheet"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { EmailStep } from "app/Scenes/Onboarding/Components/EmailStep"
import { LoginPasswordStep } from "app/Scenes/Onboarding/Components/LoginPasswordStep"
import { WelcomeStep } from "app/Scenes/Onboarding/Components/WelcomeStep"
import React from "react"
import { View } from "react-native"

export const AuthenticationDialog: React.FC = () => {
  const { space } = useTheme()

  const Stack = createStackNavigator()

  return (
    <View style={{ flex: 1 }}>
      <BottomSheet
        snapPoints={["100%"]}
        detached
        enableContentPanningGesture={false}
        handleComponent={null}
      >
        <Flex style={{ borderRadius: space(2), overflow: "hidden", flex: 1 }}>
          <NavigationContainer independent>
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
    </View>
  )
}

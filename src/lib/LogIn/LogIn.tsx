import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { ChevronIcon, Flex, Text } from "palette"
import React from "react"
import { KeyboardAvoidingView, Platform } from "react-native"
import { LogInEmail } from "./LogInEmail"
import { LogInEnterPassword } from "./LogInEnterPassword"
import { LogInStore } from "./LogInStore"

const StackNavigator = createStackNavigator()

export const LogIn = () => {
  return (
    <NavigationContainer independent>
      <LogInStore.Provider>
        <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", default: undefined })} style={{ flex: 1 }}>
          <StackNavigator.Navigator
            headerMode="screen"
            screenOptions={{
              ...TransitionPresets.SlideFromRightIOS,
            }}
          >
            <StackNavigator.Screen options={{ headerShown: false }} name="LogInEmail" component={LogInEmail} />
            <StackNavigator.Screen
              options={{
                headerBackTitleVisible: false,
                headerBackImage: () => (
                  <Flex py="2" px="1">
                    <ChevronIcon direction="left" />
                  </Flex>
                ),
                headerTitle: () => <Text variant="mediumText">Step 2 of 2</Text>,
              }}
              name="LogInEnterPassword"
              component={LogInEnterPassword}
            />
          </StackNavigator.Navigator>
        </KeyboardAvoidingView>
      </LogInStore.Provider>
    </NavigationContainer>
  )
}

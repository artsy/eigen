import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { ArtsyKeyboardAvoidingView } from "lib/Components/ArtsyKeyboardAvoidingView"
import { ChevronIcon, Flex, Text } from "palette"
import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { LogInEmail } from "./LogInEmail"
import { LogInEnterPassword } from "./LogInEnterPassword"
import { LogInStore } from "./LogInStore"

const StackNavigator = createStackNavigator()

export const LogIn = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer independent>
        <LogInStore.Provider>
          <ArtsyKeyboardAvoidingView>
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
          </ArtsyKeyboardAvoidingView>
        </LogInStore.Provider>
      </NavigationContainer>
    </SafeAreaView>
  )
}

import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { Box } from "palette"
import React from "react"
import {
  CreateSavedSearchAlertNavigationStack,
  CreateSavedSearchAlertProps,
} from "./SavedSearchAlertModel"
import { CreateSavedSearchAlertScreen } from "./screens/CreateSavedSearchAlertScreen"
import { EmailPreferencesScreen } from "./screens/EmailPreferencesScreen"

const Stack = createStackNavigator<CreateSavedSearchAlertNavigationStack>()

export const CreateSavedSearchAlert: React.FC<CreateSavedSearchAlertProps> = (props) => {
  const { visible, params } = props

  return (
    <NavigationContainer independent>
      <FancyModal visible={visible} fullScreen>
        <Box flex={1}>
          <Stack.Navigator
            // force it to not use react-native-screens, which is broken inside a react-native Modal for some reason
            detachInactiveScreens={false}
            screenOptions={{
              ...TransitionPresets.SlideFromRightIOS,
              headerShown: false,
              safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
              cardStyle: { backgroundColor: "white" },
            }}
          >
            <Stack.Screen
              name="CreateSavedSearchAlert"
              component={CreateSavedSearchAlertScreen}
              initialParams={params}
            />
            <Stack.Screen name="EmailPreferences" component={EmailPreferencesScreen} />
          </Stack.Navigator>
        </Box>
      </FancyModal>
    </NavigationContainer>
  )
}

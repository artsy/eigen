import { Box } from "@artsy/palette-mobile"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
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

import { Box } from "@artsy/palette-mobile"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import {
  savedSearchModel,
  SavedSearchStoreProvider,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { CreateSavedSearchAlertContentQueryRenderer } from "app/Scenes/SavedSearchAlert/containers/CreateSavedSearchContentContainer"
import { AlertPriceRangeScreen } from "app/Scenes/SavedSearchAlert/screens/AlertPriceRangeScreen"
import {
  CreateSavedSearchAlertNavigationStack,
  CreateSavedSearchAlertProps,
} from "./SavedSearchAlertModel"
import { EmailPreferencesScreen } from "./screens/EmailPreferencesScreen"

const Stack = createStackNavigator<CreateSavedSearchAlertNavigationStack>()

export const CreateSavedSearchAlert: React.FC<CreateSavedSearchAlertProps> = (props) => {
  const { visible, params } = props
  const { attributes, aggregations, entity } = params

  return (
    <SavedSearchStoreProvider
      runtimeModel={{
        ...savedSearchModel,
        attributes: attributes as SearchCriteriaAttributes,
        aggregations,
        entity,
      }}
    >
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
                component={CreateSavedSearchAlertContentQueryRenderer}
                initialParams={params}
              />
              <Stack.Screen name="EmailPreferences" component={EmailPreferencesScreen} />
              <Stack.Screen name="AlertPriceRange" component={AlertPriceRangeScreen} />
            </Stack.Navigator>
          </Box>
        </FancyModal>
      </NavigationContainer>
    </SavedSearchStoreProvider>
  )
}

import { ArtsyKeyboardAvoidingView, Box } from "@artsy/palette-mobile"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import {
  savedSearchModel,
  SavedSearchStoreProvider,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { CreateSavedSearchAlertContentQueryRenderer } from "app/Scenes/SavedSearchAlert/containers/CreateSavedSearchContentContainer"
import { localizeHeightAndWidthAttributes } from "app/Scenes/SavedSearchAlert/helpers"
import { AlertPriceRangeScreenQueryRenderer } from "app/Scenes/SavedSearchAlert/screens/AlertPriceRangeScreen"
import { ConfirmationScreen } from "app/Scenes/SavedSearchAlert/screens/ConfirmationScreen"
import { SavedSearchFilterScreen } from "app/Scenes/SavedSearchAlert/screens/SavedSearchFilterScreen"
import { useLocalizedUnit } from "app/utils/useLocalizedUnit"
import {
  CreateSavedSearchAlertNavigationStack,
  CreateSavedSearchAlertProps,
} from "./SavedSearchAlertModel"
import { EmailPreferencesScreen } from "./screens/EmailPreferencesScreen"

const Stack = createStackNavigator<CreateSavedSearchAlertNavigationStack>()

export const CreateSavedSearchAlert: React.FC<CreateSavedSearchAlertProps> = (props) => {
  const { visible, params } = props
  const { attributes, entity, currentArtworkID, sizeMetric } = params
  const { localizedUnit } = useLocalizedUnit()

  return (
    <ArtsyKeyboardAvoidingView>
      <SavedSearchStoreProvider
        runtimeModel={{
          ...savedSearchModel,
          attributes: localizeHeightAndWidthAttributes({
            attributes: attributes,
            from: "in",
            to: sizeMetric || localizedUnit,
          }),
          currentArtworkID,
          entity,
          unit: sizeMetric || localizedUnit,
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
                <Stack.Screen
                  name="AlertPriceRange"
                  component={AlertPriceRangeScreenQueryRenderer}
                  options={{
                    // Avoid PanResponser conflicts between the slider and the slide back gesture
                    gestureEnabled: false,
                  }}
                />
                <Stack.Screen
                  name="ConfirmationScreen"
                  component={ConfirmationScreen}
                  options={{
                    gestureEnabled: false,
                  }}
                  initialParams={{
                    closeModal: params.onClosePress,
                  }}
                />
                <Stack.Screen
                  name="SavedSearchFilterScreen"
                  component={SavedSearchFilterScreen}
                  options={{
                    gestureEnabled: false,
                  }}
                />
              </Stack.Navigator>
            </Box>
          </FancyModal>
        </NavigationContainer>
      </SavedSearchStoreProvider>
    </ArtsyKeyboardAvoidingView>
  )
}

import { NavigationContainer } from "@react-navigation/native"
import { TransitionPresets, createStackNavigator } from "@react-navigation/stack"
import {
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { CreateSavedSearchAlertContentQueryRenderer } from "app/Scenes/SavedSearchAlert/containers/CreateSavedSearchContentContainer"
import { localizeHeightAndWidthAttributes } from "app/Scenes/SavedSearchAlert/helpers"
import { AlertPriceRangeScreenQueryRenderer } from "app/Scenes/SavedSearchAlert/screens/AlertPriceRangeScreen"
import { ConfirmationScreen } from "app/Scenes/SavedSearchAlert/screens/ConfirmationScreen"
import { SavedSearchFilterScreen } from "app/Scenes/SavedSearchAlert/screens/SavedSearchFilterScreen"
import {
  CREATE_SAVED_ARTWORK_NAVIGATION_STACK_STATE_KEY,
  useReloadedDevNavigationState,
} from "app/system/navigation/useReloadedDevNavigationState"
import { useLocalizedUnit } from "app/utils/useLocalizedUnit"
import { KeyboardAvoidingView, Modal, Platform } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
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

  const { isReady, initialState, saveSession } = useReloadedDevNavigationState(
    CREATE_SAVED_ARTWORK_NAVIGATION_STACK_STATE_KEY
  )

  if (!isReady) {
    return null
  }

  return (
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
      <NavigationContainer
        independent
        initialState={initialState}
        onStateChange={(state) => {
          saveSession(state)
        }}
      >
        <Modal
          visible={visible}
          presentationStyle="fullScreen"
          statusBarTranslucent
          animationType="slide"
        >
          <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
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
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>
      </NavigationContainer>
    </SavedSearchStoreProvider>
  )
}

import { Flex, useColor } from "@artsy/palette-mobile"
import {
  NavigationContainer,
  NavigationIndependentTree,
  useNavigationContainerRef,
} from "@react-navigation/native"
import { TransitionPresets, createStackNavigator } from "@react-navigation/stack"
import { useNavigationTheme } from "app/Navigation/useNavigationTheme"
import {
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { CreateSavedSearchAlertContentQueryRenderer } from "app/Scenes/SavedSearchAlert/containers/CreateSavedSearchContentContainer"
import { localizeHeightAndWidthAttributes } from "app/Scenes/SavedSearchAlert/helpers"
import { AlertPriceRangeScreenQueryRenderer } from "app/Scenes/SavedSearchAlert/screens/AlertPriceRangeScreen"
import { ConfirmationScreen } from "app/Scenes/SavedSearchAlert/screens/ConfirmationScreen"
import { SavedSearchFilterScreen } from "app/Scenes/SavedSearchAlert/screens/SavedSearchFilterScreen"
import { useLocalizedUnit } from "app/utils/useLocalizedUnit"
import { Modal } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import {
  CreateSavedSearchAlertNavigationStack,
  CreateSavedSearchAlertProps,
} from "./SavedSearchAlertModel"
import { EmailPreferencesScreen } from "./screens/EmailPreferencesScreen"

const Stack = createStackNavigator<CreateSavedSearchAlertNavigationStack>()

export const CreateSavedSearchAlert: React.FC<CreateSavedSearchAlertProps> = (props) => {
  const theme = useNavigationTheme()
  const color = useColor()
  const { top: topInset } = useSafeAreaInsets()

  const { visible, params } = props
  const { attributes, entity, currentArtworkID, sizeMetric } = params
  const { localizedUnit } = useLocalizedUnit()
  const navigationRef = useNavigationContainerRef<CreateSavedSearchAlertNavigationStack>()

  // Android back button/gesture: go back within the alert flow, or close the modal from its first screen.
  // Without this the Modal swallows the back press and nothing happens.
  const handleRequestClose = () => {
    // The alert is already saved on the confirmation screen, so back closes the modal like its X does
    const isOnConfirmationScreen =
      navigationRef.isReady() && navigationRef.getCurrentRoute()?.name === "ConfirmationScreen"

    if (!isOnConfirmationScreen && navigationRef.isReady() && navigationRef.canGoBack()) {
      navigationRef.goBack()
      return
    }

    params.onClosePress()
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
      <NavigationIndependentTree>
        <NavigationContainer theme={theme} ref={navigationRef}>
          <Modal
            visible={visible}
            onRequestClose={handleRequestClose}
            testID="create-alert-modal"
            presentationStyle="overFullScreen"
            statusBarTranslucent
            animationType="slide"
          >
            <Flex
              flex={1}
              style={{
                backgroundColor: color("background"),
                paddingTop: topInset,
              }}
            >
              <Stack.Navigator
                // force it to not use react-native-screens, which is broken inside a react-native Modal for some reason
                detachInactiveScreens={false}
                screenOptions={{
                  ...TransitionPresets.SlideFromRightIOS,
                  headerShown: false,
                  cardStyle: { backgroundColor: color("background") },
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
                  options={{ gestureEnabled: false }}
                  initialParams={{ closeModal: params.onClosePress }}
                />
                <Stack.Screen
                  name="SavedSearchFilterScreen"
                  component={SavedSearchFilterScreen}
                  options={{ gestureEnabled: false }}
                />
              </Stack.Navigator>
            </Flex>
          </Modal>
        </NavigationContainer>
      </NavigationIndependentTree>
    </SavedSearchStoreProvider>
  )
}

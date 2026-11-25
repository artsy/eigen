import { Flex } from "@artsy/palette-mobile"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import {
  NavigationContainer,
  NavigationIndependentTree,
  useNavigationContainerRef,
} from "@react-navigation/native"
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack"
import { useNavigationTheme } from "app/Navigation/useNavigationTheme"
import { SellHeader, SellRoute } from "app/Scenes/Sell/Components/SellHeader"
import { Condition } from "app/Scenes/Sell/Screens/Condition"
import { LocationAndContact } from "app/Scenes/Sell/Screens/LocationAndContact"
import { SelectWorks } from "app/Scenes/Sell/Screens/SelectWorks"
import { SellFlowStore, sellFlowStoreModel } from "app/Scenes/Sell/State/SellFlowStore"
// eslint-disable-next-line no-restricted-imports
import { dismissModal } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { refreshMyCollection } from "app/utils/refreshHelpers"
import { useEffect, useState } from "react"

export type SellNavigationRoutes = {
  SelectWorks: { showWorksSummary?: boolean } | undefined
  Condition: undefined
  LocationAndContact: undefined
}

export type SellNavigationProp = StackNavigationProp<SellNavigationRoutes>

const Stack = createStackNavigator<SellNavigationRoutes>()

interface SellProps {
  /** Opens the flow at Step 2 for this resale submission, instead of at Step 1 */
  resaleSubmissionID?: string
}

export const Sell: React.FC<SellProps> = ({ resaleSubmissionID }) => {
  const enableSell = useFeatureFlag("AREnableSellMyCollectionArtwork")

  // Deep links reach this route without going through the flagged Sell button
  useEffect(() => {
    if (!enableSell) {
      dismissModal()
    }
  }, [enableSell])

  useEffect(() => () => refreshMyCollection(), [])

  if (!enableSell) {
    return null
  }

  return (
    <SellFlowStore.Provider
      runtimeModel={{ ...sellFlowStoreModel, activeResaleSubmissionID: resaleSubmissionID ?? null }}
    >
      <SellNavigator initialRouteName={resaleSubmissionID ? "Condition" : "SelectWorks"} />
    </SellFlowStore.Provider>
  )
}

const SellNavigator: React.FC<{ initialRouteName: keyof SellNavigationRoutes }> = ({
  initialRouteName,
}) => {
  const navigationRef = useNavigationContainerRef<SellNavigationRoutes>()
  const theme = useNavigationTheme()
  const [currentRoute, setCurrentRoute] = useState<SellRoute>()

  const updateCurrentRoute = () => setCurrentRoute(navigationRef.getCurrentRoute())

  return (
    <NavigationIndependentTree>
      <NavigationContainer
        ref={navigationRef}
        theme={theme}
        onReady={updateCurrentRoute}
        onStateChange={updateCurrentRoute}
      >
        {/* The app-level sheet provider renders behind this native modal */}
        <BottomSheetModalProvider>
          <Flex flex={1} bg="mono0">
            {!!currentRoute && <SellHeader route={currentRoute} navigationRef={navigationRef} />}

            <Stack.Navigator
              initialRouteName={initialRouteName}
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="SelectWorks" component={SelectWorks} />
              <Stack.Screen name="Condition" component={Condition} />
              <Stack.Screen name="LocationAndContact" component={LocationAndContact} />
            </Stack.Navigator>
          </Flex>
        </BottomSheetModalProvider>
      </NavigationContainer>
    </NavigationIndependentTree>
  )
}

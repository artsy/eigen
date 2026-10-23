import { Flex } from "@artsy/palette-mobile"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import {
  NavigationContainer,
  NavigationIndependentTree,
  useNavigationContainerRef,
} from "@react-navigation/native"
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack"
import { SellHeader, SellRoute } from "app/Scenes/Sell/Components/SellHeader"
import { Condition } from "app/Scenes/Sell/Screens/Condition"
import { LocationAndContact } from "app/Scenes/Sell/Screens/LocationAndContact"
import { SelectWorks } from "app/Scenes/Sell/Screens/SelectWorks"
// eslint-disable-next-line no-restricted-imports
import { dismissModal } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useEffect, useState } from "react"

export type SellNavigationRoutes = {
  SelectWorks: { showWorksSummary?: boolean } | undefined
  Condition: undefined
  LocationAndContact: undefined
}

export type SellNavigationProp = StackNavigationProp<SellNavigationRoutes>

const Stack = createStackNavigator<SellNavigationRoutes>()

export const Sell: React.FC = () => {
  const enableSell = useFeatureFlag("AREnableSellMyCollectionArtwork")

  // Deep links reach this route without going through the flagged Sell button
  useEffect(() => {
    if (!enableSell) {
      dismissModal()
    }
  }, [enableSell])

  if (!enableSell) {
    return null
  }

  return <SellNavigator />
}

const SellNavigator: React.FC = () => {
  const navigationRef = useNavigationContainerRef<SellNavigationRoutes>()
  const [currentRoute, setCurrentRoute] = useState<SellRoute>()

  const updateCurrentRoute = () => setCurrentRoute(navigationRef.getCurrentRoute())

  return (
    <NavigationIndependentTree>
      <NavigationContainer
        ref={navigationRef}
        onReady={updateCurrentRoute}
        onStateChange={updateCurrentRoute}
      >
        {/* The app-level sheet provider renders behind this native modal */}
        <BottomSheetModalProvider>
          <Flex flex={1} bg="mono0">
            {!!currentRoute && <SellHeader route={currentRoute} navigationRef={navigationRef} />}

            <Stack.Navigator screenOptions={{ headerShown: false }}>
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

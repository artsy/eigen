import { OwnerType } from "@artsy/cohesion"
import { Flex, Screen, Spinner } from "@artsy/palette-mobile"
import { SalesAuctionsOverviewQueryRenderer } from "app/Scenes/Sales/Components/SalesAuctionsOverview"
import { goBack } from "app/system/navigation/navigate"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { Suspense, useState } from "react"
import { RefreshControl } from "react-native"

export const AuctionsOverview = () => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [fetchKey, setFetchKey] = useState(0)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setFetchKey((prev) => prev + 1)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 300)
  }

  return (
    <Screen>
      <Screen.AnimatedHeader onBack={goBack} title="Current and Upcoming Auctions" />
      <Screen.StickySubHeader title="Current and Upcoming Auctions" />

      <Screen.ScrollView
        testID="Auctions-Overview-Screen-ScrollView"
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
      >
        <Flex pb={2} gap={4}>
          <SalesAuctionsOverviewQueryRenderer key={fetchKey} />
        </Flex>
      </Screen.ScrollView>
    </Screen>
  )
}

export const AuctionsOverviewScreen = () => {
  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.auctionsOverview,
      })}
    >
      <Suspense
        fallback={
          <Screen>
            <Screen.Header title="" onBack={goBack} />
            <Screen.Body fullwidth>
              <Flex flex={1} justifyContent="center" alignItems="center">
                <Spinner testID="AuctionsOverviewPlaceholder" />
              </Flex>
            </Screen.Body>
          </Screen>
        }
      >
        <AuctionsOverview />
      </Suspense>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

import { OwnerType } from "@artsy/cohesion"
import { Flex, Screen, Spinner } from "@artsy/palette-mobile"
import { AuctionsOverviewQuery } from "__generated__/AuctionsOverviewQuery.graphql"
import { ZeroState } from "app/Scenes/Sales/Components/ZeroState"
import {
  CurrentlyRunningAuctions,
  CurrentlyRunningAuctionsRefetchType,
} from "app/Scenes/Sales/CurrentlyRunningAuctions"
import { UpcomingAuctions, UpcomingAuctionsRefetchType } from "app/Scenes/Sales/UpcomingAuctions"
import { goBack } from "app/system/navigation/navigate"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { Suspense, useRef, useState } from "react"
import { RefreshControl } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"

export const LiveAucitonsQueryRenderer = <></>

export const AuctionsOverviewScreenQuery = graphql`
  query AuctionsOverviewQuery {
    currentlyRunningAuctions: viewer {
      ...CurrentlyRunningAuctions_viewer
    }
    upcomingAuctions: viewer {
      ...UpcomingAuctions_viewer
    }
  }
`

export const AuctionsOverview = () => {
  const data = useLazyLoadQuery<AuctionsOverviewQuery>(
    AuctionsOverviewScreenQuery,
    {},
    {
      fetchPolicy: "store-and-network",
    }
  )

  const [isRefreshing, setIsRefreshing] = useState(false)

  // using max_value because we want CurrentlyRunningAuctions & UpcomingAuctions
  // to initially render
  const [currentSalesCount, setCurrentSalesCount] = useState(Number.MAX_VALUE)
  const [upcomingSalesCount, setUpcomingSalesCount] = useState(Number.MAX_VALUE)

  const currentAuctionsRefreshRef = useRef<CurrentlyRunningAuctionsRefetchType>(null)

  const upcomingAuctionsRefreshRef = useRef<UpcomingAuctionsRefetchType>(null)

  const setCurrentAuctionsRefreshProp = (refreshProp: CurrentlyRunningAuctionsRefetchType) =>
    (currentAuctionsRefreshRef.current = refreshProp)

  const setUpcomongAuctionsRefreshProp = (refreshProp: UpcomingAuctionsRefetchType) =>
    (upcomingAuctionsRefreshRef.current = refreshProp)

  const handleRefresh = () => {
    setIsRefreshing(true)
    currentAuctionsRefreshRef.current?.({})
    upcomingAuctionsRefreshRef.current?.({})
    setIsRefreshing(false)
  }

  const totalSalesCount = currentSalesCount + upcomingSalesCount

  if (totalSalesCount < 1) {
    return <ZeroState />
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
          <CurrentlyRunningAuctions
            sales={data.currentlyRunningAuctions}
            setRefetchPropOnParent={setCurrentAuctionsRefreshProp}
            setSalesCountOnParent={(count: number) => setCurrentSalesCount(count)}
          />

          <UpcomingAuctions
            sales={data.upcomingAuctions}
            setRefetchPropOnParent={setUpcomongAuctionsRefreshProp}
            setSalesCountOnParent={(count: number) => setUpcomingSalesCount(count)}
          />
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

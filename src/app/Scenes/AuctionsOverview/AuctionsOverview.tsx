import { OwnerType } from "@artsy/cohesion"
import { Flex, Screen, Spinner } from "@artsy/palette-mobile"
import { AuctionsOverviewCurrentlyRunningAuctionsQuery } from "__generated__/AuctionsOverviewCurrentlyRunningAuctionsQuery.graphql"
import { AuctionsOverviewUpcomingAuctionsQuery } from "__generated__/AuctionsOverviewUpcomingAuctionsQuery.graphql"
import { ZeroState } from "app/Scenes/Sales/Components/ZeroState"
import { CurrentlyRunningAuctions } from "app/Scenes/Sales/CurrentlyRunningAuctions"
import { UpcomingAuctions } from "app/Scenes/Sales/UpcomingAuctions"
import { goBack } from "app/system/navigation/navigate"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { Suspense, useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

export const LiveAucitonsQueryRenderer = <></>

export const AuctionsOverviewCurrentlyRunningAuctionsScreenQuery = graphql`
  query AuctionsOverviewCurrentlyRunningAuctionsQuery {
    viewer {
      ...CurrentlyRunningAuctions_viewer
    }
  }
`

export const AuctionsOverviewUpcomingAuctionsScreenQuery = graphql`
  query AuctionsOverviewUpcomingAuctionsQuery {
    viewer {
      ...UpcomingAuctions_viewer
    }
  }
`

export const AuctionsOverview = () => {
  const currentlyRunningAuctionsData =
    useLazyLoadQuery<AuctionsOverviewCurrentlyRunningAuctionsQuery>(
      AuctionsOverviewCurrentlyRunningAuctionsScreenQuery,
      {},
      { fetchPolicy: "store-and-network" }
    )

  const upcomingAuctionsData = useLazyLoadQuery<AuctionsOverviewUpcomingAuctionsQuery>(
    AuctionsOverviewUpcomingAuctionsScreenQuery,
    {},
    { fetchPolicy: "store-and-network" }
  )

  const [currentSalesCount, setCurrentSalesCount] = useState(Number.MAX_VALUE)
  const [upcomingSalesCount, setUpcomingSalesCount] = useState(Number.MAX_VALUE)

  const totalSalesCount = currentSalesCount + upcomingSalesCount

  if (totalSalesCount < 1) {
    return <ZeroState />
  }

  return (
    <Screen>
      <Screen.AnimatedHeader onBack={goBack} title="Current and Upcoming Auctions" />
      <Screen.StickySubHeader title="Current and Upcoming Auctions" />

      <Screen.ScrollView testID="Auctions-Overview-Screen-ScrollView">
        <Flex pb={2} gap={4}>
          <CurrentlyRunningAuctions
            sales={currentlyRunningAuctionsData.viewer}
            setSalesCountOnParent={setCurrentSalesCount}
          />

          <UpcomingAuctions
            sales={upcomingAuctionsData.viewer}
            setSalesCountOnParent={setUpcomingSalesCount}
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

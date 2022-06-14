import { OwnerType } from "@artsy/cohesion"
import { SalesQuery } from "__generated__/SalesQuery.graphql"
import { LotsByFollowedArtistsRailContainer } from "app/Components/LotsByArtistsYouFollowRail/LotsByFollowedArtistsRail"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { Stack } from "app/Components/Stack"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { Flex, Spinner } from "palette"
import React, { Suspense, useRef, useState } from "react"
import { RefreshControl, ScrollView } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ZeroState } from "./Components/ZeroState"
import {
  CurrentlyRunningAuctions,
  CurrentlyRunningAuctionsRefetchType,
} from "./CurrentlyRunningAuctions"
import { UpcomingAuctions, UpcomingAuctionsRefetchType } from "./UpcomingAuctions"

export const SalesScreenQuery = graphql`
  query SalesQuery {
    currentlyRunningAuctions: viewer {
      ...CurrentlyRunningAuctions_viewer
    }
    upcomingAuctions: viewer {
      ...UpcomingAuctions_viewer
    }
    me {
      ...LotsByFollowedArtistsRail_me
    }
  }
`

export const Sales: React.FC<{ data: SalesQuery["response"] }> = ({ data }) => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  // using max_value because we want CurrentlyRunningAuctions & UpcomingAuctions
  // to initially render
  const [currentSalesCount, setCurrentSalesCount] = useState(Number.MAX_VALUE)
  const [upcomingSalesCount, setUpcomingSalesCount] = useState(Number.MAX_VALUE)

  const currentAuctionsRefreshRef = useRef<CurrentlyRunningAuctionsRefetchType>()

  const upcomingAuctionsRefreshRef = useRef<UpcomingAuctionsRefetchType>()

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
    <PageWithSimpleHeader title="Auctions">
      <ScrollView
        testID="Sales-Screen-ScrollView"
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
      >
        <Stack py={2} spacing={3}>
          {!!data.me && (
            <LotsByFollowedArtistsRailContainer title="Lots by Artists You Follow" me={data.me} />
          )}

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
        </Stack>
      </ScrollView>
    </PageWithSimpleHeader>
  )
}

export const SalesQueryRenderer = () => {
  const data = useLazyLoadQuery<SalesQuery>(
    SalesScreenQuery,
    {},
    {
      fetchPolicy: "store-and-network",
      networkCacheConfig: { force: true },
    }
  )
  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.auctions })}
    >
      <Suspense
        fallback={
          <PageWithSimpleHeader title="Auctions">
            <Flex flex={1} justifyContent="center" alignItems="center">
              <Spinner />
            </Flex>
          </PageWithSimpleHeader>
        }
      >
        <Sales data={data} />
      </Suspense>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Box, Flex, LinkText, Screen, Spinner, Text } from "@artsy/palette-mobile"
import { SalesQuery } from "__generated__/SalesQuery.graphql"
import { LatestAuctionResultsRail } from "app/Components/LatestAuctionResultsRail"
import { RecommendedAuctionLotsRail } from "app/Scenes/HomeView/Components/RecommendedAuctionLotsRail"
import { SaleListActiveBids } from "app/Scenes/Sales/Components/SaleListActiveBids"
// eslint-disable-next-line no-restricted-imports
import { goBack, navigate } from "app/system/navigation/navigate"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { Suspense, useRef, useState } from "react"
import { RefreshControl } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"
import { ZeroState } from "./Components/ZeroState"
import {
  CurrentlyRunningAuctions,
  CurrentlyRunningAuctionsRefetchType,
} from "./CurrentlyRunningAuctions"
import { UpcomingAuctions, UpcomingAuctionsRefetchType } from "./UpcomingAuctions"

export const SUPPORT_ARTICLE_URL =
  "https://support.artsy.net/s/article/The-Complete-Guide-to-Auctions-on-Artsy"

export const SalesScreenQuery = graphql`
  query SalesQuery {
    currentlyRunningAuctions: viewer {
      ...CurrentlyRunningAuctions_viewer
    }
    upcomingAuctions: viewer {
      ...UpcomingAuctions_viewer
    }
    recommendedAuctionLots: viewer {
      ...RecommendedAuctionLotsRail_artworkConnection
    }
    me {
      ...SaleListActiveBids_me
    }
    latestAuctioResults: me {
      ...LatestAuctionResultsRail_me
    }
  }
`

export const Sales: React.FC = () => {
  const data = useLazyLoadQuery<SalesQuery>(
    SalesScreenQuery,
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

  const { trackEvent } = useTracking()

  const trackArticleTap = () => {
    trackEvent({
      action: ActionType.tappedLink,
      context_module: ContextModule.header,
      context_screen_owner_type: OwnerType.auctions,
      destination_path: SUPPORT_ARTICLE_URL,
    })
  }

  if (totalSalesCount < 1) {
    return <ZeroState />
  }

  return (
    <Screen>
      <Screen.AnimatedHeader onBack={goBack} title="Auctions" />
      <Screen.StickySubHeader title="Auctions" />

      <Screen.ScrollView
        testID="Sales-Screen-ScrollView"
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
      >
        <Flex pb={2} gap={4}>
          <Box mx={2}>
            <Text variant="sm-display">
              Bid on works you love with Artsy’s daily auctions.{" "}
              <LinkText
                variant="sm-display"
                accessibilityRole="link"
                accessibilityHint="Redirects to Artsy auctions guide"
                onPress={() => {
                  trackArticleTap()
                  navigate(SUPPORT_ARTICLE_URL)
                }}
              >
                Learn more about bidding on Artsy.
              </LinkText>
            </Text>
          </Box>

          <SaleListActiveBids me={data.me} />

          <RecommendedAuctionLotsRail
            title="Auction Lots for You"
            artworkConnection={data.recommendedAuctionLots}
            contextScreenOwnerType={OwnerType.auctions}
          />

          <LatestAuctionResultsRail me={data.latestAuctioResults} />

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

export const SalesScreen = () => {
  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.auctions })}
    >
      <Suspense
        fallback={
          <Flex flex={1} justifyContent="center" alignItems="center">
            <Spinner testID="SalePlaceholder" />
          </Flex>
        }
      >
        <Sales />
      </Suspense>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

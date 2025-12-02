import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Box, Flex, LinkText, Screen, Text } from "@artsy/palette-mobile"
import { SalesActiveBidsQueryRenderer } from "app/Scenes/Sales/Components/SalesActiveBids"
import { SalesAuctionsOverviewQueryRenderer } from "app/Scenes/Sales/Components/SalesAuctionsOverview"
import { SalesLatestAuctionResultsQueryRenderer } from "app/Scenes/Sales/Components/SalesLatestAuctionResults"
import { SalesRecommendedAuctionLotsQueryRenderer } from "app/Scenes/Sales/Components/SalesRecommendedAuctionLots"
// eslint-disable-next-line no-restricted-imports
import { goBack, navigate } from "app/system/navigation/navigate"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useState } from "react"
import { RefreshControl } from "react-native"
import { useTracking } from "react-tracking"

export const SUPPORT_ARTICLE_URL =
  "https://support.artsy.net/s/article/The-Complete-Guide-to-Auctions-on-Artsy"

export const Sales: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [fetchKey, setFetchKey] = useState(0)

  const { trackEvent } = useTracking()

  const handleRefresh = () => {
    setIsRefreshing(true)
    setFetchKey((prev) => prev + 1)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 300)
  }

  const trackArticleTap = () => {
    trackEvent({
      action: ActionType.tappedLink,
      context_module: ContextModule.header,
      context_screen_owner_type: OwnerType.auctions,
      destination_path: SUPPORT_ARTICLE_URL,
    })
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

          <SalesActiveBidsQueryRenderer key={`active-bids-${fetchKey}`} />

          <SalesRecommendedAuctionLotsQueryRenderer key={`recommended-${fetchKey}`} />

          <SalesLatestAuctionResultsQueryRenderer key={`latest-results-${fetchKey}`} />

          <SalesAuctionsOverviewQueryRenderer key={`auctions-${fetchKey}`} />
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
      <Sales />
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

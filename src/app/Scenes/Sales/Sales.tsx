import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Box, Flex, LinkText, Screen, Text } from "@artsy/palette-mobile"
import { SalesActiveBidsQueryRenderer } from "app/Scenes/Sales/Components/SalesActiveBids"
import { SalesAuctionsQueryRenderer } from "app/Scenes/Sales/Components/SalesAuctions"
import { SalesLatestAuctionResultsQueryRenderer } from "app/Scenes/Sales/Components/SalesLatestAuctionResults"
import { SalesRecommendedAuctionLotsQueryRenderer } from "app/Scenes/Sales/Components/SalesRecommendedAuctionLots"
// eslint-disable-next-line no-restricted-imports
import { goBack, navigate } from "app/system/navigation/navigate"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { Suspense, useState } from "react"
import { useTracking } from "react-tracking"
import { ZeroState } from "./Components/ZeroState"

export const SUPPORT_ARTICLE_URL =
  "https://support.artsy.net/s/article/The-Complete-Guide-to-Auctions-on-Artsy"

export const Sales: React.FC = () => {
  const [currentSalesCount, setCurrentSalesCount] = useState(Number.MAX_VALUE)
  const [upcomingSalesCount, setUpcomingSalesCount] = useState(Number.MAX_VALUE)

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

      <Screen.ScrollView testID="Sales-Screen-ScrollView">
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

          <SalesActiveBidsQueryRenderer />

          <SalesRecommendedAuctionLotsQueryRenderer />

          <Suspense>
            <SalesLatestAuctionResultsQueryRenderer />
          </Suspense>

          <Suspense>
            <SalesAuctionsQueryRenderer
              setCurrentSalesCountOnParent={setCurrentSalesCount}
              setUpcomingSalesCountOnParent={setUpcomingSalesCount}
            />
          </Suspense>
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

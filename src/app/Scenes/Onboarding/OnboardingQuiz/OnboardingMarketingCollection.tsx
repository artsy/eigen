import { Button, Flex, LegacyScreen, Spacer, Spinner } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { OnboardingMarketingCollectionQuery } from "__generated__/OnboardingMarketingCollectionQuery.graphql"
import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { CircularSpinner } from "app/Components/CircularSpinner"
import { FullScreenLoadingImage } from "app/Components/FullScreenLoadingImage"
import { OnboardingNavigationStack } from "app/Scenes/Onboarding/OnboardingQuiz/OnboardingQuiz"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { MarketingCollectionHeader } from "./Components/MarketingCollectionHeader"

export type OnboardingMarketingCollectionSlug =
  | "artists-on-the-rise"
  | "curators-picks-emerging"
  | "top-auction-lots"

interface OnboardingMarketingCollectionProps {
  slug: OnboardingMarketingCollectionSlug
  description: string
}

const OnboardingMarketingCollection: React.FC<OnboardingMarketingCollectionProps> = ({
  slug,
  description,
}) => {
  // prevents Android users from going back with hardware button
  useBackHandler(() => true)
  const { navigate } = useNavigation<NavigationProp<OnboardingNavigationStack>>()

  const { marketingCollection } = useLazyLoadQuery<OnboardingMarketingCollectionQuery>(
    OnboardingMarketingCollectionScreenQuery,
    {
      slug,
    }
  )

  if (!marketingCollection?.artworks) {
    return null
  }

  return (
    <LegacyScreen>
      <LegacyScreen.Background>
        <MarketingCollectionHeader
          collectionSlug={slug}
          description={description}
          marketingCollection={marketingCollection}
        />

        <Spacer y={2} />

        <InfiniteScrollArtworksGrid
          // we are deliberately limiting the number of artworks shown in these grids
          loadMore={() => null}
          hasMore={() => false}
          connection={marketingCollection?.artworks}
          shouldAddPadding
          disableArtworksListPrompt
          hideCuratorsPick={slug === "curators-picks-emerging"}
          hideIncreasedInterest={slug === "curators-picks-emerging"}
          hideViewFollowsLink
          hideCreateAlertOnArtworkPreview
        />
        <Flex p={2} backgroundColor="mono0">
          <Button block onPress={() => navigate("OnboardingPostFollowLoadingScreen")} mb={1}>
            Explore More on Artsy
          </Button>
        </Flex>
      </LegacyScreen.Background>
    </LegacyScreen>
  )
}

export const OnboardingMarketingCollectionScreen: React.FC<OnboardingMarketingCollectionProps> = (
  props
) => (
  <Suspense
    fallback={
      <Flex flex={1} alignItems="center" justifyContent="center">
        <Spinner color="mono100" size="large" />
      </Flex>
    }
  >
    <OnboardingMarketingCollection {...props} />
  </Suspense>
)

const OnboardingMarketingCollectionScreenQuery = graphql`
  query OnboardingMarketingCollectionQuery($slug: String!) {
    marketingCollection(slug: $slug) {
      ...MarketingCollectionHeaderFragment_marketingCollection
      internalID
      artworks: artworksConnection(first: 20, page: 1, sort: "-decayed_merch") {
        ...InfiniteScrollArtworksGrid_connection
      }
    }
  }
`

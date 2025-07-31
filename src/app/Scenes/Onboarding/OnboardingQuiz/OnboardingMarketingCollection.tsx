import { Button, Flex, Screen, Spacer } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { OnboardingMarketingCollectionQuery } from "__generated__/OnboardingMarketingCollectionQuery.graphql"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { FullScreenLoadingImage } from "app/Components/FullScreenLoadingImage"
import { OnboardingNavigationStack } from "app/Scenes/Onboarding/OnboardingQuiz/OnboardingQuiz"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { NUM_COLUMNS_MASONRY } from "app/utils/masonryHelpers"
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

  const { scrollHandler } = Screen.useListenForScreenScroll()

  if (!marketingCollection?.artworks) {
    return null
  }

  const artworks = extractNodes(marketingCollection.artworks)

  return (
    <Flex flex={1}>
      <Screen.AnimatedHeader onBack={goBack} title={marketingCollection.title} />

      <Screen.Body fullwidth>
        <MasonryInfiniteScrollArtworkGrid
          animated
          artworks={artworks}
          // we are deliberately limiting the number of artworks shown in these grids
          loadMore={() => null}
          hasMore={false}
          numColumns={NUM_COLUMNS_MASONRY}
          disableAutoLayout
          hideSaveIcon={slug === "curators-picks-emerging"}
          onScroll={scrollHandler}
          ListHeaderComponent={
            <>
              <MarketingCollectionHeader
                collectionSlug={slug}
                description={description}
                marketingCollection={marketingCollection}
              />
              <Spacer y={2} />
            </>
          }
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
      </Screen.Body>
    </Flex>
  )
}

export const OnboardingMarketingCollectionScreen: React.FC<OnboardingMarketingCollectionProps> = (
  props
) => {
  return (
    <Screen>
      <Suspense
        fallback={
          <FullScreenLoadingImage
            title="Great choice"
            loadingText="We’re finding a collection for you"
          />
        }
      >
        <OnboardingMarketingCollection {...props} />
      </Suspense>
    </Screen>
  )
}

const OnboardingMarketingCollectionScreenQuery = graphql`
  query OnboardingMarketingCollectionQuery($slug: String!) {
    marketingCollection(slug: $slug) {
      ...MarketingCollectionHeaderFragment_marketingCollection
      internalID
      title
      artworks: artworksConnection(first: 100, page: 1, sort: "-decayed_merch") {
        edges {
          node {
            id
            slug
            image(includeAll: false) {
              aspectRatio
            }
            ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
          }
        }
      }
    }
  }
`

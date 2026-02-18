import { Button, Flex, Screen } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { OnboardingMarketingCollectionQuery } from "__generated__/OnboardingMarketingCollectionQuery.graphql"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { FullScreenLoadingImage } from "app/Components/FullScreenLoadingImage"
import { LoadFailureView, LoadFailureViewProps } from "app/Components/LoadFailureView"
import { useOnboardingContext } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/Hooks/useOnboardingContext"
import { OnboardingNavigationStack } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/OnboardingQuiz"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { NUM_COLUMNS_MASONRY } from "app/utils/masonryHelpers"
import { useEffect } from "react"
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

const OnboardingMarketingCollection: React.FC<OnboardingMarketingCollectionProps> = withSuspense({
  Component: ({ slug, description }) => {
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
        <Screen.AnimatedHeader onBack={goBack} hideLeftElements title={marketingCollection.title} />

        <Screen.Body fullwidth>
          <MasonryInfiniteScrollArtworkGrid
            animated
            artworks={artworks}
            // we are deliberately limiting the number of artworks shown in these grids
            loadMore={() => null}
            hasMore={false}
            numColumns={NUM_COLUMNS_MASONRY}
            disableAutoLayout
            onScroll={scrollHandler}
            ListHeaderComponent={
              <>
                <MarketingCollectionHeader
                  collectionSlug={slug}
                  description={description}
                  marketingCollection={marketingCollection}
                />
              </>
            }
            disableArtworksListPrompt
            disableProgressiveOnboarding
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
  },
  LoadingFallback: () => {
    return (
      <FullScreenLoadingImage
        title="Great choice"
        loadingText="We’re finding a collection for you"
      />
    )
  },
  ErrorFallback: (fallbackProps) => {
    return <ErrorFallback {...fallbackProps} />
  },
})

const ErrorFallback: React.FC<LoadFailureViewProps> = (fallbackProps) => {
  const { onDone } = useOnboardingContext()

  useEffect(() => {
    if (!__DEV__) {
      onDone()
    }
  }, [onDone])

  if (!__DEV__) {
    // We don't want to show the error fallback in production, instead just navigate to the home
    // This is their first time on the app, and we don't want to give them a reason to close the app
    return null
  }

  return (
    <LoadFailureView
      onRetry={fallbackProps.onRetry}
      useSafeArea={false}
      // This is needed to override the default flex={1}
      flex={undefined}
      error={fallbackProps.error}
      showBackButton={false}
      trackErrorBoundary={false}
    />
  )
}

export const OnboardingMarketingCollectionScreen: React.FC<OnboardingMarketingCollectionProps> = (
  props
) => {
  return (
    <Screen>
      <OnboardingMarketingCollection {...props} />
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

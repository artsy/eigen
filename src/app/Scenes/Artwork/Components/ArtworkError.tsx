import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Join, Spacer, Spinner, Text } from "@artsy/palette-mobile"
import { ArtworkErrorQuery } from "__generated__/ArtworkErrorQuery.graphql"
import { ArtworkErrorRecentlyViewed_homePage$key } from "__generated__/ArtworkErrorRecentlyViewed_homePage.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { SCROLLVIEW_PADDING_BOTTOM_OFFSET } from "app/Components/constants"
import { ArtworkModuleRailFragmentContainer } from "app/Scenes/HomeView/Components/ArtworkModuleRail"
import { ArtworkRecommendationsRail } from "app/Scenes/HomeView/Components/ArtworkRecommendationsRail"
import { NewWorksForYouRail } from "app/Scenes/HomeView/Components/NewWorksForYouRail"
import {
  DEFAULT_RECS_MODEL_VERSION,
  RECOMMENDATION_MODEL_EXPERIMENT_NAME,
} from "app/Scenes/NewWorksForYou/NewWorksForYou"
import { useExperimentVariant } from "app/system/flags/hooks/useExperimentVariant"
import { goBack } from "app/system/navigation/navigate"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { ScrollView } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface ArtworkErrorProps {
  homePage: ArtworkErrorRecentlyViewed_homePage$key
  me: NonNullable<ArtworkErrorQuery["response"]["me"]>
  viewer: NonNullable<ArtworkErrorQuery["response"]["viewer"]>
}

export const ArtworkError: React.FC<ArtworkErrorProps> = ({ homePage, me, viewer }) => {
  const recentlyViewedData = useFragment(recentlyViewedFragment, homePage)

  return (
    <Flex flex={1}>
      <NavigationHeader onLeftButtonPress={goBack} />

      <ScrollView contentContainerStyle={{ paddingBottom: SCROLLVIEW_PADDING_BOTTOM_OFFSET }}>
        <Flex p={2}>
          <Text variant="lg-display">The artwork you were looking for isn't available.</Text>
        </Flex>

        <Spacer y={2} />

        <Join separator={<Spacer y={4} />}>
          {!!me.artworkRecommendationsCount?.totalCount ? (
            <ArtworkRecommendationsRail
              title="Artworks Recommendations"
              me={me}
              isRailVisible={false}
              scrollRef={null}
              contextModule={ContextModule.artworkRecommendationsRail}
              contextScreen={OwnerType.home}
              contextScreenOwnerType={OwnerType.home}
            />
          ) : (
            <NewWorksForYouRail
              artworkConnection={viewer}
              isRailVisible={false}
              scrollRef={null}
              title="New Works for You"
              contextModule={ContextModule.artworkRecommendationsRail}
              contextScreen={OwnerType.home}
              contextScreenOwnerType={OwnerType.home}
            />
          )}

          {!!recentlyViewedData.recentlyViewed && (
            <ArtworkModuleRailFragmentContainer
              title="Recently Viewed"
              rail={recentlyViewedData.recentlyViewed}
              scrollRef={null}
              contextModule={ContextModule.recentlyViewedRail}
              contextScreen={OwnerType.home}
              contextScreenOwnerType={OwnerType.home}
            />
          )}
        </Join>
      </ScrollView>
    </Flex>
  )
}

export const ArtworkErrorScreen: React.FC<{}> = withSuspense({
  Component: () => {
    const { variant } = useExperimentVariant(RECOMMENDATION_MODEL_EXPERIMENT_NAME)
    const data = useLazyLoadQuery<ArtworkErrorQuery>(
      ArtworkErrorScreenQuery,
      {
        version: variant.payload?.value || DEFAULT_RECS_MODEL_VERSION,
      },
      { fetchPolicy: "network-only" }
    )

    if (!data.homePage || !data.me || !data.viewer) {
      return (
        <Flex flex={1}>
          <NavigationHeader onLeftButtonPress={goBack}>Artwork can't be found</NavigationHeader>
          <Flex p={2}>
            <Text variant="lg-display">The artwork you were looking for isn't available.</Text>
          </Flex>
        </Flex>
      )
    }
    return <ArtworkError homePage={data.homePage} me={data.me} viewer={data.viewer} />
  },
  LoadingFallback: () => (
    <Flex flex={1} alignItems="center" justifyContent="center" testID="placeholder">
      <Spinner />
    </Flex>
  ),
  ErrorFallback: (fallbackProps) => {
    return (
      <LoadFailureView
        onRetry={fallbackProps.resetErrorBoundary}
        useSafeArea={false}
        error={fallbackProps.error}
        showBackButton={true}
        trackErrorBoundary={false}
      />
    )
  },
})

const recentlyViewedFragment = graphql`
  fragment ArtworkErrorRecentlyViewed_homePage on HomePage {
    recentlyViewed: artworkModule(key: RECENTLY_VIEWED_WORKS) {
      results {
        id
      }
      ...ArtworkModuleRail_rail
    }
  }
`

const ArtworkErrorScreenQuery = graphql`
  query ArtworkErrorQuery($version: String!) {
    homePage {
      ...ArtworkErrorRecentlyViewed_homePage
    }
    me {
      artworkRecommendationsCount: artworkRecommendations(first: 1) {
        totalCount
      }
      ...ArtworkRecommendationsRail_me
    }
    viewer {
      ...NewWorksForYouRail_artworkConnection
    }
  }
`

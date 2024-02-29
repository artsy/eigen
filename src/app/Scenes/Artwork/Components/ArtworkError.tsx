import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Join, Spacer, Spinner, Text } from "@artsy/palette-mobile"
import { ArtworkErrorQuery } from "__generated__/ArtworkErrorQuery.graphql"
import { ArtworkErrorRecentlyViewed_homePage$key } from "__generated__/ArtworkErrorRecentlyViewed_homePage.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { ArtworkModuleRailFragmentContainer } from "app/Scenes/Home/Components/ArtworkModuleRail"
import { ArtworkRecommendationsRail } from "app/Scenes/Home/Components/ArtworkRecommendationsRail"
import { NewWorksForYouRail } from "app/Scenes/Home/Components/NewWorksForYouRail"
import {
  DEFAULT_RECS_MODEL_VERSION,
  RECOMMENDATION_MODEL_EXPERIMENT_NAME,
} from "app/Scenes/NewWorksForYou/NewWorksForYou"
import { goBack } from "app/system/navigation/navigate"
import { useExperimentVariant } from "app/utils/experiments/hooks"
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
      <FancyModalHeader onLeftButtonPress={goBack} />

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <Flex p={2}>
          <Text variant="lg-display">
            Sorry, the page you were looking for doesn't exist at this URL.
          </Text>
        </Flex>

        <Spacer y={2} />

        <Join separator={<Spacer y={4} />}>
          {!!me.artistRecommendationsCount?.totalCount ? (
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

export const ArtworkErrorScreen: React.FC<{}> = withSuspense(
  () => {
    const worksForYouRecommendationsModel = useExperimentVariant(
      RECOMMENDATION_MODEL_EXPERIMENT_NAME
    )
    const data = useLazyLoadQuery<ArtworkErrorQuery>(ArtworkErrorScreenQuery, {
      version: worksForYouRecommendationsModel.payload || DEFAULT_RECS_MODEL_VERSION,
    })

    if (!data.homePage || !data.me || !data.viewer) {
      return (
        <Flex flex={1}>
          <FancyModalHeader onLeftButtonPress={goBack}>Artwork can't be found</FancyModalHeader>
          <Flex p={2}>
            <Text variant="lg-display">The artwork you were looking for isn't available.</Text>
          </Flex>
        </Flex>
      )
    }
    return <ArtworkError homePage={data.homePage} me={data.me} viewer={data.viewer} />
  },
  () => (
    <Flex flex={1} alignItems="center" justifyContent="center" testID="placeholder">
      <Spinner />
    </Flex>
  )
)

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
      artistRecommendationsCount: artistRecommendations(first: 1) {
        totalCount
      }
      ...ArtworkRecommendationsRail_me
    }
    viewer {
      ...NewWorksForYouRail_artworkConnection
    }
  }
`

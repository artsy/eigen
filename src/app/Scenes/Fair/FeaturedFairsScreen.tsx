import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Screen, Spacer } from "@artsy/palette-mobile"
import { FairCard_fair$data } from "__generated__/FairCard_fair.graphql"
import { FeaturedFairsScreenQuery } from "__generated__/FeaturedFairsScreenQuery.graphql"
import { FeaturedFairsScreen_viewer$key } from "__generated__/FeaturedFairsScreen_viewer.graphql"
import {
  CardWithMetaDataListItem,
  useNumColumns,
  CardsWithMetaDataListPlaceholder as FeaturedFairsScreenPlaceholder,
} from "app/Components/Cards/CardWithMetaData"
import { FairCard } from "app/Scenes/HomeView/Sections/FairCard"
import { HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT } from "app/Scenes/HomeView/helpers/constants"
import { goBack } from "app/system/navigation/navigate"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"

import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"

interface FeaturedFairsProps {
  viewer: FeaturedFairsScreen_viewer$key
}

export const FeaturedFairs: React.FC<FeaturedFairsProps> = ({ viewer }) => {
  const fairs = useFragment(viewerFragment, viewer)

  const { trackEvent } = useTracking()
  const numColumns = useNumColumns()

  const handleOnPress = (fair: FairCard_fair$data) => {
    trackEvent(tracks.tapFair(fair.internalID, fair.slug || ""))
  }

  if (!fairs?.featuredFairs?.length) return null

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.featuredFairs,
      })}
    >
      <Screen>
        <Screen.AnimatedHeader onBack={goBack} title="Featured Fairs" />
        <Screen.StickySubHeader title="Featured Fairs" />

        <Screen.Body fullwidth>
          <Screen.FlatList
            keyExtractor={(_item, index) => `fair-${index}`}
            numColumns={numColumns}
            data={fairs?.featuredFairs}
            initialNumToRender={HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT}
            renderItem={({ item, index }) => {
              return (
                <CardWithMetaDataListItem index={index}>
                  <FairCard fair={item} isFluid onPress={handleOnPress} />
                </CardWithMetaDataListItem>
              )
            }}
            style={{ marginTop: 20 }}
            ItemSeparatorComponent={() => <Spacer y={4} />}
            ListFooterComponent={() => <Spacer y={2} />}
          />
        </Screen.Body>
      </Screen>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const viewerFragment = graphql`
  fragment FeaturedFairsScreen_viewer on Viewer {
    featuredFairs(size: 10, includeBackfill: true) {
      internalID
      ...FairCard_fair
    }
  }
`

export const featuredFairsScreenQuery = graphql`
  query FeaturedFairsScreenQuery {
    viewer {
      ...FeaturedFairsScreen_viewer
    }
  }
`

export const FeaturedFairsScreen: React.FC = withSuspense({
  Component: () => {
    const data = useLazyLoadQuery<FeaturedFairsScreenQuery>(featuredFairsScreenQuery, {})

    if (!data?.viewer) {
      return null
    }

    return <FeaturedFairs viewer={data.viewer} />
  },
  LoadingFallback: () => (
    <FeaturedFairsScreenPlaceholder
      testID="featured-fairs-screen-placeholder"
      title="Featured Fairs"
    />
  ),
  ErrorFallback: NoFallback,
})

export const tracks = {
  tapFair: (fairID: string, fairSlug: string) => ({
    action: ActionType.tappedFairGroup,
    context_module: ContextModule.fairCard,
    context_screen_owner_type: OwnerType.fairs,
    destination_screen_owner_type: OwnerType.fair,
    destination_screen_owner_id: fairID,
    destination_screen_owner_slug: fairSlug,
  }),
}

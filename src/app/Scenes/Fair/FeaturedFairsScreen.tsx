import { ActionType, OwnerType } from "@artsy/cohesion"
import { Box, Screen, Spacer, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { FairCard_fair$data } from "__generated__/FairCard_fair.graphql"
import { FeaturedFairsScreenQuery } from "__generated__/FeaturedFairsScreenQuery.graphql"
import { FeaturedFairsScreen_viewer$key } from "__generated__/FeaturedFairsScreen_viewer.graphql"
import { PAGE_SIZE } from "app/Components/constants"
import { useNumColumns } from "app/Scenes/Articles/ArticlesList"
import { FairCard } from "app/Scenes/HomeView/Sections/FairCard"
import { HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT } from "app/Scenes/HomeView/helpers/constants"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { AnimatedMasonryListFooter } from "app/utils/masonryHelpers/AnimatedMasonryListFooter"
import {
  PlaceholderBox,
  ProvidePlaceholderContext,
  RandomWidthPlaceholderText,
} from "app/utils/placeholders"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { times } from "lodash"
import { useCallback } from "react"
import { FlatList } from "react-native"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface FeaturedFairsProps {
  viewer: FeaturedFairsScreen_viewer$key
}

export const FeaturedFairs: React.FC<FeaturedFairsProps> = ({ viewer }) => {
  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment(
    viewerFragment,
    viewer
  )

  const RefreshControl = useRefreshControl(refetch)
  const { trackEvent } = useTracking()
  const { width: screenWidth } = useScreenDimensions()
  const space = useSpace()
  const numColumns = useNumColumns()

  const onEndReached = useCallback(() => {
    if (!!hasNext && !isLoadingNext) {
      loadNext?.(PAGE_SIZE)
    }
  }, [hasNext, isLoadingNext])

  const handleOnPress = (fair: FairCard_fair$data) => {
    trackEvent(tracks.tapFair(fair.internalID, fair.slug || ""))
  }

  const fairs = extractNodes(data?.fairsConnection)

  if (!fairs?.length) return null

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        // TODO: Update owner type
        context_screen_owner_type: OwnerType.articles,
      })}
    >
      <Screen>
        <Screen.AnimatedHeader title="Featured Fairs" />
        <Screen.StickySubHeader title="Featured Fairs" />

        <Screen.Body>
          <Screen.ScrollView>
            <Spacer y={2} />
            <Screen.FlatList
              data={fairs}
              onEndReached={onEndReached}
              refreshControl={RefreshControl}
              initialNumToRender={HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT}
              keyExtractor={(item) => item.internalID}
              numColumns={numColumns}
              renderItem={({ item }) => {
                return (
                  <FairCard fair={item} width={screenWidth - space(4)} onPress={handleOnPress} />
                )
              }}
              ItemSeparatorComponent={() => <Spacer y={2} />}
              ListFooterComponent={
                hasNext ? (
                  <AnimatedMasonryListFooter
                    shouldDisplaySpinner={!!fairs.length && !!isLoadingNext && !!hasNext}
                  />
                ) : null
              }
            />
          </Screen.ScrollView>
        </Screen.Body>
      </Screen>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const viewerFragment = graphql`
  fragment FeaturedFairsScreen_viewer on Viewer
  @refetchable(queryName: "FeaturedFairsScreen_viewerRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
    fairsConnection(
      after: $cursor
      first: $count
      status: CURRENT
      sort: START_AT_DESC
      hasFullFeature: true
    ) @connection(key: "FeaturedFairsScreen_fairsConnection") {
      edges {
        node {
          internalID
          ...FairCard_fair
        }
      }
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
  LoadingFallback: () => <FeaturedFairsScreenPlaceholder />,
  ErrorFallback: NoFallback,
})

export const FeaturedFairsScreenPlaceholder: React.FC = () => {
  const numColumns = useNumColumns()

  return (
    <Screen testID="featured-fairs-screen-placeholder">
      <Screen.AnimatedHeader title="Featured Fairs" />
      <Screen.StickySubHeader title="Featured Fairs" />

      <Screen.Body fullwidth>
        <ProvidePlaceholderContext>
          <Spacer y={2} />
          <FlatList
            numColumns={numColumns}
            data={times(6)}
            keyExtractor={(item) => `${item}-${numColumns}`}
            renderItem={({ index }) => {
              return (
                <Box key={index} mx={2}>
                  <PlaceholderBox aspectRatio={1.5} width="100%" marginBottom={10} />
                  <Spacer y={1} />
                  <RandomWidthPlaceholderText minWidth={200} maxWidth={250} height={16} />
                  <RandomWidthPlaceholderText minWidth={200} maxWidth={250} height={16} />
                </Box>
              )
            }}
            ItemSeparatorComponent={() => <Spacer y={2} />}
          />
        </ProvidePlaceholderContext>
      </Screen.Body>
    </Screen>
  )
}

export const tracks = {
  tapFair: (fairID: string, fairSlug: string) => ({
    action: ActionType.tappedFairGroup,
    // TODO: Update context module
    // context_module: ContextModule.featuredFairs,
    context_screen_owner_type: OwnerType.fairs,
    destination_screen_owner_type: OwnerType.fair,
    destination_screen_owner_id: fairID,
    destination_screen_owner_slug: fairSlug,
  }),
}

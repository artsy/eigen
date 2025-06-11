import { ActionType, ContextModule, OwnerType, TappedShowGroup } from "@artsy/cohesion"
import { Flex, FlexProps, Join, SkeletonText, Spacer, Text } from "@artsy/palette-mobile"
import { ShowsRailQuery } from "__generated__/ShowsRailQuery.graphql"
import {
  ShowsRail_showsConnection$data,
  ShowsRail_showsConnection$key,
} from "__generated__/ShowsRail_showsConnection.graphql"
import { CardWithMetaDataSkeleton as SkeletonShowCard } from "app/Components/Cards/CardWithMetaData"
import { SectionTitle } from "app/Components/SectionTitle"
import { ShowCardContainer } from "app/Components/ShowCard"
import {
  HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT,
  HORIZONTAL_FLATLIST_WINDOW_SIZE,
} from "app/Scenes/HomeView/helpers/constants"
import { extractNodes } from "app/utils/extractNodes"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { Location, useLocation } from "app/utils/hooks/useLocation"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { times } from "lodash"
import { Suspense, memo } from "react"
import { FlatList } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"

interface ShowsRailProps extends FlexProps {
  location?: Location | null
  contextModule?: ContextModule
  onTrack?: (show: ExtractNodeType<ShowsRail_showsConnection$data>, index: number) => void
  title: string
}

// Because we never show more than 2 shows per gallery we need to overfetch, filter out, and then limit the number of shows.
const NUMBER_OF_SHOWS = 10

export const ShowsRail: React.FC<ShowsRailProps> = memo(
  ({ location, contextModule, onTrack, title, ...flexProps }) => {
    const tracking = useTracking()

    const queryVariables = location ? { near: location } : { includeShowsNearIpBasedLocation: true }

    const queryData = useLazyLoadQuery<ShowsRailQuery>(ShowsQuery, queryVariables)

    const showsConnection = useFragment<ShowsRail_showsConnection$key>(
      showsFragment,
      queryData?.me?.showsConnection
    )

    const shows = extractNodes(showsConnection)

    const hasShows = shows?.length

    if (!hasShows) {
      return null
    }

    return (
      <Flex {...flexProps}>
        <SectionTitle
          title={title}
          mx={2}
          href="/shows-for-you"
          onPress={() => {
            tracking.trackEvent(tracks.tappedHeader())
          }}
        />

        <FlatList
          horizontal
          initialNumToRender={HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT}
          windowSize={HORIZONTAL_FLATLIST_WINDOW_SIZE}
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={() => <Spacer x={2} />}
          ListFooterComponent={() => <Spacer x={2} />}
          ItemSeparatorComponent={() => <Spacer x={2} />}
          data={shows.slice(0, NUMBER_OF_SHOWS)}
          keyExtractor={(item) => `${item.internalID}`}
          renderItem={({ item, index }) => (
            <ShowCardContainer
              show={item}
              onPress={() => {
                if (onTrack) {
                  return onTrack(item, index)
                }

                tracking.trackEvent(
                  tracks.tappedThumbnail(item.internalID, item.slug || "", index, contextModule)
                )
              }}
            />
          )}
        />
      </Flex>
    )
  }
)

const ShowsQuery = graphql`
  query ShowsRailQuery($near: Near, $includeShowsNearIpBasedLocation: Boolean) {
    me {
      showsConnection(
        first: 20
        near: $near
        includeShowsNearIpBasedLocation: $includeShowsNearIpBasedLocation
        status: RUNNING_AND_UPCOMING
      ) @optionalField {
        ...ShowsRail_showsConnection
      }
    }
  }
`

const showsFragment = graphql`
  fragment ShowsRail_showsConnection on ShowConnection {
    edges {
      node {
        internalID
        slug
        ...ShowCard_show
      }
    }
  }
`

export const tracks = {
  tappedHeader: () => ({
    action: ActionType.tappedShowGroup,
    context_module: ContextModule.showsRail,
    context_screen_owner_type: OwnerType.home,
    destination_screen_owner_type: OwnerType.show,
    type: "header",
  }),
  tappedThumbnail: (
    showID?: string,
    showSlug?: string,
    index?: number,
    contextModule?: ContextModule
  ): TappedShowGroup => ({
    action: ActionType.tappedShowGroup,
    context_module: contextModule || ContextModule.showsRail,
    context_screen_owner_type: OwnerType.home,
    destination_screen_owner_type: OwnerType.show,
    destination_screen_owner_id: showID,
    destination_screen_owner_slug: showSlug,
    horizontal_slide_position: index,
    type: "thumbnail",
  }),
}

interface ShowsRailContainerProps extends FlexProps {
  title: string
  contextModule?: ContextModule
  onTrack?: (show: ExtractNodeType<ShowsRail_showsConnection$data>, index: number) => void
}

export const ShowsRailContainer: React.FC<ShowsRailContainerProps> = ({
  contextModule,
  onTrack,
  ...flexProps
}) => {
  const visualizeLocation = useDevToggle("DTLocationDetectionVisialiser")

  const { location, isLoading } = useLocation({
    skipPermissionRequests: true,
  })

  if (isLoading) {
    return <ShowsRailPlaceholder />
  }

  return (
    <Suspense fallback={<ShowsRailPlaceholder />}>
      {!!visualizeLocation && (
        <Text mx={2} color="red">
          Location: {location ? JSON.stringify(location) : "Using IP-based location"}
        </Text>
      )}

      <ShowsRail
        {...flexProps}
        location={location}
        contextModule={contextModule}
        onTrack={onTrack}
      />
    </Suspense>
  )
}

export const ShowsRailPlaceholder: React.FC = () => {
  return (
    <Flex m={2} testID="show-rail-placeholder">
      <SkeletonText numberOfLines={1}>Shows for You</SkeletonText>
      <Spacer y={1} />

      <Flex flexDirection="row">
        <Join separator={<Spacer x={2} />}>
          {times(2).map((index) => (
            <SkeletonShowCard key={index} />
          ))}
        </Join>
      </Flex>
    </Flex>
  )
}

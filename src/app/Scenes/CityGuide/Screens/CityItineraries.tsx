import { ShareIcon } from "@artsy/icons/native"
import { Flex, Screen, Spinner, Text, Touchable } from "@artsy/palette-mobile"
import { CityItinerariesQuery } from "__generated__/CityItinerariesQuery.graphql"
import { CityItineraries_me$key } from "__generated__/CityItineraries_me.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { PAGE_SIZE } from "app/Components/constants"
import { ItineraryListItem } from "app/Scenes/CityGuide/Components/ItineraryListItem"
import { useItineraryShare } from "app/Scenes/CityGuide/hooks/useItineraryShare"
import { itineraryStopsCount } from "app/Scenes/CityGuide/utils/itineraryStopsCount"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

const SHARE_ICON_SIZE = 24

interface Props {
  citySlug: string
  me: CityItineraries_me$key
}

interface ShareableItinerary {
  internalID: string
  title: string
  isCurated?: boolean | null
  slug?: string | null
  shareToken?: string | null
}

/**
 * Its own component, not inlined in `renderItem`: `Screen.FlatList` renders each row through a
 * class-based cell renderer, and `useItineraryShare` — a hook — needs a real function
 * component to run in.
 */
const ItineraryShareTouchable: React.FC<{ item: ShareableItinerary; citySlug: string }> = ({
  item,
  citySlug,
}) => {
  const { share, isSharing } = useItineraryShare({
    internalID: item.internalID,
    slug: item.slug,
    citySlug,
    title: item.title,
    isCurated: !!item.isCurated,
    shareToken: item.shareToken,
  })

  return (
    <Touchable
      testID="itinerary-share"
      accessibilityRole="button"
      accessibilityLabel={`Share ${item.title}`}
      disabled={isSharing}
      onPress={share}
    >
      <ShareIcon width={SHARE_ICON_SIZE} height={SHARE_ICON_SIZE} />
    </Touchable>
  )
}

const CityItineraries: React.FC<Props> = ({ citySlug, me }) => {
  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment(fragment, me)
  const refreshControl = useRefreshControl(refetch, { pageSize: PAGE_SIZE })

  const itineraries = extractNodes(data.itinerariesConnection).filter(
    (itinerary) => !itinerary.isCurated
  )

  return (
    <Screen>
      <Screen.Header onBack={goBack} />

      <Screen.Body fullwidth>
        {/*
          The title sits in the body rather than the header bar: the designs show it below the
          back chevron, at lg-display, not centred in the navigation bar.
        */}
        <Flex px={2} pb={2}>
          <Text variant="lg-display">Your Itineraries</Text>
        </Flex>

        {/*
          No year grouping: `Itinerary` exposes no createdAt, and publishedAt is null for a
          private one, so there's no date to group rows by.
        */}
        <Screen.FlatList
          data={itineraries}
          keyExtractor={(itinerary) => itinerary.internalID}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          ItemSeparatorComponent={() => <Flex height={20} />}
          onEndReached={() => {
            if (hasNext && !isLoadingNext) loadNext(PAGE_SIZE)
          }}
          ListEmptyComponent={
            <Text variant="sm" color="mono60">
              You haven’t started an itinerary here yet.
            </Text>
          }
          ListFooterComponent={isLoadingNext ? <Spinner style={{ marginVertical: 20 }} /> : null}
          refreshControl={refreshControl}
          renderItem={({ item }) => (
            <ItineraryListItem
              title={item.title}
              stopsCount={itineraryStopsCount(item)}
              imageUrl={item.heroImage?.url}
              href={`/city-guide/${citySlug}/itinerary/${item.slug ?? item.internalID}`}
              rightSlot={<ItineraryShareTouchable item={item} citySlug={citySlug} />}
            />
          )}
        />
      </Screen.Body>
    </Screen>
  )
}

// `id` isn't rendered here, but a delete on the itinerary's own detail page needs it to evict
// this node from the connection: `ConnectionHandler.deleteNode` matches by Relay's `id`, not
// `internalID`.
const fragment = graphql`
  fragment CityItineraries_me on Me
  @refetchable(queryName: "CityItinerariesPaginationQuery")
  @argumentDefinitions(
    citySlug: { type: "String!" }
    count: { type: "Int", defaultValue: 20 }
    cursor: { type: "String" }
  ) {
    itinerariesConnection(citySlug: $citySlug, first: $count, after: $cursor)
      @connection(key: "CityItineraries_itinerariesConnection") {
      edges {
        node {
          id
          internalID
          slug
          title
          isCurated
          shareToken
          heroImage {
            url(version: "small")
          }
          stopsCount
        }
      }
    }
  }
`

export const CityItinerariesScreenQuery = graphql`
  query CityItinerariesQuery($citySlug: String!) {
    me {
      ...CityItineraries_me @arguments(citySlug: $citySlug)
    }
  }
`

export const CityItinerariesScreenQueryRenderer = withSuspense({
  Component: ({ citySlug }: { citySlug: string }) => {
    const data = useLazyLoadQuery<CityItinerariesQuery>(CityItinerariesScreenQuery, {
      citySlug,
    })

    if (!data.me) {
      return null
    }

    return <CityItineraries citySlug={citySlug} me={data.me} />
  },
  LoadingFallback: SpinnerFallback,
  ErrorFallback: (fallbackProps) => (
    <LoadFailureView error={fallbackProps.error} onRetry={fallbackProps.resetErrorBoundary} />
  ),
})

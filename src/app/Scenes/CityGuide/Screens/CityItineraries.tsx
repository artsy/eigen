import { EditIcon, ShareIcon } from "@artsy/icons/native"
import { Flex, Screen, Spinner, Text } from "@artsy/palette-mobile"
import { CityItinerariesQuery } from "__generated__/CityItinerariesQuery.graphql"
import { CityItineraries_me$key } from "__generated__/CityItineraries_me.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { PAGE_SIZE } from "app/Components/constants"
import { ItineraryEditSheet } from "app/Scenes/CityGuide/Components/ItineraryEditSheet"
import { ItineraryListItem } from "app/Scenes/CityGuide/Components/ItineraryListItem"
import { itineraryStopsCount } from "app/Scenes/CityGuide/utils/itineraryStopsCount"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useState } from "react"
import { TouchableOpacity } from "react-native"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

const SHARE_ICON_SIZE = 24

interface Props {
  citySlug: string
  me: CityItineraries_me$key
}

const CityItineraries: React.FC<Props> = ({ citySlug, me }) => {
  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment(fragment, me)

  const itineraries = extractNodes(data.itinerariesConnection)

  // The itinerary the edit sheet is open for. Held here rather than per row so only one sheet
  // ever mounts.
  const [editing, setEditing] = useState<(typeof itineraries)[number] | null>(null)

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
          No year grouping. The designs group rows under a blue year, but `Itinerary` exposes
          no createdAt and publishedAt is null for a private itinerary, so there is no date to
          group by — see the plan.
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
          renderItem={({ item }) => (
            <ItineraryListItem
              title={item.title}
              stopsCount={itineraryStopsCount(item)}
              imageUrl={item.heroImage?.url}
              href={`/city-guide/${citySlug}/itinerary/${item.slug ?? item.internalID}`}
              rightSlot={
                <Flex flexDirection="row" alignItems="center" gap={1}>
                  {/*
                    Not in the designs, which show only share. The edit sheet needs an entry
                    point, and this screen is the only place ownership is guaranteed — it
                    queries through `me`, while `Query.itinerary` exposes no ownership flag.
                  */}
                  <TouchableOpacity
                    testID="itinerary-edit"
                    accessibilityRole="button"
                    accessibilityLabel={`Edit ${item.title}`}
                    onPress={() => setEditing(item)}
                  >
                    <EditIcon width={SHARE_ICON_SIZE} height={SHARE_ICON_SIZE} />
                  </TouchableOpacity>

                  {/*
                    Sharing needs a share token, which is `updateItinerary` with its token
                    flags — a mutation that throws today. Rendered and wired so the row does
                    not need rebuilding once it works.
                  */}
                  <TouchableOpacity
                    testID="itinerary-share"
                    accessibilityRole="button"
                    accessibilityLabel={`Share ${item.title}`}
                    onPress={() => {
                      // TODO: mint a share token and open the share sheet.
                    }}
                  >
                    <ShareIcon width={SHARE_ICON_SIZE} height={SHARE_ICON_SIZE} />
                  </TouchableOpacity>
                </Flex>
              }
            />
          )}
        />

        {!!editing && (
          <ItineraryEditSheet
            visible
            onClose={() => setEditing(null)}
            itinerary={{
              internalID: editing.internalID,
              name: editing.title,
              description: editing.description,
              coverImageUrl: editing.heroImage?.url,
            }}
            // A deleted itinerary has to leave the list, and the connection has no record of
            // the removal, so the page is refetched from the top.
            onDeleted={() => refetch({}, { fetchPolicy: "network-only" })}
          />
        )}
      </Screen.Body>
    </Screen>
  )
}

const fragment = graphql`
  fragment CityItineraries_me on Me
  @refetchable(queryName: "CityItinerariesPaginationQuery")
  @argumentDefinitions(
    citySlug: { type: "String!" }
    count: { type: "Int", defaultValue: 20 }
    cursor: { type: "String", defaultValue: "" }
  ) {
    itinerariesConnection(citySlug: $citySlug, first: $count, after: $cursor)
      @connection(key: "CityItineraries_itinerariesConnection") {
      edges {
        node {
          internalID
          slug
          title
          description
          heroImage {
            url(version: "small")
          }
          sections {
            stopsCount
          }
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

import { Button, Flex, SimpleMessage, Spinner } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { FlashList } from "@shopify/flash-list"
import { CityGuideFair_fair$key } from "__generated__/CityGuideFair_fair.graphql"
import { CityGuideShow_show$key } from "__generated__/CityGuideShow_show.graphql"
import { CitySavedListPaginationQuery } from "__generated__/CitySavedListPaginationQuery.graphql"
import { CitySavedListQuery } from "__generated__/CitySavedListQuery.graphql"
import { CitySavedList_me$key } from "__generated__/CitySavedList_me.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { PAGE_SIZE } from "app/Components/constants"
import { renderFairRow, renderShowRow } from "app/Scenes/CityGuide/Components/CityEventRows"
import { MapView } from "app/Scenes/CityGuide/Components/Map/MapView"
import { MapSection } from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"
import { cityGuideFairFragment } from "app/Scenes/CityGuide/utils/CityGuideFair"
import { cityGuideShowFragment } from "app/Scenes/CityGuide/utils/CityGuideShow"
import { fairsToMapSections } from "app/Scenes/CityGuide/utils/fairsToMapSections"
import { showsToMapSections } from "app/Scenes/CityGuide/utils/showsToMapSections"
import { Fair, Show } from "app/Scenes/CityGuide/utils/types"
import { extractNodes } from "app/utils/extractNodes"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { isCloseToBottom } from "app/utils/isCloseToBottom"
import { Schema } from "app/utils/track"
import { MotiView } from "moti"
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react"
import { graphql, useFragment, useLazyLoadQuery, usePaginationFragment } from "react-relay"
import { useTracking } from "react-tracking"

type CityItineraryRow = { kind: "fair"; fair: Fair } | { kind: "show"; show: Show }

interface Props {
  me: CitySavedList_me$key
  cityName: string
  citySlug: string
  city: CitySavedListQuery["response"]["city"]
}

const CitySavedList: React.FC<Props> = ({ me, cityName, citySlug, city }) => {
  const [fetchingNextPage, setFetchingNextPage] = useState(false)
  const [isMapView, setIsMapView] = useState(false)
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const { trackEvent } = useTracking()
  const { trackEvent: trackEntity } = useTracking<Schema.Entity>()
  const navigation = useNavigation()

  // This screen has no in-flow header of its own — it sits under a static native header
  // (routes.tsx sets no `title` option, unlike CityEventListScreen, which renders its own
  // Screen.Header instead). Setting the title here, the same way AuctionResult.tsx names its
  // header from loaded data, is what actually puts a title in that header: it stays put across
  // the list/map toggle for free, since both modes render under the one native header.
  useLayoutEffect(() => {
    navigation.setOptions({ title: `Your ${cityName} Itinerary` })
  }, [navigation, cityName])

  // Mirrors CityEventListScreen: the map is a mode of this screen, not a screen of its own,
  // so Android's hardware back closes it first rather than leaving the screen.
  useBackHandler(
    useCallback(() => {
      if (isMapView) {
        setIsMapView(false)
        return true
      }

      return false
    }, [isMapView])
  )

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    CitySavedListPaginationQuery,
    CitySavedList_me$key
  >(citySavedListFragment, me)

  useEffect(() => {
    trackEvent(tracks.trackScreen(citySlug))
  }, [trackEvent, citySlug])

  const fetchData = useCallback(() => {
    if (!hasNext || isLoadingNext) {
      return
    }

    setFetchingNextPage(true)
    loadNext(PAGE_SIZE, {
      onComplete: (error) => {
        if (error) {
          console.error("CitySavedList.tsx #fetchData", error.message)
        }
        setFetchingNextPage(false)
      },
    })
  }, [hasNext, isLoadingNext, loadNext])

  const showRefs: CityGuideShow_show$key = extractNodes(data.followsAndSaves?.shows)
  const shows = useFragment(cityGuideShowFragment, showRefs)

  const fairRefs: CityGuideFair_fair$key = extractNodes(city?.fairsConnection)
  const allFairs = useFragment(cityGuideFairFragment, fairRefs)
  const followedFairs = allFairs.filter((fair) => !!fair.profile?.isFollowed)

  // Fairs first, then shows. Positional rather than merged by date, so loading another page of
  // shows cannot reorder anything already on screen. Fairs are unpaginated: one page of 100
  // city fairs is the whole set for any real city.
  const rows: CityItineraryRow[] = [
    ...followedFairs.map((fair) => ({ kind: "fair" as const, fair })),
    ...shows.map((show) => ({ kind: "show" as const, show })),
  ]

  // Two named sections, not one flat list: unlike CityEventListScreen this screen has no
  // neighbourhood/week grouping of its own to lend the map's filter pills, but it does have
  // two kinds of place worth telling apart on a map that mixes them. "All / Fairs / Shows"
  // pills are a real filter here, so this is not an accident of the shared shape.
  //
  // Reuses fairsToMapSections/showsToMapSections unchanged: both already take a
  // CityEventSection<T>[], so wrapping this screen's flat arrays in one single-section list
  // each is enough, with no need to fork or extend either adapter.
  //
  // Shows are paginated twenty at a time (see fetchData above) and fairs are not, so the
  // map only ever shows the shows pulled in so far — the same page the list has loaded, not
  // every saved show in the city. That is an honest reflection of what is on screen, not a
  // silent gap: no "showing X of Y" is possible here, since this connection does not fetch
  // totalCount. Triggering further pagination when the map opens was considered and rejected
  // for this task — it would mean fetching pages of shows the list hasn't scrolled to only to
  // populate a map, which is a bigger behavioural change than "add a map" calls for.
  const mapSections = useMemo(() => {
    const sections: MapSection[] = []

    if (followedFairs.length > 0) {
      sections.push(...fairsToMapSections([{ id: "fairs", title: "Fairs", items: followedFairs }]))
    }

    if (shows.length > 0) {
      // Relay's fragment result is a readonly array; CityEventSection<T> wants a plain T[],
      // so it is copied rather than cast.
      sections.push(...showsToMapSections([{ id: "shows", title: "Shows", items: [...shows] }]))
    }

    return sections
  }, [followedFairs, shows])

  const hasMappablePlaces = useMemo(
    () => mapSections.some((mapSection) => mapSection.places.length > 0),
    [mapSections]
  )

  if (rows.length === 0) {
    return (
      <Flex px={2} py={2}>
        <SimpleMessage>
          {`You haven’t saved anything in ${cityName} yet. When you save shows and fairs, they will show up here.`}
        </SimpleMessage>
      </Flex>
    )
  }

  return (
    <Flex flex={1}>
      {isMapView ? (
        <MapView
          sections={mapSections}
          selectedPlaceId={selectedPlaceId}
          onSelectPlace={setSelectedPlaceId}
          // This screen has no in-flow header of its own (unlike the itinerary, which
          // the 60 default is tuned for) — it sits under a static native header, which
          // already reserves its own space above this view. No extra clearance needed
          // beyond the safe-area inset MapView already adds.
          pillsTopOffset={0}
        />
      ) : (
        <FlashList<CityItineraryRow>
          data={rows}
          keyExtractor={(row) =>
            row.kind === "fair" ? `fair-${row.fair.id}` : `show-${row.show.id}`
          }
          getItemType={(row) => row.kind}
          renderItem={({ item }) =>
            item.kind === "fair" ? renderFairRow(item.fair) : renderShowRow(item.show)
          }
          onScroll={isCloseToBottom(fetchData)}
          ListFooterComponent={fetchingNextPage ? <Spinner style={{ marginVertical: 20 }} /> : null}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        />
      )}

      {/*
        Hidden with nothing to map: with zero valid places the camera target is undefined
        and the map opens on Mapbox's world view rather than framing anything, exactly the
        gate CityEventListScreen uses.
      */}
      {!!hasMappablePlaces && (
        <MotiView
          from={{ opacity: 0.5, translateY: 0 }}
          animate={{ opacity: 1, translateY: -60 }}
          transition={{ type: "timing", duration: 300, delay: 200 }}
        >
          <Flex
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              bottom: -50,
              zIndex: 1000,
            }}
          >
            <Button
              testID="city-saved-list-view-toggle"
              size="small"
              onPress={() => {
                trackEntity({
                  action_name: isMapView
                    ? Schema.ActionNames.CityGuideShowList
                    : Schema.ActionNames.CityGuideShowMap,
                  action_type: Schema.ActionTypes.Tap,
                  owner_type: Schema.OwnerEntityTypes.CityGuide,
                  owner_slug: citySlug,
                })
                setIsMapView((current) => !current)
              }}
            >
              {isMapView ? "Show in List" : "Show on Map"}
            </Button>
          </Flex>
        </MotiView>
      )}
    </Flex>
  )
}

const citySavedListFragment = graphql`
  fragment CitySavedList_me on Me
  @refetchable(queryName: "CitySavedListPaginationQuery")
  @argumentDefinitions(
    citySlug: { type: "String!" }
    count: { type: "Int", defaultValue: 20 }
    cursor: { type: "String", defaultValue: "" }
  ) {
    followsAndSaves {
      shows: showsConnection(
        first: $count
        status: RUNNING_AND_UPCOMING
        dayThreshold: 365
        city: $citySlug
        after: $cursor
      ) @connection(key: "CitySavedList_shows") {
        edges {
          node {
            ...CityGuideShow_show
          }
        }
      }
    }
  }
`

interface CitySavedListProps {
  citySlug: string
}

export const CitySavedListScreenQuery = graphql`
  query CitySavedListQuery($citySlug: String!) {
    me {
      ...CitySavedList_me @arguments(citySlug: $citySlug)
    }
    city(slug: $citySlug) {
      name
      fairsConnection(first: 100, status: RUNNING_AND_UPCOMING, sort: START_AT_ASC) {
        edges {
          node {
            ...CityGuideFair_fair
          }
        }
      }
    }
  }
`

export const CitySavedListQueryRenderer: React.FC<CitySavedListProps> = withSuspense({
  Component: ({ citySlug }) => {
    const data = useLazyLoadQuery<CitySavedListQuery>(CitySavedListScreenQuery, { citySlug })

    if (!data.me || !data.city) {
      return null
    }

    return (
      <CitySavedList
        me={data.me}
        cityName={data.city.name ?? ""}
        citySlug={citySlug}
        city={data.city}
      />
    )
  },
  ErrorFallback: (fallbackProps) => (
    <LoadFailureView
      onRetry={fallbackProps.resetErrorBoundary}
      useSafeArea={false}
      showCloseButton
      error={fallbackProps.error}
      showBackButton
      trackErrorBoundary={false}
    />
  ),
  LoadingFallback: () => (
    <Flex flex={1} alignItems="center" justifyContent="center" testID="placeholder">
      <Spinner />
    </Flex>
  ),
})

const tracks = {
  trackScreen: (citySlug: string) => ({
    context_screen: Schema.PageNames.CityGuideSavedList,
    context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
    context_screen_owner_slug: citySlug,
    context_screen_owner_id: citySlug,
  }),
}

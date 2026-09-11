import { Button, Flex, Screen, SimpleMessage, Text } from "@artsy/palette-mobile"
import { CityEventListScreenQuery } from "__generated__/CityEventListScreenQuery.graphql"
import { CityGuideFair_fair$key } from "__generated__/CityGuideFair_fair.graphql"
import { CityGuideShow_show$key } from "__generated__/CityGuideShow_show.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { renderFairRow, renderShowRow } from "app/Scenes/CityGuide/Components/CityEventRows"
import { CityEventSectionHeader } from "app/Scenes/CityGuide/Components/CityEventSectionHeader"
import { MapView } from "app/Scenes/CityGuide/Components/Map/MapView"
import {
  CityEventListItem,
  toCityEventListItems,
} from "app/Scenes/CityGuide/Screens/CityEventList/utils/cityEventListItems"
import { cityGuideFairFragment } from "app/Scenes/CityGuide/utils/CityGuideFair"
import { cityGuideShowFragment } from "app/Scenes/CityGuide/utils/CityGuideShow"
import {
  CityEventSectionKey,
  parseCityEventSection,
} from "app/Scenes/CityGuide/utils/cityEventSectionKey"
import {
  CityEventSection,
  groupByNeighborhood,
  groupByOpeningWeek,
} from "app/Scenes/CityGuide/utils/cityEventSections"
import { fairsToMapSections } from "app/Scenes/CityGuide/utils/fairsToMapSections"
import { showsToMapSections } from "app/Scenes/CityGuide/utils/showsToMapSections"
import { Fair, Show } from "app/Scenes/CityGuide/utils/types"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { Schema } from "app/utils/track"
import { DateTime } from "luxon"
import { MotiView } from "moti"
import { useCallback, useEffect, useMemo, useState } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"

const PAGE_SIZE = 100

const TITLES: Record<CityEventSectionKey, string> = {
  fairs: "Current Fairs",
  shows: "Current Shows",
  opening: "Opening Soon",
}

interface Props {
  citySlug: string
  /** Raw route parameter. Parsed, never trusted: a deep link can carry any string. */
  section: string
}

type Event = Show | Fair

const CityEventList: React.FC<Props> = ({ citySlug, section: rawSection }) => {
  const section = parseCityEventSection(rawSection)
  const { trackEvent } = useTracking<Schema.PageView>()

  const data = useLazyLoadQuery<CityEventListScreenQuery>(Query, {
    citySlug,
    includeFairs: section === "fairs",
    includeShows: section !== "fairs",
    showStatus: section === "opening" ? "UPCOMING" : "RUNNING",
  })

  const [collapsedSectionIds, setCollapsedSectionIds] = useState<Set<string>>(new Set())
  const [isMapView, setIsMapView] = useState(false)
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const { trackEvent: trackEntity } = useTracking<Schema.Entity>()

  // Android's hardware back has to agree with the on-screen one, or the two disagree about
  // whether the map is a mode or a screen. Returning false lets it pop as usual.
  useBackHandler(
    useCallback(() => {
      if (isMapView) {
        setIsMapView(false)
        return true
      }

      return false
    }, [isMapView])
  )

  const cityName = data.city?.name ?? ""

  const fairs = useFragment<CityGuideFair_fair$key>(
    cityGuideFairFragment,
    extractNodes(data.city?.fairsConnection)
  )
  const shows = useFragment<CityGuideShow_show$key>(
    cityGuideShowFragment,
    extractNodes(data.city?.showsConnection)
  )

  const totalCount =
    (section === "fairs"
      ? data.city?.fairsConnection?.totalCount
      : data.city?.showsConnection?.totalCount) ?? 0

  const sections: CityEventSection<Event>[] = useMemo(() => {
    if (section === "fairs") {
      return groupByNeighborhood<Fair>(fairs, citySlug, cityName)
    }

    if (section === "opening") {
      return groupByOpeningWeek<Show>(shows, DateTime.now())
    }

    return groupByNeighborhood<Show>(shows, citySlug, cityName)
  }, [section, fairs, shows, citySlug, cityName])

  const items = useMemo(
    () => toCityEventListItems(sections, collapsedSectionIds),
    [sections, collapsedSectionIds]
  )

  // Cast the same way `renderItem` already does below: `sections` is generic over
  // `Show | Fair`, but each branch of the `section` switch above only ever populated it
  // with one of the two.
  const mapSections = useMemo(
    () =>
      section === "fairs"
        ? fairsToMapSections(sections as CityEventSection<Fair>[])
        : showsToMapSections(sections as CityEventSection<Show>[]),
    [section, sections]
  )

  const hasMappablePlaces = useMemo(
    () => mapSections.some((mapSection) => mapSection.places.length > 0),
    [mapSections]
  )

  const toggleSection = useCallback((sectionId: string) => {
    setCollapsedSectionIds((collapsed) => {
      const next = new Set(collapsed)

      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }

      return next
    })
  }, [])

  const renderItem = useCallback(
    ({ item }: { item: CityEventListItem<Event> }) => {
      if (item.kind === "header") {
        return (
          <CityEventSectionHeader
            title={item.title}
            isExpanded={item.isExpanded}
            onToggle={() => toggleSection(item.sectionId)}
          />
        )
      }

      return section === "fairs"
        ? renderFairRow(item.item as Fair)
        : renderShowRow(item.item as Show)
    },
    [section, toggleSection]
  )

  // Counted from what the query returned, never from the flattened list: collapsing a
  // section removes rows from `items` and would otherwise render "Showing 0 of 143".
  const fetchedCount = section === "fairs" ? fairs.length : shows.length

  useEffect(() => {
    trackEvent(tracks.screen(section, citySlug))
  }, [trackEvent, section, citySlug])

  return (
    <Screen>
      {/*
        Screen.AnimatedHeader and Screen.StickySubHeader are both driven by scroll events
        from Screen.FlatList (`Screen.useListenForScreenScroll`). Map mode has no scroll
        view feeding them, so rather than leave them frozen mid-animation they are
        swapped for a plain `Screen.Header` below — the same trade the itinerary screen's
        map mode already made.
      */}
      {!isMapView ? (
        <>
          <Screen.AnimatedHeader title={TITLES[section]} onBack={goBack} />
          <Screen.StickySubHeader title={TITLES[section]} />
        </>
      ) : (
        <Screen.Header
          title={TITLES[section]}
          // On the map, back means "back to the list" rather than leaving the screen. The
          // map is a mode of this screen, not a screen of its own.
          onBack={() => setIsMapView(false)}
        />
      )}

      <Screen.Body fullwidth>
        {items.length === 0 ? (
          <Flex px={2} py={2}>
            <SimpleMessage>
              {`There is nothing to show here yet. Check back later to see events in ${cityName}.`}
            </SimpleMessage>
          </Flex>
        ) : isMapView ? (
          <MapView
            sections={mapSections}
            selectedPlaceId={selectedPlaceId}
            onSelectPlace={setSelectedPlaceId}
            // The itinerary's default (60) is tuned for its own transparent, headerless
            // map. Here a solid Screen.Header already occupies the space above the map,
            // so the pills need no extra clearance beyond the safe-area inset MapView
            // already adds.
            pillsTopOffset={0}
          />
        ) : (
          <Screen.FlatList<CityEventListItem<Event>>
            data={items}
            renderItem={renderItem}
            keyExtractor={cityEventListKey}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
            ListFooterComponent={
              totalCount > PAGE_SIZE ? (
                <Flex py={2}>
                  <Text variant="xs" color="mono60">
                    {`Showing ${fetchedCount} of ${totalCount}`}
                  </Text>
                </Flex>
              ) : null
            }
          />
        )}

        {/*
          Hidden with nothing to map: with zero valid places the camera target is
          undefined and the map opens on Mapbox's world view rather than framing anything.
        */}
        {items.length > 0 && !!hasMappablePlaces && (
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
                testID="city-event-list-view-toggle"
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
      </Screen.Body>
    </Screen>
  )
}

/**
 * Headers key on the section id, rows on the entity id. Both are stable across a collapse,
 * which shifts every index below the toggled header.
 */
const cityEventListKey = (item: CityEventListItem<Event>) =>
  item.kind === "header" ? `header-${item.sectionId}` : `row-${item.item.id}`

const Query = graphql`
  query CityEventListScreenQuery(
    $citySlug: String!
    $includeFairs: Boolean!
    $includeShows: Boolean!
    $showStatus: EventStatus!
  ) {
    city(slug: $citySlug) {
      name

      fairsConnection(first: 100, status: RUNNING, sort: START_AT_ASC) @include(if: $includeFairs) {
        totalCount
        edges {
          node {
            ...CityGuideFair_fair
          }
        }
      }

      showsConnection(
        first: 100
        status: $showStatus
        dayThreshold: 14
        sort: START_AT_ASC
        includeStubShows: false
      ) @include(if: $includeShows) {
        totalCount
        edges {
          node {
            ...CityGuideShow_show
          }
        }
      }
    }
  }
`

/**
 * Follows `CitySectionList`'s own `tracks` shape (`CitySectionList.tsx:249-273`) rather than
 * inventing new event names. `CityGuideShowsList` is a new page name (added alongside this
 * screen) because no existing value covers "Current Shows" the way `CityGuideFairsList` and
 * `CityGuideOpeningSoonList` already cover the other two sections.
 */
const tracks = {
  screen: (section: CityEventSectionKey, citySlug: string) => {
    const contextScreen = {
      fairs: Schema.PageNames.CityGuideFairsList,
      shows: Schema.PageNames.CityGuideShowsList,
      opening: Schema.PageNames.CityGuideOpeningSoonList,
    }[section]

    return {
      context_screen: contextScreen,
      context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
      context_screen_owner_slug: citySlug,
      context_screen_owner_id: citySlug,
    }
  },
}

export const CityEventListScreen = withSuspense({
  Component: CityEventList,
  LoadingFallback: SpinnerFallback,
  ErrorFallback: (fallbackProps) => (
    <LoadFailureView error={fallbackProps.error} onRetry={fallbackProps.resetErrorBoundary} />
  ),
})

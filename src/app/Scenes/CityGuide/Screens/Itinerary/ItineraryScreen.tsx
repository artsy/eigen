import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { EditIcon } from "@artsy/icons/native"
import {
  BackButtonWithBackground,
  Button,
  Flex,
  Join,
  Screen,
  Spacer,
  Text,
  Touchable,
} from "@artsy/palette-mobile"
import { ItineraryScreenQuery } from "__generated__/ItineraryScreenQuery.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { useToast } from "app/Components/Toast/toastHook"
import { ACCESSIBLE_DEFAULT_ICON_SIZE, BACK_BUTTON_SIZE_SIZE } from "app/Components/constants"
import { AddToItineraryProvider } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItineraryProvider"
import { ItineraryEditSheet } from "app/Scenes/CityGuide/Components/ItineraryEditSheet"
import { ItineraryPicker } from "app/Scenes/CityGuide/Components/ItineraryPicker"
import { MapView } from "app/Scenes/CityGuide/Components/Map/MapView"
import { ItineraryHeader } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryHeader"
import { ItinerarySectionRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySectionRow"
import { ItineraryShareButton } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryShareButton"
import { useReorderItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/hooks/useReorderItineraryStop"
import { itineraryStopsToMapSections } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopsToMapSections"
import {
  ItineraryScrollHandlers,
  Itinerary as ItineraryData,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { moveStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/reorderStops"
import { goBack } from "app/system/navigation/navigate"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { MotiView } from "moti"
import { useCallback, useMemo, useRef, useState } from "react"
import { RefreshControl, ScrollView } from "react-native"
import { DraxProvider } from "react-native-drax"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { fetchQuery, graphql, useLazyLoadQuery, useRelayEnvironment } from "react-relay"
import { useTracking } from "react-tracking"

/** Screen.Header's bar height (palette Screen/constants.js:5), not exported from the package root. */
const NAVBAR_HEIGHT = 50

// The Share button sits directly to the right of this one with only a small gap between them
// (FIREWORKS-48, see ItineraryShareButton's own SHARE_HIT_SLOP). A full hitSlop would reach past
// that gap — and into Share's own button — so the right side is left untouched here.
const EDIT_HIT_SLOP = { top: 20, bottom: 20, left: 20, right: 0 }

/**
 * Applies a section's locally-dragged stop order on top of the itinerary Relay handed back,
 * without waiting on a refetch. `stopOrder` maps a section id to the stop ids in their new
 * order; a stop added since the drag (or one this map doesn't mention) keeps its place at the
 * end rather than disappearing.
 */
const withStopOrder = (
  itinerary: ItineraryData,
  stopOrder: ReadonlyMap<string, readonly string[]>
): ItineraryData => ({
  ...itinerary,
  sections: itinerary.sections.map((section) => {
    const order = stopOrder.get(section.internalID)

    if (!order) return section

    const byID = new Map(section.stops.map((stop) => [stop.internalID, stop]))
    const ordered = order
      .map((stopID) => byID.get(stopID))
      .filter((stop): stop is (typeof section.stops)[number] => !!stop)
    const orderedIDs = new Set(ordered.map((stop) => stop.internalID))
    const unordered = section.stops.filter((stop) => !orderedIDs.has(stop.internalID))

    return { ...section, stops: [...ordered, ...unordered] }
  }),
})

interface Props {
  citySlug: string
  itineraryId: string
  /**
   * Present when this screen was opened from a shared link to somebody else's personal
   * itinerary — `Query.itinerary` needs it to resolve one that isn't yours or curated, per
   * the schema: "Gravity returns 404 without it."
   */
  shareToken?: string
}

const Itinerary: React.FC<Props> = ({ citySlug, itineraryId, shareToken }) => {
  // An itinerary is addressed by its own id or slug and carries its city; `citySlug` only
  // looks the city's name up, for what a new itinerary is called when a custom stop is copied.
  const data = useLazyLoadQuery<ItineraryScreenQuery>(
    itineraryQuery,
    {
      id: itineraryId,
      citySlug,
      shareToken,
    },
    { fetchPolicy: "network-only" }
  )

  const itinerary = data.itinerary
  const [isMapView, setIsMapView] = useState(false)
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const environment = useRelayEnvironment()
  const [isRefreshing, setIsRefreshing] = useState(false)
  // A section id's entry is only ever the order a drag left it in this session — never
  // refetched into, since a pull-to-refresh should show the server's own order again.
  const [stopOrder, setStopOrder] = useState<ReadonlyMap<string, readonly string[]>>(new Map())
  const reorderItineraryStop = useReorderItineraryStop()
  const { show: showToast } = useToast()
  const { trackEvent: trackCohesionEvent } = useTracking()

  /*
    Every section drags within the one scroll view below, so each registers its own drax
    listeners here instead of owning a scroll view of its own. Plain react-native's
    `ScrollView` rather than palette's `Screen.ScrollView`: that one leaves `ref` off its
    props type and folds a caller's `onScroll` into its own handler, and drax needs both.
  */
  const scrollRef = useRef<ScrollView>(null)
  const scrollHandlers = useRef(new Map<string, ItineraryScrollHandlers>())
  const registerScrollHandlers = useCallback(
    (sectionID: string, handlers: ItineraryScrollHandlers | null) => {
      if (handlers) {
        scrollHandlers.current.set(sectionID, handlers)
      } else {
        scrollHandlers.current.delete(sectionID)
      }
    },
    []
  )

  /*
    Refetched via `fetchQuery`, not by bumping fetchKey — a network-only re-render would
    suspend the screen and blank the guide mid-pull instead of updating it in place.
  */
  const refresh = useCallback(async () => {
    setIsRefreshing(true)

    try {
      await fetchQuery<ItineraryScreenQuery>(
        environment,
        itineraryQuery,
        { id: itineraryId, citySlug, shareToken },
        { fetchPolicy: "network-only" }
      ).toPromise()
      // The refetch carries the server's own order, so any local drag this session applied
      // on top of the old data would otherwise linger and fight it.
      setStopOrder(new Map())
    } catch {
      // Keep the current itinerary visible when a refresh fails.
    } finally {
      setIsRefreshing(false)
    }
  }, [environment, itineraryId, citySlug, shareToken])

  const handleReorderStop = useCallback(
    async (sectionID: string, stopID: string, fromIndex: number, toIndex: number) => {
      if (!itinerary) return

      // `fromIndex`/`toIndex` are indices into the section as displayed — any earlier drag
      // this session already applied — so the section and its previous order must come from
      // that same displayed itinerary, not the raw one.
      const displayed = withStopOrder(itinerary, stopOrder)
      const section = displayed.sections.find((candidate) => candidate.internalID === sectionID)

      if (!section) return

      const previousOrder = section.stops.map((stop) => stop.internalID)
      const nextOrder = moveStop(previousOrder, fromIndex, toIndex)

      setStopOrder((current) => new Map(current).set(sectionID, nextOrder))

      try {
        // `acts_as_list`'s `insert_at` is 1-indexed; `toIndex` here is a plain array index.
        await reorderItineraryStop(stopID, toIndex + 1)
      } catch {
        setStopOrder((current) => new Map(current).set(sectionID, previousOrder))
        showToast("Could not reorder that stop, try again", "bottom", { backgroundColor: "red100" })
      }
    },
    [itinerary, stopOrder, reorderItineraryStop, showToast]
  )

  // Android's hardware back has to agree with the on-screen one, or the two disagree
  // about whether the map is a mode or a screen. Returning false lets it pop as usual.
  useBackHandler(
    useCallback(() => {
      if (isMapView) {
        setIsMapView(false)
        return true
      }

      return false
    }, [isMapView])
  )
  const { top } = useSafeAreaInsets()

  // Computed ahead of the null check to keep hook order stable.
  const mapSections = useMemo(
    () =>
      itinerary
        ? itineraryStopsToMapSections(
            withStopOrder(itinerary, stopOrder),
            citySlug,
            data.city?.name ?? ""
          )
        : [],
    [itinerary, stopOrder, citySlug, data.city?.name]
  )

  if (!itinerary) {
    return (
      <Screen>
        <Screen.Header onBack={goBack} />
        <Screen.Body>
          <Flex flex={1} alignItems="center" justifyContent="center">
            <Text variant="sm">This guide is no longer available.</Text>
          </Flex>
        </Screen.Body>
      </Screen>
    )
  }

  // Your own itinerary shows no order: it is an unordered list, so numbering would be noise.
  // A curated guide keeps it.
  const isEditorial = itinerary.isCurated
  // `isMine` alone isn't enough: a curated guide can be "mine" too, since gravity makes its
  // editor the owner. Editing and reordering are for personal itineraries only.
  // Cross-section drag isn't possible regardless: `updateItineraryStopInput` has no section
  // field, so a stop's section is fixed at creation.
  const canEdit = !!itinerary.isMine && !itinerary.isCurated
  const canReorder = canEdit
  // A section with nothing in it is nothing to show — not even its heading. Emptying one by
  // removing its last stop leaves it behind on the itinerary, so this is the common case.
  const sections = withStopOrder(itinerary, stopOrder).sections.filter(
    (section) => section.stops.length > 0
  )
  /*
    A guide always names its days. Your own itinerary usually has just the one section, whose
    name would be a redundant subheading over the whole list — but once it has several (a
    guide copied onto it brings its days along) they need their headings to be told apart.
  */
  const showSectionHeaders = isEditorial || sections.length > 1

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.cityGuideGuide,
        context_screen_owner_id: itinerary.internalID,
        context_screen_owner_slug: itinerary.slug ?? undefined,
      })}
    >
      <AddToItineraryProvider
        citySlug={itinerary.citySlug}
        cityName={data.city?.name ?? undefined}
        onSaved={refresh}
      >
        <Screen safeArea={false}>
          {/*
            The map fills the screen, so it gets a floating back button rather than a header
            bar: Screen.Header paints a solid background and can't be made transparent.
          */}
          {/* {!isMapView && <Screen.AnimatedHeader title={itinerary.title} hideLeftElements hideTitle />} */}

          <Flex
            style={{ top, position: "absolute", zIndex: 1000 }}
            // Screen.Header centres its back button inside a NAVBAR_HEIGHT bar at px={2} —
            // matching both keeps the button from jumping between list and map.
            height={NAVBAR_HEIGHT}
            justifyContent="center"
            px={2}
            // Always full width now: the share button sits on the right in both list and map
            // mode, not just when the map's itinerary picker is there too.
            left={0}
            right={0}
          >
            {/*
              On the map, back means "back to the list", not "leave the guide" — the map is a
              mode of this screen, not a screen of its own.
            */}
            <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
              <BackButtonWithBackground
                onPress={() => {
                  if (isMapView) {
                    setIsMapView(false)
                    return
                  }

                  goBack()
                }}
              />

              <Flex flexDirection="row" alignItems="center" gap={1}>
                {/*
                  Only on the map, and only for your own itineraries — the picker switches
                  between yours, so it has nothing to offer on a curated guide.
                */}
                {!!isMapView && !isEditorial && (
                  <ItineraryPicker
                    citySlug={itinerary.citySlug}
                    currentItineraryId={itinerary.internalID}
                    currentItineraryName={itinerary.title}
                  />
                )}

                {/*
                  Only for your own personal itinerary — never a curated guide, even one "mine"
                  because gravity made its editor the owner.
                */}
                {!!canEdit && (
                  <Touchable
                    testID="itinerary-edit"
                    accessibilityRole="button"
                    accessibilityLabel={`Edit ${itinerary.title}`}
                    onPress={() => setIsEditing(true)}
                    hitSlop={EDIT_HIT_SLOP}
                  >
                    <Flex
                      backgroundColor="background"
                      width={BACK_BUTTON_SIZE_SIZE}
                      height={BACK_BUTTON_SIZE_SIZE}
                      borderRadius={BACK_BUTTON_SIZE_SIZE / 2}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <EditIcon
                        fill="onBackgroundHigh"
                        width={ACCESSIBLE_DEFAULT_ICON_SIZE}
                        height={ACCESSIBLE_DEFAULT_ICON_SIZE}
                      />
                    </Flex>
                  </Touchable>
                )}

                <ItineraryShareButton itinerary={itinerary} />
              </Flex>
            </Flex>
          </Flex>

          <Screen.Body fullwidth>
            {isMapView ? (
              <MapView
                sections={mapSections}
                citySlug={citySlug}
                selectedPlaceId={selectedStopId}
                onSelectPlace={setSelectedStopId}
                safeArea
              />
            ) : (
              // Scoped to this screen rather than the app root: the provider keeps all its
              // state in its own context and measures drag positions against its own root
              // view, so the dragged row floats over the list and nothing else.
              <DraxProvider>
                <ScrollView
                  ref={scrollRef}
                  scrollEventThrottle={16}
                  onScroll={(event) => {
                    scrollHandlers.current.forEach((handlers) => handlers.onScroll(event))
                  }}
                  onContentSizeChange={(width, height) => {
                    scrollHandlers.current.forEach((handlers) =>
                      handlers.onContentSizeChange(width, height)
                    )
                  }}
                  // Tied to the map button's `bottom: -50` / `translateY: -60` below:
                  // changing those offsets changes this gap too.
                  contentContainerStyle={{ paddingBottom: 60 }}
                  refreshControl={
                    <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={refresh}
                      // Without this, the spinner sits right under the floating back/share bar
                      // above (`top` to `top + NAVBAR_HEIGHT`), which paints over it.
                      progressViewOffset={top + NAVBAR_HEIGHT}
                    />
                  }
                >
                  <ItineraryHeader itinerary={itinerary} topInset={top + NAVBAR_HEIGHT} />

                  <Flex px={2} pt={2}>
                    <Join separator={<Spacer y={2} />}>
                      {sections.map((section, index) => (
                        <ItinerarySectionRow
                          key={section.internalID}
                          section={section}
                          sectionIndex={index}
                          showHeader={showSectionHeaders}
                          citySlug={itinerary.citySlug}
                          itineraryId={itineraryId}
                          itinerarySlug={itinerary.slug ?? undefined}
                          shareToken={shareToken}
                          cityName={data.city?.name ?? ""}
                          isCuratedGuide={isEditorial}
                          canReorder={canReorder}
                          scrollRef={scrollRef}
                          registerScrollHandlers={registerScrollHandlers}
                          onReorderStop={handleReorderStop}
                        />
                      ))}
                    </Join>
                  </Flex>
                </ScrollView>
              </DraxProvider>
            )}

            {/*
              Positioning copied from CityGuideFloatingMapButton for matching height. Not
              reused directly since that component hardcodes a navigate to /local-discovery.
            */}
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
                  testID="itinerary-view-toggle"
                  size="small"
                  onPress={() => {
                    trackCohesionEvent({
                      action: ActionType.tappedNavigationTab,
                      context_module: ContextModule.cityGuideMapToggle,
                      context_screen_owner_type: OwnerType.cityGuideGuide,
                      context_screen_owner_id: itinerary.internalID,
                      context_screen_owner_slug: itinerary.slug ?? undefined,
                      subject: isMapView ? "list" : "map",
                    })
                    setIsMapView((current) => !current)
                  }}
                >
                  {isMapView ? "Show in List" : "Show in Map"}
                </Button>
              </Flex>
            </MotiView>
          </Screen.Body>
        </Screen>

        {!!isEditing && (
          <ItineraryEditSheet
            visible
            onClose={() => setIsEditing(false)}
            itinerary={{
              internalID: itinerary.internalID,
              name: itinerary.title,
              description: itinerary.description,
            }}
            citySlug={itinerary.citySlug}
            // The guide is gone once deleted — leave, rather than refetch it. The itineraries
            // list is evicted separately, by the sheet's own delete mutation updater, since this
            // screen doesn't own that list's Relay connection.
            onDeleted={goBack}
          />
        )}
      </AddToItineraryProvider>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export const itineraryQuery = graphql`
  query ItineraryScreenQuery($id: String!, $citySlug: String!, $shareToken: String) {
    city(slug: $citySlug) {
      name
    }

    itinerary(id: $id, shareToken: $shareToken) {
      internalID
      isCurated
      isMine
      citySlug
      title
      description
      slug
      shareToken
      ...ItineraryHeader_itinerary
      ...ItineraryShareButton_itinerary

      sections {
        internalID
        title

        stops {
          internalID
          title
          address
          category
          note
          isFreeAdmission
          sourceURL
          eventType
          image {
            url(version: "small")
            blurhash
          }
          isOnMyItineraries
          myItineraries {
            internalID
          }

          event {
            __typename
            ... on ShowEventType {
              title
              eventType
              startAtISO: startAt
            }
            ... on FairEvent {
              name
              startAtISO: startAt
            }
          }
          latitude
          longitude

          startTime: startAt(format: "h:mma")
          endTime: endAt(format: "h:mma")

          startAtISO: startAt
          endAtISO: endAt

          item {
            __typename
            ... on Show {
              internalID
              slug
              name
              href
              isFreeAdmission
              exhibitionPeriod(format: SHORT)
              coverImage {
                url
                blurhash
              }
              partner {
                ... on Partner {
                  name
                }
                ... on ExternalPartner {
                  name
                }
              }
              location {
                name
                city
                coordinates {
                  lat
                  lng
                }
              }
            }
            ... on Fair {
              internalID
              slug
              name
              href
              exhibitionPeriod(format: SHORT)
              image {
                url
                blurhash
              }
              location {
                name
                city
                coordinates {
                  lat
                  lng
                }
              }
            }
            ... on Location {
              internalID
              name
              city
              address
              coordinates {
                lat
                lng
              }
              partner {
                slug
                name
                href
                profile {
                  image {
                    url
                    blurhash
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export const ItineraryScreen = withSuspense({
  Component: Itinerary,
  LoadingFallback: SpinnerFallback,
  ErrorFallback: (fallbackProps) => (
    <LoadFailureView error={fallbackProps.error} onRetry={fallbackProps.resetErrorBoundary} />
  ),
})

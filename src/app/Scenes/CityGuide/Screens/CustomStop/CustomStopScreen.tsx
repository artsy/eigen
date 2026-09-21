import { OwnerType } from "@artsy/cohesion"
import { Flex, Image, Screen, Text, Touchable } from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { CustomStopScreenQuery } from "__generated__/CustomStopScreenQuery.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { tappedOnMap } from "app/Components/LocationMap/LocationMap"
import { AddToItineraryProvider } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItineraryProvider"
import { CustomStopSaveControl } from "app/Scenes/CityGuide/Components/CustomStopSaveControl"
import {
  CustomStop,
  customStopFromItinerary,
  customStopInput,
} from "app/Scenes/CityGuide/Screens/CustomStop/utils/customStopFromItinerary"
import { RouterLink } from "app/system/navigation/RouterLink"
import { goBack } from "app/system/navigation/navigate"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useCallback, useRef, useState } from "react"
import { RefreshControl } from "react-native"
import { fetchQuery, graphql, useLazyLoadQuery, useRelayEnvironment } from "react-relay"

const HERO_HEIGHT = 300

interface Props {
  citySlug: string
  itineraryId: string
  stopId: string
}

const StopAddress: React.FC<{ stop: CustomStop }> = ({ stop }) => {
  const { showActionSheetWithOptions } = useActionSheet()

  if (!stop.address) {
    return null
  }

  return (
    <Flex backgroundColor="mono5" px={2} py={1}>
      <Touchable
        testID="custom-stop-address"
        accessibilityRole="link"
        accessibilityLabel={`Get directions to ${stop.address}`}
        onPress={() =>
          showActionSheetWithOptions(
            ...tappedOnMap(
              stop.coordinates?.lat,
              stop.coordinates?.lng,
              stop.address,
              undefined,
              stop.title,
              undefined,
              undefined
            )
          )
        }
      >
        <Text variant="sm" underline>
          {stop.address}
        </Text>
      </Touchable>
    </Flex>
  )
}

const Stop: React.FC<Props> = ({ citySlug, itineraryId, stopId }) => {
  const data = useLazyLoadQuery<CustomStopScreenQuery>(Query, { itineraryId, citySlug })

  /*
    Held rather than re-derived on every store change. A stop has no `id` in the schema — only
    `Itinerary` does — so Relay keys one positionally, as
    `client:<itinerary id>:sections:0:stops:3`. Anything that refetches this itinerary with a
    changed stop list rewrites those slots with their neighbours' data, and this stop's id
    stops matching. Adding a stop from this very screen did exactly that.
  */
  const lastResolved = useRef<CustomStop | null>(null)
  const stop = customStopFromItinerary(data.itinerary, stopId) ?? lastResolved.current

  if (stop) lastResolved.current = stop

  const environment = useRelayEnvironment()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Through `fetchQuery`, not this query's fetchKey: a network-only re-render would suspend
  // and replace the screen with a spinner.
  const refresh = useCallback(() => {
    setIsRefreshing(true)

    fetchQuery<CustomStopScreenQuery>(
      environment,
      Query,
      { itineraryId, citySlug },
      { fetchPolicy: "network-only" }
    ).subscribe({
      complete: () => setIsRefreshing(false),
      error: () => setIsRefreshing(false),
    })
  }, [environment, itineraryId, citySlug])

  if (!stop) {
    return (
      <Screen>
        <Screen.Header onBack={goBack} />
        <Screen.Body>
          <Flex flex={1} alignItems="center" justifyContent="center">
            <Text variant="sm">This stop is no longer available.</Text>
          </Flex>
        </Screen.Body>
      </Screen>
    )
  }

  const admission =
    stop.isFreeAdmission == null ? undefined : stop.isFreeAdmission ? "Free" : "Paid Entry"

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.cityGuideCustomStop,
        context_screen_owner_slug: citySlug,
      })}
    >
      <AddToItineraryProvider
        citySlug={citySlug}
        cityName={data.city?.name ?? undefined}
        onSaved={refresh}
      >
        <Screen>
          <Screen.Header onBack={goBack} />

          <Screen.Body fullwidth>
            <Screen.ScrollView
              contentContainerStyle={{ paddingBottom: 40 }}
              refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
            >
              {!!stop.imageUrl && (
                <Image
                  testID="custom-stop-image"
                  src={stop.imageUrl}
                  resizeMode="cover"
                  style={{ width: "100%", height: HERO_HEIGHT }}
                />
              )}

              <Flex px={2} pt={2} pb={1}>
                <Flex flexDirection="row" alignItems="center" gap={1}>
                  <Flex flex={1}>
                    <Text variant="lg-display">{stop.title}</Text>
                  </Flex>

                  {!!stop.category && (
                    <Flex testID="custom-stop-category" backgroundColor="mono100" px={0.5} py={0.5}>
                      <Text variant="xxs" color="mono0">
                        {stop.category}
                      </Text>
                    </Flex>
                  )}

                  {/*
                    The plus sits to the right of the title, as it does in the show header. Only
                    on a curated guide: on your own itinerary the stop is already on it.
                  */}
                  {!!data.itinerary?.isCurated && (
                    <CustomStopSaveControl
                      stop={customStopInput(stop)}
                      citySlug={citySlug}
                      cityName={data.city?.name ?? ""}
                      contextScreenOwnerType={OwnerType.cityGuideCustomStop}
                      contextScreenOwnerSlug={citySlug}
                      isCuratedGuide
                    />
                  )}
                </Flex>

                {(!!stop.hours || !!admission) && (
                  <Text variant="sm" color="mono60" mt={0.5}>
                    {[stop.hours, admission].filter(Boolean).join(" · ")}
                  </Text>
                )}
              </Flex>

              <StopAddress stop={stop} />

              {!!stop.description && (
                <Flex px={2} pt={2}>
                  <Text variant="sm">{stop.description}</Text>
                </Flex>
              )}

              {/* Leads off Artsy, so it is offered as a link rather than navigated to. */}
              {!!stop.sourceURL && (
                <Flex px={2} pt={2} alignItems="flex-start">
                  <RouterLink testID="custom-stop-source" to={stop.sourceURL}>
                    <Text variant="sm" underline>
                      More information
                    </Text>
                  </RouterLink>
                </Flex>
              )}
            </Screen.ScrollView>
          </Screen.Body>
        </Screen>
      </AddToItineraryProvider>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const Query = graphql`
  query CustomStopScreenQuery($itineraryId: String!, $citySlug: String!) {
    # The city's name, which is what a new itinerary and its section get called.
    city(slug: $citySlug) {
      name
    }

    itinerary(id: $itineraryId) {
      internalID
      isCurated

      sections {
        # Selected so this payload and the itinerary screen's agree on record identity, rather
        # than one writing narrower sections over the other's.
        internalID
        title

        stops {
          internalID
          title
          address
          category
          note
          sourceURL
          isFreeAdmission
          latitude
          longitude

          image {
            url(version: "large")
          }
          isOnMyItineraries
          myItineraries {
            internalID
          }

          startTime: startAt(format: "h:mma")
          endTime: endAt(format: "h:mma")

          item {
            __typename
          }
        }
      }
    }
  }
`

/**
 * A stop with no Artsy entity behind it — a cafe, a landmark. Everything here is the guide
 * author's own copy, since there is no entity to read from.
 *
 * Addressed by itinerary plus stop: Metaphysics has no root lookup for a single stop, so the
 * itinerary is fetched and the stop picked out of it. That payload is normally already in the
 * Relay store from the itinerary you tapped from.
 */
export const CustomStopScreen = withSuspense({
  Component: Stop,
  LoadingFallback: SpinnerFallback,
  ErrorFallback: (fallbackProps) => (
    <LoadFailureView error={fallbackProps.error} onRetry={fallbackProps.resetErrorBoundary} />
  ),
})

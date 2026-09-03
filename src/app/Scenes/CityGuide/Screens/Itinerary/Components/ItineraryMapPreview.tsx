import { Flex, Text } from "@artsy/palette-mobile"
import { ItineraryMapPreviewQuery } from "__generated__/ItineraryMapPreviewQuery.graphql"
import { ItineraryStopSaveControl } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopSaveControl"
import { itineraryStopHref } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopHref"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { RouterLink } from "app/system/navigation/RouterLink"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { graphql, useLazyLoadQuery } from "react-relay"

interface Props {
  stop: ItineraryStop
}

/**
 * The card shown over the map when a pin is tapped. The title is the guide author's,
 * but the address and dates are facts about the entity, so they are fetched. Only one
 * pin is selected at a time, so this is a single query, not one per stop.
 */
export const ItineraryMapPreview: React.FC<Props> = ({ stop }) => {
  // Shows, galleries, museums and fairs each have their own page; a non-Artsy stop has
  // none, in which case the card renders but does not navigate.
  const href = itineraryStopHref(stop.saveTarget)

  return (
    <RouterLink to={href} disableNavigation={!href}>
      <Flex backgroundColor="mono0" borderRadius={4} p={2} mx={2}>
        <Flex flexDirection="row" alignItems="center" gap={1}>
          <Flex flex={1}>
            <Text variant="sm-display" numberOfLines={1} ellipsizeMode="tail">
              {stop.title}
            </Text>

            {/*
            Details degrade to the itinerary's own time label rather than blanking the
            card, so a slow or failed lookup still leaves something readable.
          */}
            <ErrorBoundary fallbackRender={() => <FallbackDetails stop={stop} />}>
              <Suspense fallback={<FallbackDetails stop={stop} />}>
                <StopDetails stop={stop} />
              </Suspense>
            </ErrorBoundary>
          </Flex>

          {!!stop.saveTarget && (
            <ItineraryStopSaveControl saveTarget={stop.saveTarget} stopTitle={stop.title} />
          )}
        </Flex>
      </Flex>
    </RouterLink>
  )
}

const FallbackDetails: React.FC<Props> = ({ stop }) => (
  <Text variant="xs" color="mono60">
    {stop.displayTime}
  </Text>
)

const StopDetails: React.FC<Props> = ({ stop }) => {
  const isShow = stop.saveTarget?.type === "SHOW"

  const data = useLazyLoadQuery<ItineraryMapPreviewQuery>(
    ShowQuery,
    { slug: stop.saveTarget?.slug ?? "", skip: !isShow },
    { fetchPolicy: "store-or-network" }
  )

  const address = data?.show?.location?.address
  const period = data?.show?.exhibitionPeriod

  if (!address && !period) {
    return <FallbackDetails stop={stop} />
  }

  return (
    <>
      {!!address && (
        <Text variant="xs" color="mono60">
          {address}
        </Text>
      )}
      {!!period && (
        <Text variant="xs" color="mono60">
          {period}
        </Text>
      )}
    </>
  )
}

const ShowQuery = graphql`
  query ItineraryMapPreviewQuery($slug: String!, $skip: Boolean!) {
    show(id: $slug, includeAllShows: true) @skip(if: $skip) {
      exhibitionPeriod
      location {
        address
      }
    }
  }
`

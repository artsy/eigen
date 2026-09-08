import { Text } from "@artsy/palette-mobile"
import { ItineraryStopMapDetailQuery } from "__generated__/ItineraryStopMapDetailQuery.graphql"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { graphql, useLazyLoadQuery } from "react-relay"

interface Props {
  stop: ItineraryStop
}

/**
 * The detail line injected into the shared map's pin-tap card for an itinerary stop. The
 * title is the guide author's, but the address and dates are facts about the entity, so
 * they are fetched. Only one pin is selected at a time, so this is a single query, not one
 * per stop.
 */
export const ItineraryStopMapDetail: React.FC<Props> = ({ stop }) => (
  // Details degrade to the itinerary's own time label rather than blanking the card, so a
  // slow or failed lookup still leaves something readable.
  <ErrorBoundary fallbackRender={() => <FallbackDetails stop={stop} />}>
    <Suspense fallback={<FallbackDetails stop={stop} />}>
      <StopDetails stop={stop} />
    </Suspense>
  </ErrorBoundary>
)

const FallbackDetails: React.FC<Props> = ({ stop }) => (
  <Text variant="xs" color="mono60">
    {stop.displayTime}
  </Text>
)

const StopDetails: React.FC<Props> = ({ stop }) => {
  const isShow = stop.saveTarget?.type === "SHOW"

  const data = useLazyLoadQuery<ItineraryStopMapDetailQuery>(
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
  query ItineraryStopMapDetailQuery($slug: String!, $skip: Boolean!) {
    show(id: $slug, includeAllShows: true) @skip(if: $skip) {
      exhibitionPeriod
      location {
        address
      }
    }
  }
`

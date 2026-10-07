import { useItineraryFallbackImageQuery } from "__generated__/useItineraryFallbackImageQuery.graphql"
import { itineraryFallbackImage } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopFields"
import { useEffect, useState } from "react"
import { fetchQuery, graphql, useRelayEnvironment } from "react-relay"
import { createOperationDescriptor, getRequest } from "relay-runtime"

interface Options {
  itineraryID: string | null | undefined
  stopsCount?: number
  /** Set once the itinerary has a cover of its own, so nothing is fetched just to be discarded. */
  skip?: boolean
}

/**
 * The first stop's picture, for the places that list itineraries through
 * `me.itinerariesConnection`: Gravity serialises that listing at `:short`, without sections
 * (see `fetchItinerarySections`), so the stops are read per itinerary through `Query.itinerary`.
 * Only for itineraries with no cover: callers pass `skip` when they already have one.
 *
 * Doesn't suspend: a list of these would otherwise need a boundary per row. Until it resolves
 * (or if it fails) it returns undefined, and the caller keeps its placeholder.
 */
export const useItineraryFallbackImage = ({
  itineraryID,
  stopsCount,
  skip = false,
}: Options): string | undefined => {
  const environment = useRelayEnvironment()
  const [url, setUrl] = useState<string | undefined>(undefined)
  // A brand new itinerary has no stops to borrow a picture from.
  const shouldSkip = skip || !itineraryID || stopsCount === 0

  useEffect(() => {
    if (shouldSkip || !itineraryID) {
      setUrl(undefined)
      return
    }

    const pickURL = (data: useItineraryFallbackImageQuery["response"]) =>
      itineraryFallbackImage(data.itinerary?.sections ?? [])?.url

    // store-and-network, which `fetchQuery` doesn't offer: the store may be stale after a stop
    // is added, so it only shows first.
    const operation = createOperationDescriptor(getRequest(query), { id: itineraryID })
    if (environment.check(operation).status === "available") {
      const cached = environment.lookup(operation.fragment).data
      setUrl(pickURL(cached as useItineraryFallbackImageQuery["response"]))
    }

    const subscription = fetchQuery<useItineraryFallbackImageQuery>(
      environment,
      query,
      { id: itineraryID },
      { fetchPolicy: "network-only" }
    ).subscribe({
      next: (data) => setUrl(pickURL(data)),
      error: () => {
        // Keep the placeholder.
      },
    })

    return () => subscription.unsubscribe()
  }, [environment, itineraryID, shouldSkip])

  return shouldSkip ? undefined : url
}

const query = graphql`
  query useItineraryFallbackImageQuery($id: String!) {
    itinerary(id: $id) {
      sections {
        internalID
        stops {
          internalID
          ...itineraryStopFields_image
        }
      }
    }
  }
`

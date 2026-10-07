import { useItineraryFallbackImageQuery } from "__generated__/useItineraryFallbackImageQuery.graphql"
import { itineraryFallbackImage } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopFields"
import { useEffect, useState } from "react"
import { fetchQuery, graphql, useRelayEnvironment } from "react-relay"

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

    const subscription = fetchQuery<useItineraryFallbackImageQuery>(
      environment,
      query,
      { id: itineraryID },
      { fetchPolicy: "store-or-network" }
    ).subscribe({
      next: (data) => {
        setUrl(itineraryFallbackImage(data.itinerary?.sections ?? [])?.url)
      },
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

import { useItineraryFallbackImageQuery } from "__generated__/useItineraryFallbackImageQuery.graphql"
import { itineraryFallbackImage } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopFields"
import { useEffect, useState } from "react"
import { fetchQuery, graphql, useRelayEnvironment } from "react-relay"

interface Options {
  itineraryID: string | null | undefined
  stopsCount?: number
}

/**
 * The first stop's picture, for the places that list itineraries through
 * `me.itinerariesConnection`: Gravity serialises that listing at `:short`, without sections
 * (see `fetchItinerarySections`), so the stops are read per itinerary through `Query.itinerary`.
 * Fetched whether or not the itinerary has a cover; callers simply prefer the cover.
 *
 * Doesn't suspend: a list of these would otherwise need a boundary per row. Until it resolves
 * (or if it fails) it returns undefined, and the caller keeps its placeholder.
 */
export const useItineraryFallbackImage = ({
  itineraryID,
  stopsCount,
}: Options): string | undefined => {
  const environment = useRelayEnvironment()
  const [url, setUrl] = useState<string | undefined>(undefined)
  // A brand new itinerary has no stops to borrow a picture from.
  const shouldSkip = !itineraryID || stopsCount === 0

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
          ...itineraryStopFields_image @relay(mask: false)
        }
      }
    }
  }
`

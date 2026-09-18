import { fetchItinerarySectionsQuery } from "__generated__/fetchItinerarySectionsQuery.graphql"
import { fetchQuery, graphql } from "react-relay"
import { IEnvironment } from "relay-runtime"

export type ItinerarySectionDetail = NonNullable<
  fetchItinerarySectionsQuery["response"]["itinerary"]
>["sections"][number]

/**
 * An itinerary's sections and stops, read through `Query.itinerary`. `null` when the itinerary
 * itself did not resolve, which callers must tell apart from an itinerary that genuinely has
 * no sections yet: creating a "My Stops" on the strength of a failed read is what leaves an
 * itinerary with two of them.
 *
 * Never read these through `me.itinerariesConnection`: Gravity serialises that listing at
 * `:short`, which omits `sections`, so Metaphysics returns `[]` for every node — and since
 * `Itinerary`, `ItinerarySection` and `ItineraryStop` all have an `id`, Relay writes that
 * empty list onto the same record the itinerary screen renders from, blanking it.
 */
export const fetchItinerarySections = async (
  environment: IEnvironment,
  itineraryID: string
): Promise<readonly ItinerarySectionDetail[] | null> => {
  const data = await fetchQuery<fetchItinerarySectionsQuery>(
    environment,
    query,
    { id: itineraryID },
    // Never from cache: a stale "no My Stops section" answer would create a second one.
    { fetchPolicy: "network-only" }
  ).toPromise()

  return data?.itinerary?.sections ?? null
}

const query = graphql`
  query fetchItinerarySectionsQuery($id: String!) {
    itinerary(id: $id) {
      sections {
        internalID
        title
        stops {
          internalID
          title
          address
          item {
            __typename
            ... on Show {
              internalID
            }
            ... on Fair {
              internalID
            }
            ... on Location {
              internalID
            }
          }
        }
      }
    }
  }
`

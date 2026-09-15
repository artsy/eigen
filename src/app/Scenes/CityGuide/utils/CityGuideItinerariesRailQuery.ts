import { CityGuideItinerariesRailQuery } from "__generated__/CityGuideItinerariesRailQuery.graphql"
import { fetchQuery, graphql } from "react-relay"
import { Environment } from "relay-runtime"

/** Enough to fill the rail; the header leads to the full list. */
export const CITY_GUIDE_ITINERARIES_RAIL_SIZE = 10

/**
 * Reads back through the rail's own fragment (`CityGuideItinerariesRail_me`), so a refetch
 * here writes exactly the records the rail renders from, whether or not it's mounted.
 */
export const cityGuideItinerariesRailQuery = graphql`
  query CityGuideItinerariesRailQuery($citySlug: String!, $first: Int!) {
    me {
      ...CityGuideItinerariesRail_me @arguments(citySlug: $citySlug, first: $first)
    }
  }
`

/**
 * Refreshes the "Your Itineraries" rail's data from the network, for any caller that just
 * added or removed a stop — the rail's own counts are otherwise stale until its screen
 * happens to remount. Reads back through the exact query the rail renders from, so if it's
 * mounted anywhere it picks the new counts up on its own (`useLazyLoadQuery` subscribes to
 * the store); if it isn't, the fresh data is simply waiting there for next time.
 */
export const refetchCityGuideItinerariesRail = (environment: Environment, citySlug: string) =>
  fetchQuery<CityGuideItinerariesRailQuery>(
    environment,
    cityGuideItinerariesRailQuery,
    { citySlug, first: CITY_GUIDE_ITINERARIES_RAIL_SIZE },
    { fetchPolicy: "network-only" }
  ).toPromise()

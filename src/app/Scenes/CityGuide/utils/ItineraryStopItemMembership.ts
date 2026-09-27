import { graphql } from "react-relay"

/**
 * Spread on a stop mutation's payload. Relay writes the item's new `isOnMyItineraries` onto
 * its Show, Fair or Location record, so every screen showing that item updates without a
 * refetch.
 */
export const itineraryStopItemMembershipFragment = graphql`
  fragment ItineraryStopItemMembership_stop on ItineraryStop {
    item {
      ... on Show {
        isOnMyItineraries
      }
      ... on Fair {
        isOnMyItineraries
      }
      ... on Location {
        isOnMyItineraries
      }
    }
  }
`

import { BidderPositionQuery } from "__generated__/BidderPositionQuery.graphql"
import { defaultEnvironment as environment } from "lib/relay/createEnvironment"
import { fetchQuery, graphql } from "relay-runtime"

export const bidderPositionQuery = (bidderPositionID: string) => {
  return fetchQuery<BidderPositionQuery>(
    environment,
    graphql`
      query BidderPositionQuery($bidderPositionID: String!) {
        me {
          bidder_position(id: $bidderPositionID) {
            status
            message_header
            message_description_md
            position {
              internalID
              suggested_next_bid {
                cents
                display
              }
            }
          }
        }
      }
    `,
    {
      bidderPositionID,
    },
    {
      force: true,
    }
  )
}

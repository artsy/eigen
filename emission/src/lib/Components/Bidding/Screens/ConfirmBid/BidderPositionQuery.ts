import { BidderPositionQuery } from "__generated__/BidderPositionQuery.graphql"
import { defaultEnvironment as environment } from "lib/relay/createEnvironment"
import { fetchQuery, graphql } from "relay-runtime"

export const bidderPositionQuery = (bidderPositionID: string) => {
  return fetchQuery<BidderPositionQuery>(
    environment,
    graphql`
      query BidderPositionQuery($bidderPositionID: String!) {
        me {
          bidder_position: bidderPosition(id: $bidderPositionID) {
            status
            message_header: messageHeader
            message_description_md: messageDescriptionMD
            position {
              internalID
              suggested_next_bid: suggestedNextBid {
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

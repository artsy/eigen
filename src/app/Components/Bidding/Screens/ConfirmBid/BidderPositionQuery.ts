import { BidderPositionQuery } from "__generated__/BidderPositionQuery.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { fetchQuery, graphql } from "react-relay"

export const bidderPositionQuery = (bidderPositionID: string) => {
  return fetchQuery<BidderPositionQuery>(
    getRelayEnvironment(),
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
      fetchPolicy: "network-only",
    }
  ).toPromise()
}

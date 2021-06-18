import { AuctionResultForYouContainerQuery } from "__generated__/AuctionResultForYouContainerQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { createPaginationContainer, graphql, QueryRenderer } from "react-relay"
import { AuctionResultForYou } from "./AuctionResultForYou"

export const AuctionResultForYouContainer = createPaginationContainer(
  AuctionResultForYou,
  {
    me: graphql`
      fragment AuctionResultForYouContainer_me on Me
      @argumentDefinitions(first: { type: "Int", defaultValue: 10 }, after: { type: "String" }) {
        auctionResultsByFollowedArtists(first: $first, after: $after)
          @connection(key: "AuctionResultForYouContainer_auctionResultsByFollowedArtists") {
          totalCount
          edges {
            node {
              id
              artistID
              internalID
              artist {
                name
              }
              title
              currency
              dateText
              mediumText
              saleDate
              organization
              boughtIn
              priceRealized {
                cents
                display
              }
              performance {
                mid
              }
              images {
                thumbnail {
                  url
                }
              }
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props?.me?.auctionResultsByFollowedArtists
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        after: cursor,
        count,
      }
    },
    query: graphql`
      query AuctionResultForYouContainerPaginationQuery($first: Int!, $after: String) {
        me {
          ...AuctionResultForYouContainer_me @arguments(first: $first, after: $after)
        }
      }
    `,
  }
)

export const AuctionResultForYouQueryRenderer: React.FC = () => (
  <QueryRenderer<AuctionResultForYouContainerQuery>
    environment={defaultEnvironment}
    query={graphql`
      query AuctionResultForYouContainerQuery {
        me {
          ...AuctionResultForYouContainer_me
        }
      }
    `}
    variables={{}}
    cacheConfig={{
      force: true,
    }}
    render={renderWithLoadProgress(AuctionResultForYouContainer)}
  />
)

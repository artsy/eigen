
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
      {
        auctionResultsByFollowedArtists(first: 3)
             @connection(key: "AuctionResultForYouContainer_auctionResultsByFollowedArtists")
             {
       totalCount
       edges {
        cursor
        node {
          id
          title
          date(format: "MMM")
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
        cursor,
        count,
      }
    },
    getFragmentVariables(previousVariables, count) {
      return {
        ...previousVariables,
        count,
      }
    },
    query: graphql`
      query AuctionResultForYouContainerPaginationQuery{
          me{
            ...AuctionResultForYouContainer_me
          }
        }
      `
  }
)

export const AuctionResultForYouQueryRenderer: React.FC = () => (
    <QueryRenderer<AuctionResultForYouContainerQuery>
      environment={defaultEnvironment}
      query={graphql`
        query AuctionResultForYouContainerQuery{
          me{
            ...AuctionResultForYouContainer_me
          }
        }
      `}
      variables={{
      }}
      cacheConfig={{
        force: true,
      }}
      render={renderWithLoadProgress(AuctionResultForYouContainer)}
    />
)

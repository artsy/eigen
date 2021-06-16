import { LotsByArtistsYouFollow_me } from "__generated__/LotsByArtistsYouFollow_me.graphql"
import { LotsByArtistsYouFollowQuery } from "__generated__/LotsByArtistsYouFollowQuery.graphql"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Box, Message, Spacer } from "palette"
import React from "react"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"

interface LotsByArtistsYouFollowProps {
  me: LotsByArtistsYouFollow_me
  relay: RelayPaginationProp
}

export const LotsByArtistsYouFollow: React.FC<LotsByArtistsYouFollowProps> = ({ me, relay }) => {
  return (
    <PageWithSimpleHeader title="Auction lots for you">
      <Box>
        {!!me.lotsByFollowedArtistsConnection?.edges?.length ? (
          <InfiniteScrollArtworksGridContainer
            loadMore={relay.loadMore}
            hasMore={relay.hasMore}
            connection={me.lotsByFollowedArtistsConnection}
            shouldAddPadding
            HeaderComponent={<Spacer mt={2} />}
          />
        ) : (
          <Message m={2}>Nothing yet. Please check back later.</Message>
        )}
      </Box>
    </PageWithSimpleHeader>
  )
}

const LOTS_BY_ARTISTS_YOU_FOLLOW_QUERY = graphql`
  query LotsByArtistsYouFollowQuery($count: Int!, $cursor: String) {
    me {
      ...LotsByArtistsYouFollow_me @arguments(count: $count, cursor: $cursor)
    }
  }
`

export const LotsByArtistsYouFollowFragmentContainer = createPaginationContainer(
  LotsByArtistsYouFollow,
  {
    me: graphql`
      fragment LotsByArtistsYouFollow_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        lotsByFollowedArtistsConnection(first: $count, after: $cursor, liveSale: true, isAuction: true)
          @connection(key: "LotsByArtistsYouFollow_lotsByFollowedArtistsConnection") {
          edges {
            cursor
          }
          ...InfiniteScrollArtworksGrid_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps: ({ me }) => me && me.lotsByFollowedArtistsConnection,
    getVariables: (_props, { count, cursor }) => ({ count, cursor }),
    query: LOTS_BY_ARTISTS_YOU_FOLLOW_QUERY,
  }
)

export const LotsByArtistsYouFollowQueryRenderer: React.FC = () => {
  return (
    <QueryRenderer<LotsByArtistsYouFollowQuery>
      environment={defaultEnvironment}
      // tslint:disable-next-line:relay-operation-generics
      query={LOTS_BY_ARTISTS_YOU_FOLLOW_QUERY}
      variables={{
        count: 10,
      }}
      render={renderWithLoadProgress(LotsByArtistsYouFollowFragmentContainer)}
    />
  )
}

import { OwnerType } from "@artsy/cohesion"
import { NewWorksForYou_me } from "__generated__/NewWorksForYou_me.graphql"
import { NewWorksForYouQuery } from "__generated__/NewWorksForYouQuery.graphql"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Box, Message, Spacer } from "palette"
import React from "react"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"

const PAGE_SIZE = 10

interface NewWorksForYouProps {
  relay: RelayPaginationProp
  me: NewWorksForYou_me
}

const NewWorksForYou: React.FC<NewWorksForYouProps> = ({ me, relay }) => {
  const { hasMore, loadMore } = relay

  return (
    <PageWithSimpleHeader title="New Works for You">
      <Box>
        {!!me.artworks?.edges?.length ? (
          <InfiniteScrollArtworksGridContainer
            connection={me.artworks!}
            loadMore={loadMore}
            hasMore={hasMore}
            pageSize={PAGE_SIZE}
            contextScreenOwnerType={OwnerType.artist} // TODO: Add values for this
            contextScreenOwnerId={"TODO"}
            contextScreenOwnerSlug={"TODO"}
            HeaderComponent={<Spacer mt={2} />}
            shouldAddPadding
            useParentAwareScrollView={false}
          />
        ) : (
          <Message m={2}>Nothing yet. Please check back later.</Message>
        )}
      </Box>
    </PageWithSimpleHeader>
  )
}

export const NewWorksForYouFragmentContainer = createPaginationContainer(
  NewWorksForYou,
  {
    me: graphql`
      fragment NewWorksForYou_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        artworks: newWorksByInterestingArtists(first: $count, after: $cursor)
          @connection(key: "NewWorksForYou_artworks") {
          edges {
            node {
              id
            }
          }
          ...InfiniteScrollArtworksGrid_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props?.me?.artworks
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        cursor,
        count,
      }
    },
    query: graphql`
      query NewWorksForYouRefetchQuery($cursor: String, $count: Int!) {
        me {
          ...NewWorksForYou_me @arguments(cursor: $cursor, count: $count)
        }
      }
    `,
  }
)

export const NewWorksForYouQueryRenderer: React.FC = () => {
  return (
    <QueryRenderer<NewWorksForYouQuery>
      environment={defaultEnvironment}
      query={graphql`
        query NewWorksForYouQuery {
          me {
            ...NewWorksForYou_me
          }
        }
      `}
      variables={{}}
      render={renderWithLoadProgress(NewWorksForYouFragmentContainer)}
    />
  )
}

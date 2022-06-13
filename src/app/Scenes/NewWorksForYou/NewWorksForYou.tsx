import { OwnerType } from "@artsy/cohesion"
import { NewWorksForYou_me$data } from "__generated__/NewWorksForYou_me.graphql"
import { NewWorksForYouQuery } from "__generated__/NewWorksForYouQuery.graphql"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { PlaceholderGrid, ProvidePlaceholderContext } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { Box, SimpleMessage, Spacer } from "palette"
import React from "react"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"

const SCREEN_TITLE = "New Works for You"
const PAGE_SIZE = 10

interface NewWorksForYouProps {
  relay: RelayPaginationProp
  me: NewWorksForYou_me$data
}

const NewWorksForYou: React.FC<NewWorksForYouProps> = ({ me, relay }) => {
  const { hasMore, loadMore } = relay

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.newWorksForYou })}
    >
      <PageWithSimpleHeader title={SCREEN_TITLE}>
        <Box>
          {!!me.artworks?.edges?.length ? (
            <InfiniteScrollArtworksGridContainer
              connection={me.artworks!}
              loadMore={loadMore}
              hasMore={hasMore}
              pageSize={PAGE_SIZE}
              contextScreenOwnerType={OwnerType.newWorksForYou}
              HeaderComponent={<Spacer mt={2} />}
              shouldAddPadding
              showLoadingSpinner
              useParentAwareScrollView={false}
            />
          ) : (
            <SimpleMessage m={2}>Nothing yet. Please check back later.</SimpleMessage>
          )}
        </Box>
      </PageWithSimpleHeader>
    </ProvideScreenTrackingWithCohesionSchema>
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

export const NewWorksForYouScreenQuery = graphql`
  query NewWorksForYouQuery {
    me {
      ...NewWorksForYou_me
    }
  }
`

export const NewWorksForYouQueryRenderer: React.FC = () => {
  return (
    <QueryRenderer<NewWorksForYouQuery>
      environment={defaultEnvironment}
      query={NewWorksForYouScreenQuery}
      variables={{}}
      render={renderWithPlaceholder({
        Container: NewWorksForYouFragmentContainer,
        renderPlaceholder: Placeholder,
        renderFallback: () => null,
      })}
    />
  )
}

const Placeholder = () => {
  return (
    <ProvidePlaceholderContext>
      <PageWithSimpleHeader title={SCREEN_TITLE}>
        <Spacer mt={2} />
        <PlaceholderGrid />
      </PageWithSimpleHeader>
    </ProvidePlaceholderContext>
  )
}

import { Spacer, SimpleMessage } from "@artsy/palette-mobile"
import { LotsByArtistsYouFollowQuery } from "__generated__/LotsByArtistsYouFollowQuery.graphql"
import { LotsByArtistsYouFollow_me$data } from "__generated__/LotsByArtistsYouFollow_me.graphql"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { PAGE_SIZE } from "app/Components/constants"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"

const SCREEN_TITLE = "Auction Lots for You"
interface LotsByArtistsYouFollowProps {
  me: LotsByArtistsYouFollow_me$data
  relay: RelayPaginationProp
}

export const LotsByArtistsYouFollow: React.FC<LotsByArtistsYouFollowProps> = ({ me, relay }) => {
  const { hasMore, isLoading, loadMore } = relay
  const hasNext = hasMore()
  const loading = isLoading()

  const artworks = extractNodes(me?.lotsByFollowedArtistsConnection)
  // PAGINATION NOT WORKING FIX IT
  // NO ANALYTICS
  return (
    <PageWithSimpleHeader title={SCREEN_TITLE}>
      <MasonryInfiniteScrollArtworkGrid
        artworks={artworks}
        ListEmptyComponent={
          <SimpleMessage m={2}>Nothing yet. Please check back later.</SimpleMessage>
        }
        hasMore={hasNext}
        loadMore={() => loadMore(PAGE_SIZE)}
        isLoading={loading}
      />
    </PageWithSimpleHeader>
  )
}

export const lotsByArtistsYouFollowDefaultVariables = () => ({
  count: 10,
})

export const LotsByArtistsYouFollowScreenQuery = graphql`
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
        lotsByFollowedArtistsConnection(
          first: $count
          after: $cursor
          liveSale: true
          isAuction: true
        ) @connection(key: "LotsByArtistsYouFollow_lotsByFollowedArtistsConnection") {
          edges {
            cursor
            node {
              id
              slug
              image(includeAll: false) {
                aspectRatio
              }
              ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps: ({ me }) => me && me.lotsByFollowedArtistsConnection,
    getVariables: (_props, { count, cursor }) => ({ count, cursor }),
    query: LotsByArtistsYouFollowScreenQuery,
  }
)

export const LotsByArtistsYouFollowQueryRenderer: React.FC = () => {
  return (
    <QueryRenderer<LotsByArtistsYouFollowQuery>
      environment={getRelayEnvironment()}
      query={LotsByArtistsYouFollowScreenQuery}
      variables={lotsByArtistsYouFollowDefaultVariables()}
      render={renderWithPlaceholder({
        Container: LotsByArtistsYouFollowFragmentContainer,
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
        <Spacer y={2} />
        <PlaceholderGrid />
      </PageWithSimpleHeader>
    </ProvidePlaceholderContext>
  )
}

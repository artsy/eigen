import { OwnerType } from "@artsy/cohesion"
import { Spacer, SimpleMessage } from "@artsy/palette-mobile"
import { LotsByArtistsYouFollowQuery } from "__generated__/LotsByArtistsYouFollowQuery.graphql"
import { LotsByArtistsYouFollow_me$key } from "__generated__/LotsByArtistsYouFollow_me.graphql"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { PAGE_SIZE } from "app/Components/constants"
import { extractNodes } from "app/utils/extractNodes"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

const SCREEN_TITLE = "Auction Lots for You"

export const LotsByArtistsYouFollow: React.FC = () => {
  const queryData = useLazyLoadQuery<LotsByArtistsYouFollowQuery>(
    LotsByArtistsYouFollowScreenQuery,
    lotsByArtistsYouFollowDefaultVariables()
  )

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    LotsByArtistsYouFollowQuery,
    LotsByArtistsYouFollow_me$key
  >(artworkConnectionFragment, queryData.me)

  const RefreshControl = useRefreshControl(refetch)
  const artworks = extractNodes(data?.lotsByFollowedArtistsConnection)

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.lotsByArtistsYouFollow })}
    >
      <PageWithSimpleHeader title={SCREEN_TITLE}>
        <MasonryInfiniteScrollArtworkGrid
          artworks={artworks}
          ListEmptyComponent={
            <SimpleMessage m={2}>Nothing yet. Please check back later.</SimpleMessage>
          }
          hasMore={hasNext}
          loadMore={() => loadNext(PAGE_SIZE)}
          isLoading={isLoadingNext}
          refreshControl={RefreshControl}
        />
      </PageWithSimpleHeader>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export const lotsByArtistsYouFollowDefaultVariables = () => ({
  count: PAGE_SIZE,
})

export const LotsByArtistsYouFollowScreenQuery = graphql`
  query LotsByArtistsYouFollowQuery($count: Int!, $after: String) {
    me {
      ...LotsByArtistsYouFollow_me @arguments(count: $count, after: $after)
    }
  }
`

const artworkConnectionFragment = graphql`
  fragment LotsByArtistsYouFollow_me on Me
  @refetchable(queryName: "LotsByArtistsYouFollow_meRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, after: { type: "String" }) {
    lotsByFollowedArtistsConnection(first: $count, after: $after, liveSale: true, isAuction: true)
      @connection(key: "LotsByArtistsYouFollow_lotsByFollowedArtistsConnection") {
      edges {
        node {
          id
          slug
          image(includeAll: false) {
            aspectRatio
            blurhash
          }
          ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
        }
      }
    }
  }
`

export const LotsByArtistsYouFollowScreen: React.FC = () => {
  return (
    <Suspense fallback={<Placeholder />}>
      <LotsByArtistsYouFollow />
    </Suspense>
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

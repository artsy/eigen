import { OwnerType } from "@artsy/cohesion"
import { Screen, SimpleMessage, Spacer } from "@artsy/palette-mobile"
import { LotsByArtistsYouFollowQuery } from "__generated__/LotsByArtistsYouFollowQuery.graphql"
import {
  LotsByArtistsYouFollow_me$data,
  LotsByArtistsYouFollow_me$key,
} from "__generated__/LotsByArtistsYouFollow_me.graphql"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { ExtractNodeType } from "app/utils/relayHelpers"
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
      <Screen>
        <Screen.AnimatedHeader onBack={goBack} title={SCREEN_TITLE} />
        <Screen.StickySubHeader title={SCREEN_TITLE} />
        <Screen.Body fullwidth>
          <ArtworksGrid
            artworks={artworks}
            loadNext={loadNext}
            hasNext={hasNext}
            isLoadingNext={isLoadingNext}
            RefreshControl={RefreshControl}
          />
        </Screen.Body>
      </Screen>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const ArtworksGrid = ({
  artworks,
  loadNext,
  hasNext,
  isLoadingNext,
  RefreshControl,
}: {
  artworks: ExtractNodeType<LotsByArtistsYouFollow_me$data["lotsByFollowedArtistsConnection"]>[]
  loadNext: (pageSize: number) => void
  hasNext: boolean
  isLoadingNext: boolean
  RefreshControl: JSX.Element
}) => {
  const { scrollHandler } = Screen.useListenForScreenScroll()

  return (
    <MasonryInfiniteScrollArtworkGrid
      animated
      artworks={artworks}
      ListEmptyComponent={
        <SimpleMessage m={2}>Nothing yet. Please check back later.</SimpleMessage>
      }
      hasMore={hasNext}
      loadMore={() => loadNext(PAGE_SIZE)}
      isLoading={isLoadingNext}
      refreshControl={RefreshControl}
      onScroll={scrollHandler}
    />
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
      <Screen>
        <Screen.AnimatedHeader onBack={goBack} title={SCREEN_TITLE} />
        <Screen.StickySubHeader title={SCREEN_TITLE} />
        <Screen.Body fullwidth>
          <Spacer y={2} />
          <PlaceholderGrid />
        </Screen.Body>
      </Screen>
    </ProvidePlaceholderContext>
  )
}

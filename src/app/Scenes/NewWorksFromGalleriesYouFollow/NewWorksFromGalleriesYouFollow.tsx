import { OwnerType } from "@artsy/cohesion"
import { Spacer, SimpleMessage } from "@artsy/palette-mobile"
import { NewWorksFromGalleriesYouFollowQuery } from "__generated__/NewWorksFromGalleriesYouFollowQuery.graphql"
import { NewWorksFromGalleriesYouFollow_artworksConnection$key } from "__generated__/NewWorksFromGalleriesYouFollow_artworksConnection.graphql"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { PAGE_SIZE } from "app/Components/constants"
import { extractNodes } from "app/utils/extractNodes"
import { PlaceholderGrid, ProvidePlaceholderContext } from "app/utils/placeholders"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

const SCREEN_TITLE = "New Works from Galleries You Follow"

export const NewWorksFromGalleriesYouFollow: React.FC = () => {
  const queryData = useLazyLoadQuery<NewWorksFromGalleriesYouFollowQuery>(
    NewWorksFromGalleriesYouFollowScreenQuery,
    newWorksFromGalleriesYouFollowQueryVariables
  )

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    NewWorksFromGalleriesYouFollowQuery,
    NewWorksFromGalleriesYouFollow_artworksConnection$key
  >(artworkConnectionFragment, queryData.me)

  const artworks = extractNodes(data?.newWorksFromGalleriesYouFollowConnection)
  const RefreshControl = useRefreshControl(refetch)

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.newWorksFromGalleriesYouFollow })}
    >
      <PageWithSimpleHeader title={SCREEN_TITLE}>
        {artworks.length ? (
          <InfiniteScrollArtworksGridContainer
            connection={data?.newWorksFromGalleriesYouFollowConnection}
            loadMore={(pageSize, onComplete) => loadNext(pageSize, { onComplete } as any)}
            hasMore={() => hasNext}
            isLoading={() => isLoadingNext}
            pageSize={PAGE_SIZE}
            contextScreenOwnerType={OwnerType.newWorksFromGalleriesYouFollow}
            HeaderComponent={<Spacer y={2} />}
            shouldAddPadding
            refreshControl={RefreshControl}
          />
        ) : (
          <SimpleMessage m={2}>Nothing yet. Please check back later.</SimpleMessage>
        )}
      </PageWithSimpleHeader>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export const newWorksFromGalleriesYouFollowQueryVariables = {
  count: PAGE_SIZE,
}

export const NewWorksFromGalleriesYouFollowScreenQuery = graphql`
  query NewWorksFromGalleriesYouFollowQuery($count: Int, $after: String) {
    me {
      ...NewWorksFromGalleriesYouFollow_artworksConnection @arguments(count: $count, after: $after)
    }
  }
`

const artworkConnectionFragment = graphql`
  fragment NewWorksFromGalleriesYouFollow_artworksConnection on Me
  @refetchable(queryName: "NewWorksFromGalleriesYouFollow_artworksConnectionRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, after: { type: "String" }) {
    newWorksFromGalleriesYouFollowConnection(first: $count, after: $after)
      @connection(key: "NewWorksFromGalleriesYouFollow_newWorksFromGalleriesYouFollowConnection") {
      edges {
        cursor
        node {
          internalID
        }
      }
      ...InfiniteScrollArtworksGrid_connection
    }
  }
`

export const NewWorksFromGalleriesYouFollowScreen: React.FC = () => {
  return (
    <Suspense fallback={<Placeholder />}>
      <NewWorksFromGalleriesYouFollow />
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

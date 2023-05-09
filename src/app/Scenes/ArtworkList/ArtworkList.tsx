import { Flex, Separator, Text, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { ArtworkListQuery } from "__generated__/ArtworkListQuery.graphql"
import { ArtworkList_artworksConnection$key } from "__generated__/ArtworkList_artworksConnection.graphql"
import { ArtworksFilterHeader } from "app/Components/ArtworkGrids/ArtworksFilterHeader"
import { GenericGridPlaceholder } from "app/Components/ArtworkGrids/GenericGrid"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { ArtworkListHeader } from "app/Scenes/ArtworkList/ArtworkListHeader"
import { PlaceholderText, ProvidePlaceholderContext } from "app/utils/placeholders"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { FC, Suspense } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

interface ArtworkListScreenProps {
  artworkListID: string
}

const ArtworkList: FC<ArtworkListScreenProps> = ({ artworkListID }) => {
  const queryData = useLazyLoadQuery<ArtworkListQuery>(ArtworkListScreenQuery, {
    listID: artworkListID,
    count: PAGE_SIZE,
  })

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    ArtworkListQuery,
    ArtworkList_artworksConnection$key
  >(artworkListFragment, queryData.me)

  const RefreshControl = useRefreshControl(refetch)

  const ArtworksGridHeaderContainer = () => {
    const totalArtworksCount = data?.artworkList?.artworks?.totalCount
    return (
      <Flex my={1}>
        <Text ml={2} mb={1} variant="lg">
          {data?.artworkList?.name}
        </Text>
        <Separator borderColor="black10" mt={1} />
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
          <Text ml={2} variant="xs" color="black60">
            {totalArtworksCount} {totalArtworksCount === 1 ? "Artwork" : "Artworks"}
          </Text>
          <ArtworksFilterHeader
            onFilterPress={() => console.log("Nothing for now")}
            selectedFiltersCount={0}
            showSeparator={false}
          />
        </Flex>
      </Flex>
    )
  }

  return (
    <>
      <ArtworkListHeader />
      <InfiniteScrollArtworksGridContainer
        connection={data?.artworkList?.artworks}
        loadMore={(pageSize, onComplete) => loadNext(pageSize, { onComplete } as any)}
        hasMore={() => hasNext}
        isLoading={() => isLoadingNext}
        HeaderComponent={<ArtworksGridHeaderContainer />}
        shouldAddPadding
        refreshControl={RefreshControl}
      />
    </>
  )
}

export const ArtworkListScreenQuery = graphql`
  query ArtworkListQuery($listID: String!, $count: Int, $after: String) {
    me {
      ...ArtworkList_artworksConnection @arguments(listID: $listID, count: $count, after: $after)
    }
  }
`

const artworkListFragment = graphql`
  fragment ArtworkList_artworksConnection on Me
  @refetchable(queryName: "ArtworkList_artworksConnectionRefetch")
  @argumentDefinitions(
    listID: { type: "String!" }
    count: { type: "Int", defaultValue: 10 }
    after: { type: "String" }
  ) {
    artworkList: collection(id: $listID) {
      internalID
      name

      artworks: artworksConnection(first: $count, after: $after)
        @connection(key: "ArtworkList_artworks") {
        totalCount
        edges {
          node {
            internalID
          }
        }
        ...InfiniteScrollArtworksGrid_connection
      }
    }
  }
`

export const ArtworkListScreen: FC<ArtworkListScreenProps> = (props) => {
  return (
    <Suspense fallback={<ArtworkListPlaceholder />}>
      <ArtworkList {...props} />
    </Suspense>
  )
}

const ArtworkListPlaceholder = () => {
  const screen = useScreenDimensions()
  const space = useSpace()
  return (
    <ProvidePlaceholderContext>
      <Flex mt={6} px={2}>
        <PlaceholderText height={20} width={200} marginVertical={space(2)} />
        <Separator borderColor="black10" mt={1} mb={2} />
        <GenericGridPlaceholder width={screen.width - space(4)} />
      </Flex>
    </ProvidePlaceholderContext>
  )
}

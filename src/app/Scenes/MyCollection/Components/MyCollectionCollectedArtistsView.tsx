import { Flex, Spacer, Spinner } from "@artsy/palette-mobile"
import { MyCollectionCollectedArtistsView_me$key } from "__generated__/MyCollectionCollectedArtistsView_me.graphql"
import { MyCollectionArtistFilters } from "app/Scenes/MyCollection/Components/MyCollectionArtistFiltersStickyTab"
import { MyCollectionArtworksKeywordStore } from "app/Scenes/MyCollection/Components/MyCollectionArtworksKeywordStore"
import { MyCollectionCollectedArtistItem } from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtistItem"
import { extractNodes } from "app/utils/extractNodes"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { stringIncludes } from "app/utils/stringHelpers"
import { FlatList } from "react-native"
import { graphql, usePaginationFragment } from "react-relay"

interface MyCollectionCollectedArtistsViewProps {
  me: MyCollectionCollectedArtistsView_me$key
}

export const MyCollectionCollectedArtistsView: React.FC<MyCollectionCollectedArtistsViewProps> = ({
  me,
}) => {
  const { data, hasNext, loadNext, isLoadingNext, refetch } = usePaginationFragment(
    collectedArtistsPaginationFragment,
    me
  )

  const keyword = MyCollectionArtworksKeywordStore.useStoreState((state) => state.keyword)

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(10)
  }

  const RefreshControl = useRefreshControl(refetch)

  const collectedArtists = extractNodes(data.myCollectionInfo?.collectedArtistsConnection)

  if (!collectedArtists.length) {
    return null
  }

  const artistsAndArtworksCount = data.myCollectionInfo?.collectedArtistsConnection?.edges
    ?.filter((artist) => {
      return stringIncludes(artist?.node?.name || "", keyword)
    })
    ?.filter((edge) => edge !== null && edge.node !== null)
    .map((edge) => {
      return {
        artist: edge?.node,
        artworksCount: edge?.artworksCount || null,
      }
    })

  return (
    <Flex>
      <MyCollectionArtistFilters />

      <Spacer y={1} />

      <FlatList
        data={artistsAndArtworksCount}
        key="list"
        keyExtractor={(item) => "list" + item.artist!.internalID}
        renderItem={({ item }) => {
          return (
            <MyCollectionCollectedArtistItem
              artworksCount={item.artworksCount}
              // casting this type because typescript was not able to infer it correctly
              artist={item.artist!}
              // casting this type because typescript was not able to infer it correctly
              key={item.artist!.internalID}
              compact
            />
          )
        }}
        onEndReached={handleLoadMore}
        ListFooterComponent={!!hasNext ? <LoadingIndicator /> : <Spacer y={2} />}
        ItemSeparatorComponent={() => <Spacer y={2} />}
        refreshControl={RefreshControl}
      />
    </Flex>
  )
}

const LoadingIndicator = () => {
  return (
    <Flex alignItems="center" justifyContent="center" py={4}>
      <Spinner />
    </Flex>
  )
}

const collectedArtistsPaginationFragment = graphql`
  fragment MyCollectionCollectedArtistsView_me on Me
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, after: { type: "String" })
  @refetchable(queryName: "MyCollectionCollectedArtistsView_myCollectionInfoRefetch") {
    myCollectionInfo {
      collectedArtistsConnection(
        first: $count
        after: $after
        sort: TRENDING_DESC
        includePersonalArtists: true
      ) @connection(key: "MyCollectionCollectedArtistsView_collectedArtistsConnection") {
        edges {
          artworksCount
          node {
            internalID
            name
            ...MyCollectionCollectedArtistItem_artist
            ...MyCollectionCollectedArtistGridItem_artist
          }
        }
      }
    }
  }
`

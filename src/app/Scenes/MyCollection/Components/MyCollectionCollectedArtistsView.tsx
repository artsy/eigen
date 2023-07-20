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

  const collectedArtists = extractNodes(data.userInterestsConnection)

  if (!collectedArtists.length) {
    return null
  }

  const artists = extractNodes(data.userInterestsConnection)?.filter((artist) => {
    return stringIncludes(artist?.name || "", keyword)
  })

  return (
    <Flex>
      <MyCollectionArtistFilters />

      <Spacer y={1} />

      <FlatList
        data={artists}
        key="list"
        keyExtractor={(item) => "list" + item.internalID}
        renderItem={({ item }) => {
          return <MyCollectionCollectedArtistItem artist={item} key={item.internalID} compact />
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
    userInterestsConnection(
      first: $count
      after: $after
      category: COLLECTED_BEFORE
      interestType: ARTIST
    ) @connection(key: "MyCollectionCollectedArtistsView_userInterestsConnection") {
      edges {
        node {
          ... on Artist {
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

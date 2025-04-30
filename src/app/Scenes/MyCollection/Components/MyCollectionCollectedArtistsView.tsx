import { Flex, Spacer, Spinner } from "@artsy/palette-mobile"
import { MyCollectionCollectedArtistsView_me$key } from "__generated__/MyCollectionCollectedArtistsView_me.graphql"
import { FilteredArtworkGridZeroState as FilteredArtistsZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { MyCollectionArtistFilters } from "app/Scenes/MyCollection/Components/MyCollectionArtistFiltersStickyTab"
import { MyCollectionArtworksKeywordStore } from "app/Scenes/MyCollection/Components/MyCollectionArtworksKeywordStore"
import { MyCollectionCollectedArtistItem } from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtistItem"
import { extractEdges } from "app/utils/extractEdges"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { stringIncludes } from "app/utils/stringHelpers"
import { useEffect } from "react"
import { FlatList } from "react-native"
import { graphql, usePaginationFragment } from "react-relay"

interface MyCollectionCollectedArtistsViewProps {
  me: MyCollectionCollectedArtistsView_me$key
  showFilter?: boolean
}

export const MyCollectionCollectedArtistsView: React.FC<MyCollectionCollectedArtistsViewProps> = ({
  me,
  showFilter,
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

    loadNext(20)
  }

  // Load all artists when keyword search is used because we cannot filter on the backend
  useEffect(() => {
    if (!hasNext || isLoadingNext || !keyword.length) return

    loadNext(100)
  }, [keyword, data.userInterestsConnection])

  const RefreshControl = useRefreshControl(refetch)

  const userInterests = extractEdges(data.userInterestsConnection)

  if (!userInterests.length) {
    return null
  }

  const filteredUserInterests = userInterests?.filter((userInterest) => {
    return stringIncludes(userInterest?.node?.name || "", keyword)
  })

  return (
    <Flex>
      {!!showFilter && <MyCollectionArtistFilters />}

      <Spacer y={1} />

      {filteredUserInterests.length > 0 ? (
        <FlatList
          data={filteredUserInterests}
          key="list"
          keyExtractor={(item) => "list" + item?.internalID}
          renderItem={({ item }) => {
            if (item?.node) {
              return (
                <MyCollectionCollectedArtistItem
                  artist={item.node}
                  key={item.internalID}
                  compact
                  interestId={item.internalID}
                  isPrivate={item.private}
                />
              )
            }
            return null
          }}
          onEndReached={handleLoadMore}
          ListFooterComponent={!!hasNext ? <LoadingIndicator /> : <Spacer y={2} />}
          ItemSeparatorComponent={() => <Spacer y={2} />}
          refreshControl={RefreshControl}
        />
      ) : (
        <Flex py={6} px={2}>
          <FilteredArtistsZeroState hideClearButton />
        </Flex>
      )}
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
  @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, after: { type: "String" })
  @refetchable(queryName: "MyCollectionCollectedArtistsView_myCollectionInfoRefetch") {
    userInterestsConnection(
      first: $count
      after: $after
      category: COLLECTED_BEFORE
      interestType: ARTIST
    ) @connection(key: "MyCollectionCollectedArtistsView_userInterestsConnection") {
      edges {
        internalID
        private
        node {
          ... on Artist {
            internalID
            name
            ...MyCollectionCollectedArtistItem_artist
          }
        }
      }
    }
  }
`

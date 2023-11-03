import { Flex, Spinner, Text, useSpace } from "@artsy/palette-mobile"
import { MyCollectionCollectedArtistsPrivacyArtistsList_me$key } from "__generated__/MyCollectionCollectedArtistsPrivacyArtistsList_me.graphql"
import { SelectArtistToShareListItem } from "app/Scenes/MyCollection/Components/SelectArtistToShareListItem"
import { extractEdges } from "app/utils/extractEdges"
import { FlatList } from "react-native"
import { usePaginationFragment, graphql } from "react-relay"

interface MyCollectionCollectedArtistsPrivacyArtistsListProps {
  me: MyCollectionCollectedArtistsPrivacyArtistsList_me$key
}

export const MyCollectionCollectedArtistsPrivacyArtistsList: React.FC<
  MyCollectionCollectedArtistsPrivacyArtistsListProps
> = ({ me }) => {
  const space = useSpace()

  const { data, hasNext, loadNext, isLoadingNext } = usePaginationFragment(
    myCollectionCollectedArtistsPrivacyArtistsListPaginationFragment,
    me
  )

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(10)
  }

  const userInterests = extractEdges(data.userInterestsConnection)

  if (userInterests.length === 0) {
    return null
  }

  return (
    <FlatList
      showsHorizontalScrollIndicator
      data={userInterests}
      renderItem={({ item }) => {
        if (item?.internalID && item.node) {
          return (
            <SelectArtistToShareListItem
              key={item?.internalID}
              artist={item?.node}
              interestID={item?.internalID}
              private={item.private}
            />
          )
        }
        return null
      }}
      contentContainerStyle={{ paddingBottom: space(6) }}
      ListHeaderComponent={HeaderComponent}
      ListFooterComponent={() => {
        if (!isLoadingNext) {
          return null
        }
        return (
          <Flex>
            <Flex alignItems="center" justifyContent="center" height={60}>
              <Spinner />
            </Flex>
          </Flex>
        )
      }}
      onEndReached={handleLoadMore}
    />
  )
}

export const HeaderComponent = () => {
  return (
    <Flex py={4} px={2}>
      <Text variant="lg-display">Select artists to share</Text>
      <Text mt={1} variant="sm-display">
        Which artists in your collection would you like galleries to see when you contact them?
      </Text>
    </Flex>
  )
}

const myCollectionCollectedArtistsPrivacyArtistsListPaginationFragment = graphql`
  fragment MyCollectionCollectedArtistsPrivacyArtistsList_me on Me
  @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, after: { type: "String" })
  @refetchable(
    queryName: "MyCollectionCollectedArtistsPrivacyArtistsList_myCollectionInfoRefetch"
  ) {
    userInterestsConnection(
      first: $count
      after: $after
      category: COLLECTED_BEFORE
      interestType: ARTIST
    ) @connection(key: "MyCollectionCollectedArtistsPrivacyArtistsList_userInterestsConnection") {
      edges {
        internalID
        private
        node {
          ... on Artist {
            ...SelectArtistToShareListItem_artist
          }
        }
      }
    }
  }
`

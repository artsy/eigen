import { Avatar, Flex, Spacer, Spinner, Text, Touchable, useSpace } from "@artsy/palette-mobile"
import { MyCollectionCollectedArtistsRail_artist$key } from "__generated__/MyCollectionCollectedArtistsRail_artist.graphql"
import { MyCollectionCollectedArtistsRail_me$key } from "__generated__/MyCollectionCollectedArtistsRail_me.graphql"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { Animated } from "react-native"
import { useFragment, usePaginationFragment, graphql } from "react-relay"

interface MyCollectionCollectedArtistsRailProps {
  me: MyCollectionCollectedArtistsRail_me$key
}

export const ARTIST_CIRCLE_DIAMETER = 100

export const MyCollectionCollectedArtistsRail: React.FC<MyCollectionCollectedArtistsRailProps> = ({
  me,
}) => {
  const space = useSpace()

  const { data, hasNext, loadNext, isLoadingNext } = usePaginationFragment(
    collectedArtistsPaginationFragment,
    me
  )

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(10)
  }

  const userInterests = data.userInterestsConnection?.edges || []
  const collectedArtists = userInterests.map((userInterest) => userInterest?.node)

  if (!collectedArtists) return <></>

  const filteredUserInterests = userInterests.filter((userInterest) => {
    if (userInterest?.internalID && userInterest.node && userInterest.node.internalID) {
      return true
    }
    return
  })

  return (
    <Flex testID="my-collection-collected-artists-rail">
      <Animated.FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={filteredUserInterests}
        renderItem={({ item }) => {
          if (item?.node && item.internalID && item.node.internalID) {
            return (
              <Artist key={item.node.internalID} artist={item.node} interestId={item.internalID} />
            )
          }
          return null
        }}
        keyExtractor={(item, index) => item?.internalID || index.toString()}
        onEndReachedThreshold={1}
        ItemSeparatorComponent={() => <Spacer y={2} />}
        contentContainerStyle={{
          paddingTop: space(2),
          paddingBottom: space(4),
          paddingLeft: space(2),
        }}
        ListFooterComponent={() => (
          <Flex flexDirection="row" mr={1}>
            {!!isLoadingNext && (
              <Flex
                mr={1}
                width={ARTIST_CIRCLE_DIAMETER}
                height={ARTIST_CIRCLE_DIAMETER}
                alignItems="center"
                justifyContent="center"
              >
                <Spinner />
              </Flex>
            )}
          </Flex>
        )}
        onEndReached={handleLoadMore}
      />
    </Flex>
  )
}

export const Artist: React.FC<{
  artist: MyCollectionCollectedArtistsRail_artist$key
  interestId: string
  onPress?: () => void
}> = ({ artist, interestId, onPress }) => {
  const data = useFragment(artistFragment, artist)
  const setViewKind = MyCollectionTabsStore.useStoreActions((state) => state.setViewKind)

  return (
    <Touchable
      accessibilityRole="button"
      haptic
      onPress={() => {
        setViewKind({
          viewKind: "Artist",
          artistId: data.internalID,
          interestId: interestId,
        })
        onPress?.()
      }}
      accessibilityLabel={`View more details ${data.name}`}
    >
      <Flex mr={1} width={ARTIST_CIRCLE_DIAMETER}>
        <Avatar
          initials={data.initials || undefined}
          src={data?.image?.url || undefined}
          size="md"
        />
        <Text variant="xs" numberOfLines={2} textAlign="center" mt={0.5}>
          {data.name}
        </Text>
      </Flex>
    </Touchable>
  )
}

const collectedArtistsPaginationFragment = graphql`
  fragment MyCollectionCollectedArtistsRail_me on Me
  @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, after: { type: "String" })
  @refetchable(queryName: "MyCollectionCollectedArtistsRail_myCollectionInfoRefetch") {
    userInterestsConnection(
      first: $count
      after: $after
      category: COLLECTED_BEFORE
      interestType: ARTIST
    ) @connection(key: "MyCollectionCollectedArtistsRail_userInterestsConnection") {
      edges {
        internalID
        node {
          ... on Artist {
            internalID
            ...MyCollectionCollectedArtistsRail_artist
          }
        }
      }
    }
  }
`

const artistFragment = graphql`
  fragment MyCollectionCollectedArtistsRail_artist on Artist {
    internalID
    name
    initials
    image {
      url(version: "small")
    }
  }
`

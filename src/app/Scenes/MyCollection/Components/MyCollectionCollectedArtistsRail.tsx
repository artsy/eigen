import { AddIcon, Avatar, Flex, Spacer, Spinner, Text, useSpace } from "@artsy/palette-mobile"
import { MyCollectionCollectedArtistsRail_artist$key } from "__generated__/MyCollectionCollectedArtistsRail_artist.graphql"
import { MyCollectionCollectedArtistsRail_me$key } from "__generated__/MyCollectionCollectedArtistsRail_me.graphql"
import { extractNodes } from "app/utils/extractNodes"
import { Animated } from "react-native"
import { useFragment, usePaginationFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface MyCollectionCollectedArtistsRailProps {
  me: MyCollectionCollectedArtistsRail_me$key
}

export const ARTIST_CIRCLE_DIAMETER = 100

const AddMoreButton = () => {
  return (
    <Flex>
      <Flex
        alignItems="center"
        backgroundColor="black5"
        border="1px solid"
        borderColor="black15"
        borderRadius={ARTIST_CIRCLE_DIAMETER / 2}
        height={ARTIST_CIRCLE_DIAMETER}
        justifyContent="center"
        width={ARTIST_CIRCLE_DIAMETER}
      >
        <AddIcon height={28} width={28} fill="black60" />
      </Flex>
      <Text variant="xs" numberOfLines={2} textAlign="center" mt={0.5}>
        Add Artist
      </Text>
    </Flex>
  )
}

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

  const collectedArtists = extractNodes(data.myCollectionInfo?.collectedArtistsConnection)

  if (!collectedArtists) return <></>

  return (
    <Flex>
      <Animated.FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={collectedArtists}
        renderItem={({ item }) => <Artist key={item.internalID} artist={item} />}
        keyExtractor={({ internalID }) => internalID}
        onEndReachedThreshold={1}
        ItemSeparatorComponent={() => <Spacer y={2} />}
        contentContainerStyle={{
          marginVertical: space(1),
          marginHorizontal: space(2),
        }}
        ListFooterComponent={
          <Flex flexDirection="row" mr={4}>
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
            {!hasNext && <AddMoreButton />}
          </Flex>
        }
        onEndReached={handleLoadMore}
      />
    </Flex>
  )
}

export const Artist: React.FC<{ artist: MyCollectionCollectedArtistsRail_artist$key }> = ({
  artist,
}) => {
  const data = useFragment(artistFragment, artist)

  return (
    <Flex mr={1} width={ARTIST_CIRCLE_DIAMETER}>
      <Avatar initials={data.initials || undefined} src={data?.image?.url || undefined} size="md" />
      <Text variant="xs" numberOfLines={2} textAlign="center" mt={0.5}>
        {data.name}
      </Text>
    </Flex>
  )
}

const collectedArtistsPaginationFragment = graphql`
  fragment MyCollectionCollectedArtistsRail_me on Me
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, after: { type: "String" })
  @refetchable(queryName: "MyCollectionCollectedArtistsRail_myCollectionInfoRefetch") {
    myCollectionInfo {
      collectedArtistsConnection(
        first: $count
        after: $after
        sort: TRENDING_DESC
        includePersonalArtists: true
      ) @connection(key: "MyCollectionCollectedArtistsRail_collectedArtistsConnection") {
        edges {
          node {
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
    name
    initials
    image {
      url
    }
  }
`

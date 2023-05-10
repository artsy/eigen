import { AddIcon, Avatar, Flex, Spacer, Spinner, Text, useSpace } from "@artsy/palette-mobile"
import { MyCollectionCollectedArtistsRail_myCollectionInfo$data } from "__generated__/MyCollectionCollectedArtistsRail_myCollectionInfo.graphql"
import { extractNodes } from "app/utils/extractNodes"
import { useState } from "react"
import { Animated } from "react-native"
import { RelayPaginationProp, createPaginationContainer } from "react-relay"
import { graphql } from "relay-runtime"

interface MyCollectionCollectedArtistsRailProps {
  myCollectionInfo: MyCollectionCollectedArtistsRail_myCollectionInfo$data | null
  relay: RelayPaginationProp
}

export const ARTIST_CIRCLE_DIAMETER = 70

const AddMoreButton = () => {
  return (
    <Flex
      width={ARTIST_CIRCLE_DIAMETER}
      height={ARTIST_CIRCLE_DIAMETER}
      borderRadius={ARTIST_CIRCLE_DIAMETER / 2}
      alignItems="center"
      justifyContent="center"
      backgroundColor="black5"
    >
      <AddIcon height={28} width={28} fill="black60" />
    </Flex>
  )
}

export const MyCollectionCollectedArtistsRail: React.FC<MyCollectionCollectedArtistsRailProps> = ({
  myCollectionInfo,
  relay,
}) => {
  const space = useSpace()
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadMore = () => {
    if (!relay.hasMore() || relay.isLoading()) {
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      relay.loadMore(10, (err) => {
        setIsLoading(false)

        if (err) {
          console.error(err)
        }
      })
    }, 2000)
  }

  const collectedArtistsConnection = extractNodes(myCollectionInfo?.collectedArtistsConnection)

  return (
    <Flex mx={-2}>
      <Animated.FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={collectedArtistsConnection}
        renderItem={({ index, item }) => (
          <Artist
            key={index}
            initials={item.initials || undefined}
            name={item.name || ""}
            image={item.image?.url || ""}
          />
        )}
        keyExtractor={({ internalID }) => internalID}
        onEndReachedThreshold={0.2}
        ItemSeparatorComponent={() => <Spacer y={2} />}
        contentContainerStyle={{
          paddingTop: space(2),
          paddingBottom: space(2),
          marginHorizontal: space(2),
        }}
        ListFooterComponent={
          <Flex flexDirection="row" mr={4}>
            {!!isLoading && (
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
            <AddMoreButton />
          </Flex>
        }
        onEndReached={handleLoadMore}
      />
    </Flex>
  )
}

const Artist: React.FC<{ name: string; initials: string | undefined; image: any }> = ({
  name,
  initials,
  image,
}) => {
  return (
    <Flex mr={1} width={ARTIST_CIRCLE_DIAMETER}>
      <Avatar initials={initials} src={image} size="sm" />
      <Text variant="xs" numberOfLines={2} textAlign="center">
        {name}
      </Text>
    </Flex>
  )
}

export const MyCollectionCollectedArtistsRailFragmentContiner = createPaginationContainer(
  MyCollectionCollectedArtistsRail,
  {
    myCollectionInfo: graphql`
      fragment MyCollectionCollectedArtistsRail_myCollectionInfo on MyCollectionInfo
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        includePersonalArtists: { type: "Boolean", defaultValue: true }
        cursor: { type: "String" }
      ) {
        collectedArtistsConnection(
          first: $count
          includePersonalArtists: $includePersonalArtists
          after: $cursor
        ) @connection(key: "MyCollection_collectedArtistsConnection") {
          totalCount
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
              internalID
              name
              initials
              image {
                url
              }
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props?.myCollectionInfo?.collectedArtistsConnection
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        cursor,
        count,
      }
    },
    query: graphql`
      query MyCollectionCollectedArtistsRailQuery(
        $cursor: String
        $count: Int!
        $includePersonalArtists: Boolean!
      ) {
        me {
          myCollectionInfo {
            ...MyCollectionCollectedArtistsRail_myCollectionInfo
              @arguments(
                cursor: $cursor
                count: $count
                includePersonalArtists: $includePersonalArtists
              )
          }
        }
      }
    `,
  }
)

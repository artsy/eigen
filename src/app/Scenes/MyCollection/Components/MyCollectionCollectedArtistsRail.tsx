import { Avatar, Flex, Text, useSpace } from "@artsy/palette-mobile"
import { MyCollectionCollectedArtistsRail_myCollectionInfo$data } from "__generated__/MyCollectionCollectedArtistsRail_myCollectionInfo.graphql"
import { extractNodes } from "app/utils/extractNodes"
import { ScrollView } from "react-native"
import { RelayPaginationProp, createPaginationContainer } from "react-relay"
import { graphql } from "relay-runtime"

interface MyCollectionCollectedArtistsRailProps {
  myCollectionInfo: MyCollectionCollectedArtistsRail_myCollectionInfo$data | null
  relay: RelayPaginationProp
}

export const ARTIST_CIRCLE_DIAMETER = 70

const MyCollectionCollectedArtistsRail: React.FC<MyCollectionCollectedArtistsRailProps> = ({
  myCollectionInfo,
  relay,
}) => {
  const space = useSpace()

  const collectedArtistsConnection = extractNodes(myCollectionInfo?.collectedArtistsConnection)

  return (
    <ScrollView
      horizontal
      contentContainerStyle={{ paddingTop: space(2) }}
      showsHorizontalScrollIndicator={false}
    >
      {collectedArtistsConnection.map((artist, index) => {
        return (
          <Artist
            key={index}
            initials={artist.initials || undefined}
            name={artist.name || ""}
            image={artist.image?.url || ""}
          />
        )
      })}
      <Avatar initials="+" size="sm" />
      <Text
        onPress={() => {
          // TODO: load more on croll
          if (relay.hasMore()) relay.loadMore(1)
        }}
      >
        LOAD MORE
      </Text>
    </ScrollView>
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
      @argumentDefinitions(count: { type: "Int", defaultValue: 1 }, cursor: { type: "String" }) {
        collectedArtistsConnection(first: $count, includePersonalArtists: true, after: $cursor)
          @connection(key: "MyCollection_collectedArtistsConnection") {
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
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
      query MyCollectionCollectedArtistsRailQuery($cursor: String, $count: Int!) {
        me {
          myCollectionInfo {
            ...MyCollectionCollectedArtistsRail_myCollectionInfo
              @arguments(cursor: $cursor, count: $count)
          }
        }
      }
    `,
  }
)

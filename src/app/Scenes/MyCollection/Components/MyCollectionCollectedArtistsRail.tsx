import { Avatar, Flex, Text, useSpace } from "@artsy/palette-mobile"
import { MyCollectionCollectedArtistsRail_myCollectionInfo$key } from "__generated__/MyCollectionCollectedArtistsRail_myCollectionInfo.graphql"
import { extractNodes } from "app/utils/extractNodes"
import { ScrollView } from "react-native"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface MyCollectionCollectedArtistsRailProps {
  myCollectionInfo: MyCollectionCollectedArtistsRail_myCollectionInfo$key | null
}

export const ARTIST_CIRCLE_DIAMETER = 70

export const MyCollectionCollectedArtistsRail: React.FC<MyCollectionCollectedArtistsRailProps> = ({
  myCollectionInfo,
}) => {
  const space = useSpace()

  const data = useFragment(
    myCollectionCollectedArtistsRailFragment,
    myCollectionInfo
  )?.collectedArtistsConnection

  if (!data) return <></>

  const collectedArtistsConnection = extractNodes(data)

  return (
    <ScrollView horizontal contentContainerStyle={{ paddingTop: space(2) }}>
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

export const myCollectionCollectedArtistsRailFragment = graphql`
  fragment MyCollectionCollectedArtistsRail_myCollectionInfo on MyCollectionInfo {
    collectedArtistsConnection(
      first: 10 # @connection(key: "MyCollection_collectedArtistsConnection")
      includePersonalArtists: true
    ) {
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
`

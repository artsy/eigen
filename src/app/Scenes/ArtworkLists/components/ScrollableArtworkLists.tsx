import { Flex, Join, Spacer, Text, useSpace } from "@artsy/palette-mobile"
import { times } from "lodash"
import { ScrollView } from "react-native"

const artworkLists = times(20).map((index) => ({
  name: `Artwork List #${index}`,
  artworksCount: index * 10,
}))

export const ScrollableArtworkLists = () => {
  const space = useSpace()

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: space(2), paddingBottom: space(2) }}>
      <Join separator={<Spacer y={1} />}>
        {artworkLists.map((artworkList, index) => {
          return (
            <Flex key={`artwork-list-${index}`}>
              <Text variant="xs">{artworkList.name}</Text>
              <Text variant="xs" color="black60">
                {artworkList.artworksCount} Artworks
              </Text>
            </Flex>
          )
        })}
      </Join>
    </ScrollView>
  )
}

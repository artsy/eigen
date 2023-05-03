import { Flex, Spacer, Text, useSpace } from "@artsy/palette-mobile"
import { ScrollView } from "react-native"

export const MyCollectionCollectedArtistsRail = () => {
  const space = useSpace()

  return (
    <ScrollView horizontal contentContainerStyle={{ paddingTop: space(2) }}>
      <Artist />
      <Spacer x={2} />
      <Artist />
      <Spacer x={2} />
      <Artist />
    </ScrollView>
  )
}

export const ARTIST_CIRCLE_DIAMETER = 80

const Artist: React.FC = () => {
  return (
    <Flex width={ARTIST_CIRCLE_DIAMETER}>
      <Flex
        height={ARTIST_CIRCLE_DIAMETER}
        width={ARTIST_CIRCLE_DIAMETER}
        borderRadius={ARTIST_CIRCLE_DIAMETER / 2}
        backgroundColor="black10"
      ></Flex>
      <Text variant="xs" numberOfLines={2} textAlign="center">
        Artist Name
      </Text>
    </Flex>
  )
}

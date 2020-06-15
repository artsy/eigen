import { color, Flex, Image, Sans, Spacer } from "@artsy/palette"
import { extractNodes } from "lib/utils/extractNodes"
import React from "react"
import { View } from "react-native"
import { ViewingRoomsListItemProps } from "./ViewingRoomsListItem"

export const ViewingRoomSmallCard: React.FC<ViewingRoomsListItemProps> = ({
  item: { title, artworksConnection, heroImageURL },
}) => {
  const artworks = extractNodes(artworksConnection)

  return (
    <View style={{ backgroundColor: "orange" }}>
      <View style={{ backgroundColor: "yellow", width: "100%", aspectRatio: 1.5 / 1.0, flexDirection: "row" }}>
        <Flex flex={2} background="green">
          {heroImageURL ? <Image src={heroImageURL!} /> : <Flex flex={1} background={color("black10")} />}
        </Flex>
        <Spacer mr={0.3} />
        <Flex style={{ flex: 1, backgroundColor: "blue" }}>
          {heroImageURL ? <Image src={heroImageURL!} /> : <Flex flex={1} background={color("black10")} />}
          {artworks.length >= 2 && <Image src={heroImageURL!} />}
        </Flex>
      </View>
      <Sans size="3t">{title}</Sans>
    </View>
  )
}

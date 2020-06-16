import { color, Flex, Sans, Spacer } from "@artsy/palette"
import { extractNodes } from "lib/utils/extractNodes"
import React from "react"
import { Image, View } from "react-native"
import { ViewingRoomsListItemProps } from "./ViewingRoomsListItem"

export const ViewingRoomSmallCard: React.FC<ViewingRoomsListItemProps> = ({
  item: { title, artworksConnection, heroImageURL, partner },
}) => {
  const artworkUrls = extractNodes(artworksConnection).map(a => ({
    regular: a.image!.regular!,
    square: a.image!.square!,
  }))

  return (
    <View>
      <View
        style={{ width: "100%", aspectRatio: 1.5 / 1.0, flexDirection: "row", borderRadius: 4, overflow: "hidden" }}
      >
        <Flex flex={2} background={color("black10")}>
          {!!heroImageURL && <Image source={{ uri: heroImageURL! }} style={{ flex: 1 }} />}
        </Flex>
        <Spacer mr={0.3} />
        <Flex flex={1}>
          {artworkUrls.length === 0 && <Flex flex={1} background={color("black10")} />}
          {!!artworkUrls[0] && (
            <Image
              source={{ uri: artworkUrls.length === 1 ? artworkUrls[0].regular : artworkUrls[0].square }}
              style={{ flex: 1 }}
            />
          )}
          {artworkUrls.length > 1 && (
            <>
              <Spacer mt={0.3} />
              <Image source={{ uri: artworkUrls[1].square }} style={{ flex: 1 }} />
            </>
          )}
        </Flex>
      </View>
      <Spacer mt={1} />
      <Sans size="3t" weight="medium">
        {title}
      </Sans>
      <Sans size="3t" color={color("black60")}>
        {partner!.name!}
      </Sans>
    </View>
  )
}

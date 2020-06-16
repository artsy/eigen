import { color, Flex, Sans, space, Spacer } from "@artsy/palette"
import React from "react"
import { Image, View } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { ViewingRoomsListItemProps } from "./ViewingRoomsListItem"

export const ViewingRoomMediumCard: React.FC<ViewingRoomsListItemProps> = ({
  item: { title, heroImageURL, partner },
}) => (
  <View>
    <View style={{ width: "100%", aspectRatio: 1.0 / 1.33, flexDirection: "row" }}>
      <Flex flex={2} background={color("black10")}>
        {!!heroImageURL && <Image source={{ uri: heroImageURL! }} style={{ flex: 1 }} />}
      </Flex>
      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)"]}
        style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.15 }}
      />
      <Flex style={{ position: "absolute", bottom: 0, left: space(1), right: space(1) }}>
        <Sans size="5t" color={color("white100")}>
          {title}
        </Sans>
        <Sans size="3t" color={color("white100")}>
          {partner!.name!}
        </Sans>
        <Spacer mt={1} />
      </Flex>
    </View>
  </View>
)

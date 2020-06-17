import { color, Flex, Sans, space, Spacer } from "@artsy/palette"
import React from "react"
import { Image, View } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { Tag } from "./Tag"
import { ViewingRoomsListItemProps } from "./ViewingRoomsListItem"
import { useTempStatus } from "./ViewingRoomSmallCard"

export const ViewingRoomMediumCard: React.FC<ViewingRoomsListItemProps> = ({
  item: { title, heroImageURL, partner },
}) => {
  const { text, textColor, color: bgColor, borderColor } = useTempStatus()

  return (
    <View style={{ width: "100%", aspectRatio: 1.0 / 1.33, flexDirection: "row", borderRadius: 4, overflow: "hidden" }}>
      <Flex flex={2} background={color("black10")}>
        {!!heroImageURL && <Image source={{ uri: heroImageURL! }} style={{ flex: 1 }} />}
      </Flex>
      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)"]}
        style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.15 }}
      />
      <Flex style={{ position: "absolute", bottom: 0, left: space(1), right: space(6) }}>
        <Sans size="5t" color={color("white100")}>
          {title}
        </Sans>
        <Sans size="3t" color={color("white100")}>
          {partner!.name!}
        </Sans>
        <Spacer mt={1} />
      </Flex>
      <Tag
        text={text}
        textColor={textColor}
        color={bgColor}
        borderColor={borderColor}
        style={{ position: "absolute", top: space(1), left: space(1) }}
      />
    </View>
  )
}

import { Box, Flex, Image, Sans, space, Spacer } from "@artsy/palette"
import React from "react"
import { View } from "react-native"
import { ViewingRoomsListItemProps } from "./ViewingRoomsListItem"

export const ViewingRoomSmallCard: React.FC<ViewingRoomsListItemProps> = ({ item: { title } }) => (
  <View style={{ backgroundColor: "orange" }}>
    <View style={{ backgroundColor: "yellow", height: 10, aspectRatio: 1 }}>
      <Flex style={{ flex: 2, backgroundColor: "red" }}></Flex>
      <Spacer mr={0.3} />
      <Flex style={{ flex: 1, backgroundColor: "blue" }}></Flex>
    </View>
    <Sans size="3t">{title}</Sans>
  </View>
)

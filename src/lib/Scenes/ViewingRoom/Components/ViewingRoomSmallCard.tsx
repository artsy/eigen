import { Box, Flex, Sans, space, Spacer } from "@artsy/palette"
import React from "react"
import { View } from "react-native"
import { ViewingRoomsListItemProps } from "./ViewingRoomsListItem"

export const ViewingRoomSmallCard: React.FC<ViewingRoomsListItemProps> = ({ item: { title } }) => (
  <View style={{ backgroundColor: "orange" }}>
    <View style={{ backgroundColor: "yellow", height: 0, paddingBottom: "66%", overflow: "hidden" }}>
      <View style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, flex: 1, flexDirection: "row" }}>
        <Flex style={{ flex: 2, backgroundColor: "red" }}></Flex>
        <Spacer mr={0.3} />
        <Flex style={{ flex: 1, backgroundColor: "blue" }}></Flex>
      </View>
    </View>
    <Sans size="3t">{title}</Sans>
  </View>
)

import React from "react"
import { LotsByFollowedArtists } from "../LotsByFollowedArtists"
import { ScrollView } from "react-native"
import { storiesOf } from "@storybook/react-native"

storiesOf("Home/Relay/Auctions").add("LotsByFollowedArtists", () =>
  <ScrollView>
    <LotsByFollowedArtists />
  </ScrollView>
)

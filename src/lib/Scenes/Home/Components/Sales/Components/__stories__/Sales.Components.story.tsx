import { storiesOf } from "@storybook/react-native"
import React from "react"
import { ScrollView } from "react-native"
import { LotsByFollowedArtists } from "../LotsByFollowedArtists"

storiesOf("Home/Relay/Auctions").add("LotsByFollowedArtists", () =>
  <ScrollView>
    <LotsByFollowedArtists />
  </ScrollView>
)

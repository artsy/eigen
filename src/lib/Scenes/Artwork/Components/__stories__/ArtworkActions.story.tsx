import { storiesOf } from "@storybook/react-native"
import React from "react"
import { ArtworkActions } from "../ArtworkActions"

storiesOf("Artwork/Components").add("All Actions", () => {
  return <ArtworkActions artwork={{ __id: "Blah", _id: "HI", is_saved: false, " $refType": null }} />
})

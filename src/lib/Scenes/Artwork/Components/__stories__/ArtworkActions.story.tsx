import { storiesOf } from "@storybook/react-native"
import React from "react"
import { ArtworkActions } from "../ArtworkActions"

storiesOf("Artwork/Components").add("All Actions", () => {
  return <ArtworkActions artwork={{ id: "Blah", internalID: "HI", is_saved: false, " $refType": null }} />
})

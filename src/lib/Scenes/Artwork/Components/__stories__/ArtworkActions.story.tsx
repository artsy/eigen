import { storiesOf } from "@storybook/react-native"
import React from "react"
import { RelayProp } from "react-relay"
import { ArtworkActions } from "../ArtworkActions"

storiesOf("Artwork/Components").add("All Actions", () => {
  return (
    <ArtworkActions
      relay={{ environment: {} } as RelayProp}
      artwork={{
        id: "blah",
        internalID: "HI",
        is_saved: false,
        " $refType": null,
        title: "Test title",
        artists: [
          {
            name: "Andreas Rod",
          },
          {
            name: "Arthur Sopin",
          },
        ],
      }}
    />
  )
})

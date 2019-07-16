import { storiesOf } from "@storybook/react-native"
import React from "react"
import { RelayProp } from "react-relay"
import { ArtworkActions } from "../ArtworkActions"

storiesOf("Artwork/Components").add("All Actions", () => {
  return (
    <ArtworkActions
      relay={{ environment: {} } as RelayProp}
      artwork={{
        id: "Blah",
        title: "Untitled",
        internalID: "HI",
        slug: "andread-rod-prinzknecht",
        href: "/artwork/andreas-rod-prinzknecht",
        is_saved: false,
        artists: [
          {
            name: "Abbas Kiarostami",
          },
        ],
        heightCm: 10,
        widthCm: 10,
        image: {
          url: "image.com/image",
        },
        " $refType": null,
      }}
    />
  )
})

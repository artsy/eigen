import { storiesOf } from "@storybook/react-native"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import React from "react"
import { RelayProp } from "react-relay"
import { ArtworkActions } from "../ArtworkActions"

storiesOf("Artwork/Components").add("All Actions", () => {
  return <ArtworkActions relay={{ environment: {} } as RelayProp} artwork={ArtworkFixture} />
})

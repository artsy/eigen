import { NativeModules } from "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import { ArtistHeaderContainer } from "../ArtistHeader"

import { Theme } from "@artsy/palette"

beforeAll(() => {
  NativeModules.ARTemporaryAPIModule = { followStatusForArtist: jest.fn() }
})

it("renders without throwing an error", () => {
  const artist = {
    internalID: "some-id",
    id: "marcel-duchamp",
    name: "Marcel Duchamp",
    nationality: "French",
    birthday: "11/17/1992",
    counts: {
      follows: 22,
    },
  }
  renderer.create(
    <Theme>
      <ArtistHeaderContainer artist={artist as any} />
    </Theme>
  )
})

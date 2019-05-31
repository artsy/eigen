import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import Biography from "../Biography"

import { Theme } from "@artsy/palette"

it("renders properly", () => {
  const artist = {
    bio: "Born 1922, Germany",
    blurb: "Once lived in a room with a live coyote for several days to protest the Vietnam War",
  }
  const biography = renderer
    .create(
      <Theme>
        <Biography artist={artist as any} />
      </Theme>
    )
    .toJSON()
  expect(biography).toMatchSnapshot()
})

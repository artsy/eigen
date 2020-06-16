import React from "react"
import * as renderer from "react-test-renderer"

import { Carousel } from "../Carousel"

import { Theme } from "@artsy/palette"

describe("Carousel", () => {
  it("renders without throwing an error", () => {
    const sources = [{ imageURL: "https://staging.artsy.net", aspectRatio: 1.0 }]
    renderer.create(
      <Theme>
        <Carousel sources={sources} />
      </Theme>
    )
  })
})

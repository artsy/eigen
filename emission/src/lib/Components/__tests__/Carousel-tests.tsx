import React from "react"
import * as renderer from "react-test-renderer"

import { Carousel } from "../Carousel"

import { Theme } from "@artsy/palette"

describe("Carousel", () => {
  it("renders properly", () => {
    const sources = [{ imageURL: "https://staging.artsy.net", aspectRatio: 1.0 }]
    const carousel = renderer.create(
      <Theme>
        <Carousel sources={sources} />
      </Theme>
    )
    expect(carousel).toMatchSnapshot()
  })
})

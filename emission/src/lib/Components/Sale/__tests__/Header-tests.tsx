import React from "react"
import * as renderer from "react-test-renderer"

import Header from "../Header"

import { Theme } from "@artsy/palette"

it("renders properly", () => {
  const sale = {
    name: "The Awesome Sale",
    cover_image: {
      href: "http://example.com/some/image.jpg",
    },
  }
  const header = renderer
    .create(
      <Theme>
        <Header sale={sale as any} showImage={false} />
      </Theme>
    )
    .toJSON()
  expect(header).toMatchSnapshot()
})

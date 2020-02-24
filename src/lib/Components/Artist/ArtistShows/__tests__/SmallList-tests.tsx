import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import SmallList from "../SmallList"

import { Theme } from "@artsy/palette"

it("renders properly", () => {
  const show1 = showProps()
  const show2 = showProps()
  show2.partner.name = "A Different Gallery"
  show2.kind = "fair"

  const shows = [show1, show2]

  const list = renderer
    .create(
      <Theme>
        <SmallList shows={shows as any} />
      </Theme>
    )
    .toJSON()
  expect(list).toMatchSnapshot()
})

const showProps = () => {
  return {
    href: "artsy.net/show",
    cover_image: {
      url: "artsy.net/image-url",
    },
    kind: "solo",
    name: "Expansive Exhibition",
    exhibition_period: "Jan 1 - March 1",
    status_update: "Closing in 2 days",
    status: "running",
    partner: {
      name: "Gallery",
    },
    location: {
      city: "Berlin",
    },
  }
}

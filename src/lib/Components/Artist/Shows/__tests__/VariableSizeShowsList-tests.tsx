import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import ShowsList from "../VariableSizeShowsList"

import { Theme } from "@artsy/palette"

it("renders properly", () => {
  const show1 = showProps(1)
  const show2 = showProps(2)
  show2.partner.name = "A Very Nice Gallery"
  show2.location.city = "London"

  const shows = [show1, show2]
  const list = renderer
    .create(
      <Theme>
        <ShowsList shows={shows as any} showSize={"medium"} />
      </Theme>
    )
    .toJSON()
  expect(list).toMatchSnapshot()
})

const showProps = n => {
  return {
    id: `show-expansive-exhibition-${n}`,
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

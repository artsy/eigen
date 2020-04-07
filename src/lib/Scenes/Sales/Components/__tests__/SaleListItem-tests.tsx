import moment from "moment"
import React from "react"
import "react-native"

import * as renderer from "react-test-renderer"
import SaleListItem from "../SaleListItem"

import { Theme } from "@artsy/palette"

it("renders correctly", () => {
  const sale = renderer.create(
    <Theme>
      <SaleListItem sale={props as any} containerWidth={750} />
    </Theme>
  )
  expect(sale).toMatchSnapshot()
})

const props = {
  id: "freemans-modern-and-contemporary-works-of-art",
  name: "Freeman's: Modern & Contemporary Works of Art",
  href: "http://foo.bar",
  is_open: true,
  is_live_open: false,
  start_at: moment()
    .add(2, "hour")
    .toISOString(),
  end_at: null,
  registration_ends_at: moment()
    .subtract(1, "day")
    .toISOString(),
  live_start_at: moment()
    .add(5, "hour")
    .toISOString(),
  live_url_if_open: null,
  displayTimelyAt: "Live in 2 hours",
  cover_image: {
    url: "https://d32dm0rphc51dk.cloudfront.net/eeqLfwMMAYA8XOmeYEb7Rg/source.jpg",
  },
}

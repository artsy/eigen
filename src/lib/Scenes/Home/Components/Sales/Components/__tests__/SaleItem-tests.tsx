import moment from "moment"
import React from "react"
import "react-native"

import * as renderer from "react-test-renderer"
import SaleItem from "../SaleItem"

it("renders correctly", () => {
  const sale = renderer.create(<SaleItem sale={props} />) as any
  expect(sale).toMatchSnapshot()
})

const props = {
  id: "freemans-modern-and-contemporary-works-of-art",
  name: "Freeman's: Modern & Contemporary Works of Art",
  is_open: true,
  is_live_open: false,
  start_at: moment().add(2, "hour").toISOString(),
  end_at: null,
  registration_ends_at: moment().subtract(1, "day").toISOString(),
  live_start_at: moment().add(5, "hour").toISOString(),
  cover_image: {
    cropped: {
      url:
        "https://d7hftxdivxxvm.cloudfront.net/?resize_to=fill&width=158&height=196&q…A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FeeqLfwMMAYA8XOmeYEb7Rg%2Fsource.jpg",
    },
  },
}

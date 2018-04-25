import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { ConfirmBid } from "../ConfirmBid"

it("renders properly", () => {
  const saleArtwork = {
    artwork: {
      title: "Meteor Shower",
      date: "2015",
      artist_names: "Makiko Kudo",
    },
    lot_label: "538",
  }
  const bg = renderer
    .create(<ConfirmBid sale_artwork={saleArtwork} bid={{ cents: 450000, display: "$45,000" }} />)
    .toJSON()
  expect(bg).toMatchSnapshot()
})

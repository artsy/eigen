import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { ConfirmBid } from "../ConfirmBid"

it("renders properly", () => {
  jest.useFakeTimers()

  const saleArtwork = {
    artwork: {
      id: "meteor shower",
      title: "Meteor Shower",
      date: "2015",
      artist_names: "Makiko Kudo",
    },
    sale: {
      id: "best art sale in town",
    },
    lot_label: "538",
  }

  const component = renderer
    .create(<ConfirmBid sale_artwork={saleArtwork} bid={{ cents: 450000, display: "$45,000" }} />)
    .toJSON()

  expect(component).toMatchSnapshot()
})

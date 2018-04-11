import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { SelectMaxBid } from "../SelectMaxBid"

it("renders properly", () => {
  const bg = renderer.create(<SelectMaxBid saleArtworkID="5aada729139b216c0bf18103" />).toJSON()
  expect(bg).toMatchSnapshot()
})

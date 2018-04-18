import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { BidFlow } from "../BidFlow"

it("renders properly", () => {
  const bg = renderer.create(<BidFlow saleArtworkID="5aada729139b216c0bf18103" />).toJSON()
  expect(bg).toMatchSnapshot()
})

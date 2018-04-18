import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { ConfirmBid } from "../ConfirmBid"

it("renders properly", () => {
  const bg = renderer.create(<ConfirmBid saleArtworkID="5aada729139b216c0bf18103" bidAmountCents={4500000} />).toJSON()
  expect(bg).toMatchSnapshot()
})

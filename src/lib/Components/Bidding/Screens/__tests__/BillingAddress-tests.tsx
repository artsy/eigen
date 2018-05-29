import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { BillingAddress } from "../BillingAddress"

it("renders properly", () => {
  const component = renderer.create(<BillingAddress />).toJSON()
  expect(component).toMatchSnapshot()
})

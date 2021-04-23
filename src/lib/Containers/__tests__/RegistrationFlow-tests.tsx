import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"

import { RegistrationFlow } from "../RegistrationFlow"
jest.mock("lib/relay/createEnvironment", () => ({
  defaultEnvironment: require("relay-test-utils").createMockEnvironment(),
  reset(this: { defaultEnvironment: any }) {
    this.defaultEnvironment = require("relay-test-utils").createMockEnvironment()
  },
}))

jest.unmock("react-relay")

describe("the registration flow", () => {
  it("renders without throwing an error", () => {
    renderWithWrappers(<RegistrationFlow saleID="some-sale" />)
  })
})

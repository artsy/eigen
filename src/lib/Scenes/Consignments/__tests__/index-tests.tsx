import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"

jest.unmock("react-relay")
jest.mock("@react-native-community/cameraroll", () => jest.fn())

jest.mock("lib/relay/createEnvironment", () => ({
  defaultEnvironment: require("relay-test-utils").createMockEnvironment(),
  reset(this: { defaultEnvironment: any }) {
    this.defaultEnvironment = require("relay-test-utils").createMockEnvironment()
  },
}))

import { Consignments } from "../"

it("renders without throwing an error", () => {
  const props: any = { navigator: {}, route: {} }

  renderWithWrappers(<Consignments {...props} />)
})

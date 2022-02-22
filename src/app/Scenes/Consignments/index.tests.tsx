import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"

jest.mock("@react-native-community/cameraroll", () => jest.fn())

import { Consignments } from "./"

jest.unmock("react-relay")

it("renders without throwing an error", () => {
  const props: any = { navigator: {}, route: {} }

  renderWithWrappers(<Consignments {...props} />)
})

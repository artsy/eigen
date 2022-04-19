import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import "react-native"

jest.mock("@react-native-community/cameraroll", () => jest.fn())

import { SellWithArtsy } from "."

jest.unmock("react-relay")

it("renders without throwing an error", () => {
  const props: any = { navigator: {}, route: {} }

  renderWithWrappersTL(<SellWithArtsy {...props} />)
})

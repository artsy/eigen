import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"

import { Modal } from "../Modal"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
  renderWithWrappers(
    <Theme>
      <Modal headerText="An error occurred" detailText="This is an error moop." />
    </Theme>
  )
})

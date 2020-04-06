import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { Modal } from "../Modal"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
  renderer.create(
    <Theme>
      <Modal headerText="An error occurred" detailText="This is an error moop." />
    </Theme>
  )
})

import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { Modal } from "../Modal"

import { Theme } from "@artsy/palette"

it("looks like expected", () => {
  const tree = renderer
    .create(
      <Theme>
        <Modal headerText="An error occurred" detailText="This is an error moop." />
      </Theme>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

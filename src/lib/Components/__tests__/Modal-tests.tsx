import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { Modal } from "../Modal"

it("looks like expected", () => {
  const tree = renderer
    .create(
      // tslint:disable-next-line:no-empty
      <Modal headerText="An error occurred" detailText="This is an error moop." />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

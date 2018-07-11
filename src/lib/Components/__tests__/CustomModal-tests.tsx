import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { CustomModal } from "../CustomModal"

it("looks like expected", () => {
  const tree = renderer
    .create(
      // tslint:disable-next-line:no-empty
      <CustomModal headerText="An error occurred" detailText="This is an error moop." />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

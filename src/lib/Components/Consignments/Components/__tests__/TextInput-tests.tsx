import "jest-snapshots-svg"
import * as React from "react"
import * as renderer from "react-test-renderer"
import Text from "../TextInput"

it("shows an activity indicator when searching ", () => {
  const component = renderer.create(<Text text={{ value: "My mocked" }} searching={true} />).toJSON()
  expect(component).toMatchSnapshot()
})

it("does not have an activity when searching ", () => {
  const component = renderer.create(<Text text={{ value: "My mocked" }} searching={true} />).toJSON()
  expect(component).toMatchSnapshot()
})

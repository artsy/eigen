import "jest-snapshots-svg"
import * as React from "react"
import * as renderer from "react-test-renderer"
import Toggle from "../Toggle"

it("looks good as an svg", () => {
  const component = renderer.create(<Toggle selected={true} left="L" right="R" />).toJSON()
  expect(component).toMatchSVGSnapshot(64, 40)
})

import "jest-snapshots-svg"
import * as React from "react"
import * as renderer from "react-test-renderer"
import BooleanButton from "../boolean_button"

it("looks good as an svg", () => {
  const component = renderer.create(<BooleanButton selected={true} left="L" right="R" />).toJSON()
  expect(component).toMatchSVGSnapshot(64, 40)
})
